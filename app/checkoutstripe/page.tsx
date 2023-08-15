import Script from "next/script";
import { FC } from "react";

declare global {
  export namespace JSX {
    interface IntrinsicElements {
      "stripe-pricing-table": {
        "pricing-table-id": string;
        "publishable-key": string;
        "client-reference-id"?: string;
      };
    }
  }
}
const pricingTableId = process.env.NEXT_PUBLIC_PRICING_TABLE_ID ?? "";
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";

const NextStripePricingTable: FC<{
  clientReferenceId?: string;
}> = ({ clientReferenceId }) => {
  // if (!pricingTableId || !publishableKey) return null;
  return (
    <>
      <stripe-pricing-table
        pricing-table-id={pricingTableId}
        publishable-key={publishableKey}
        // client-reference-id={clientReferenceId}
      />
    </>
  );
};

export default NextStripePricingTable;
