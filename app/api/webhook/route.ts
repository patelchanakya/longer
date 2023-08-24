import { Stripe } from "stripe";
import { buffer } from "micro";
// import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
// import { useRouter } from "next/router";
// import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-08-16",
});
const webhookSecret = process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET as string;

const relevantEvents = new Set(["checkout.session.completed"]);

export async function POST(request: Request) {

  const res = await request.text();
  const headersList = headers();

  console.log("req-----------------------", headersList);

  const sig = headersList.get("stripe-signature") as string;

  let stripeEvent: Stripe.Event;

  try {
    if (!sig || !webhookSecret) return;
    stripeEvent = stripe.webhooks.constructEvent(res, sig, webhookSecret);
    // return new Response(JSON.stringify({ error: 'Missing signature or webhook secret' }), { status: 400 });
    console.log("stripeEvent-----------------------", stripeEvent);
  } catch (err: any) {
    console.error('Error constructing Stripe event:', err);
    return new Response(JSON.stringify({ error: `Webhook Error: ${err.message}` }), { status: 400 });
  }

  if (relevantEvents.has(stripeEvent.type)) {
    console.log("relevantEvents-----------------------", relevantEvents);

    try {
      switch (stripeEvent.type) {
        case "checkout.session.completed":
          // const checkoutSess = stripeEvent.data.object as any;
          //  // Fetch the line items for this session
          const checkoutSession = stripeEvent.data
            .object as Stripe.Checkout.Session;

          const lineItems = await stripe.checkout.sessions.listLineItems(checkoutSession.id);

          const supabase = createServerComponentClient({ cookies });
          const customerEmail = checkoutSession.customer_email;


          lineItems.data.forEach(async (lineItem) => {
            const clientref = checkoutSession.client_reference_id;
            let creditstoadd;


            if (lineItem.price) {
              const amounttot = lineItem.amount_total;

              let creditstoadd;

              switch (amounttot) {
                case 400:
                  creditstoadd = 250; // update this value based on your logic
                  break;
                case 1000:
                  creditstoadd = 500; // update this value based on your logic
                  break;
                case 2000:
                  creditstoadd = 1000; // update this value based on your logic
                  break;
                case 5000:
                  creditstoadd = 2000; // update this value based on your logic
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
    // return a response to acknowledge receipt of the event that payment was successful
    return new Response(JSON.stringify({ received: true }));
  }
}
