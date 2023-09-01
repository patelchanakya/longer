import { Stripe } from "stripe";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-08-16",
});
const webhookSecret = process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET as string;

const relevantEvents = new Set(["checkout.session.completed"]);

export async function POST(request: Request) {
  try {
    const res = await request.text();
    const headersList = request?.headers;

    if (!headersList) {
      return new Response(JSON.stringify({ error: 'Request headers are undefined' }), { status: 400 });
    }

    console.log("req-----------------------", headersList);

    const sig = headersList.get("stripe-signature") as string;

    if (!sig || !webhookSecret) {
      return new Response(JSON.stringify({ error: 'Missing signature or webhook secret' }), { status: 400 });
    }

    const stripeEvent = stripe.webhooks.constructEvent(res, sig, webhookSecret);
    console.log("stripeEvent-----------------------", stripeEvent);

    if (relevantEvents.has(stripeEvent.type)) {
      console.log("relevantEvents-----------------------", relevantEvents);

      switch (stripeEvent.type) {
        case "checkout.session.completed":
          const checkoutSession = stripeEvent.data.object as Stripe.Checkout.Session;
          const lineItems = await stripe.checkout.sessions.listLineItems(checkoutSession.id);

          const supabase = createServerComponentClient({ cookies });
          const customerEmail = checkoutSession.customer_email;

          lineItems.data.forEach(async (lineItem) => {
            const clientref = checkoutSession.client_reference_id;
            let creditstoadd;

            if (lineItem.price) {
              const amounttot = lineItem.amount_total;

              switch (amounttot) {
                case 400:
                  creditstoadd = 250;
                  break;
                case 1000:
                  creditstoadd = 500;
                  break;
                case 2000:
                  creditstoadd = 1000;
                  break;
                case 5000:
                  creditstoadd = 2000;
                  break;
              }

              let { data: curr_user_credits } = await supabase
                .from('user_credits')
                .select('credit_amount')
                .eq('user_id', clientref)

              let updatedCredits = 0;
              if (curr_user_credits && curr_user_credits[0]) {
                updatedCredits = creditstoadd + curr_user_credits[0].credit_amount as number;
              }

              const { error } = await supabase
                .from('user_credits')
                .update({ credit_amount: updatedCredits })
                .eq('user_id', clientref)

              if (error) {
                console.error('Error updating user credits:', error);
              }
            }
          });
          break;
      }

      // return a response to acknowledge receipt of the event that payment was successful
      return new Response(JSON.stringify({ received: true }));
    } else {
      return new Response(JSON.stringify({ error: `Unhandled event type: ${stripeEvent.type}` }), { status: 400 });
    }
  } catch (error: any) {
    console.error('Error handling Stripe event:', error);
    return new Response(
      JSON.stringify({
        message: "Webhook handler failed. View your nextjs function logs.",
        error: error.message,
      }),
      {
        status: 500,
      }
    );
  }
}