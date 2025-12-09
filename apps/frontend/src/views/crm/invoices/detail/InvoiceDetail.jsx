import Loading from "@/components/Loader/Loading";
import useProcessingControl from "@/hooks/useProcessingControl";
import React from "react";
import { getInvoice, mapToInvoiceModel } from "@/services/invoicesServices";
import ErrorHandlerComponent from "@/views/shared/ErrorHandlerComponent";
import USER_ACTIONS from "../actions";
import InvoiceForm from "../InvoiceForm";
import { useInvoice } from "../store";

const InvoiceDetail = ({ ...props }) => {
  let {
    processing,
    visitingInvoice,
    organisationInfo,
    updateAndSendInvoice,
    updateInvoice,
    downloadInvoice,
    payment,
    resendInvoice,
  } = useInvoice();
  return (
    <div className="content">
      <ErrorHandlerComponent
        hasError={processing[USER_ACTIONS.LOAD_INVOICE].error}
        errorMessage="This invoice has been deleted or removed"
      >
        {processing[USER_ACTIONS.LOAD_INVOICE].status ? (
          <Loading />
        ) : (
          <>
            {visitingInvoice && (
              <InvoiceForm
                customer={visitingInvoice.customer}
                visitingInvoice={visitingInvoice}
                organisationInfo={organisationInfo}
                onSubmit={async (data) => {
                  await updateInvoice(data);
                }}
                onSaveAndSendInvoice={async (data) => {
                  await updateAndSendInvoice(data);
                }}
                onDownload={async (data) => {
                  await downloadInvoice();
                }}
                onPayment={async (data) => {
                  await payment(data);
                }}
                onResendInvoice={async (data) => {
                  await resendInvoice(data);
                }}
              />
            )}
          </>
        )}
      </ErrorHandlerComponent>
    </div>
  );
};

export default InvoiceDetail;
