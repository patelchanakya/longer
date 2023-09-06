import { FC } from "react";

declare global {
  export namespace JSX {
    interface IntrinsicElements {
      "stripe-pricing-table": {
        "pricing-table-id": string;
        "publishable-key": string;
        "client-reference-id": string;
        "customer-email": string;
      };
    }
  }
}
const pricingTableId = process.env.NEXT_PUBLIC_PRICING_TABLE_ID as string;
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string;
const NextStripePricingTable: FC<{
  clientReferenceId: string;
  customerEmail: string;
}> = ({ clientReferenceId, customerEmail }) => {

  return (
    <>
      <stripe-pricing-table
        pricing-table-id={pricingTableId}
        publishable-key={publishableKey}
        client-reference-id={clientReferenceId}
        customer-email={customerEmail}
      />
    </>
  );
};

export default NextStripePricingTable;
