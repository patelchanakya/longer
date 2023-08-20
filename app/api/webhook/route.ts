import { Stripe } from "stripe";
import { buffer } from "micro";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
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
  } catch (err: any) {
    console.log(` Error message: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (relevantEvents.has(stripeEvent.type)) {
    try {
      switch (stripeEvent.type) {
        case "checkout.session.completed":
          const checkoutSession = stripeEvent.data
            .object as Stripe.Checkout.Session;

          console.log("checkoutSession---------", checkoutSession);

          // once the checkout session is completed, we can associate a new user in the database
          // const customer = await stripe.customers.create({ email: customerEmail });

          const supabase = createServerComponentClient({ cookies });
          const customerEmail = checkoutSession.customer_email;
          const clientref = checkoutSession.client_reference_id;
          const amount = checkoutSession.amount_total;

          // determine credits purchased based on amount
          // if amount is 4, then 250 credit is purchased
          if (amount == 4) {
          }

          // use clientref to get the user id of the user who just paid
          // if first purchase, create a new row in user_credits table with the user id and the amount of credits purchased
          // if not first purchase, update the row in user_credits table according to the user id and the amount of credits purchased (add to the existing amount of credits)

          let { data: user_credits, error } = await supabase
            .from("user_credits")
            .select("id");

          // Redirect the user to the homepage
          break;
        default:
          throw new Error("Unhandled relevant event!");
      }
    } catch (error) {
      console.log(error);
      return new Response(
        "Webhook handler failed. View your nextjs function logs.",
        {
          status: 400,
        }
      );
    }
  }
  return new Response(JSON.stringify({ received: true }));
}
