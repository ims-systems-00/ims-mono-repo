import { useState } from "react";
import { imsLogger } from "@/services/loggerService";
import {
  getCardpaymentSession,
  getBillingSession,
} from "../../../services/organizationService";
/**
 * this hook not recomended to use outside of this store in anny component directly.
 * the store exposes utility function based on this hook to maintain ui logics.
 */
export default function usePayment() {
  const [retrivingCheckoutSession, setRetrivingCheckoutSession] =
    useState(false);
  const [retrivingBillingSession, setRetrivingBillingSession] = useState(false);
  async function redirectToCheckout(orgid) {
    try {
      setRetrivingCheckoutSession(true);
      let { data } = await getCardpaymentSession(orgid);
      window.location.replace(data.paymentSession.url);
    } catch (err) {
      imsLogger(err);
    }
    setRetrivingCheckoutSession(false);
  }
  async function redirectToBilling(orgid) {
    try {
      setRetrivingBillingSession(true);
      let { data } = await getBillingSession(orgid);
      window.location.replace(data.billingSession.url);
    } catch (err) {
      imsLogger(err);
    }
    setRetrivingBillingSession(false);
  }
  return {
    retrivingCheckoutSession,
    retrivingBillingSession,
    redirectToCheckout,
    redirectToBilling,
  };
}
