const nodeMailer = require("nodemailer");
const sender = process.env.MAIL_FROM;
const sgMail = require("@sendgrid/mail");
const fs = require("fs");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

function generateMail(type, config) {
  const events = {
    "send-audit-report": require("./events/auditReport"),
    "send-dashboard-report": require("./events/dashboardReport"),
    "welcome-to-ims": require("./events/welcome"),
    "access-revoked": require("./events/accessRevoked"),
    "removed-from-bu": require("./events/removedFromBu"),
    "demo-bookings": require("./events/booking"),
    "get-started": require("./events/getstarted"),
    "forgot-password": require("./events/forgotPassword"),
    "password-changed": require("./events/passwordChanged"),
    "incorrect-login-attempt": require("./events/incorrectLoginAttempt"),
    "org-account-blocked": require("./events/accountIsBlocked"),
    "org-account-past-due": require("./events/accountPastDueAlert"),
    "org-account-reactivated": require("./events/accountReactivated"),
    "new-ims-licence-request": require("./events/newImsLicenseRequest"),
    "email-verification": require("./events/emailVerification"),
    "new-customer-signup": require("./events/newCustomerSignUp"),
    "licence-request-processed": require("./events/licenseRequestProcessed"),
    "licence-request-cancelled": require("./events/licenseRequestCancelled"),
    "license-request-recieved-confirmation": require("./events/licenceRequestRecievedConfirmation"),
    "new-role-granted": require("./events/newRole"),
    "complaint-investigation": require("./events/complaintInvestigation"),
    "cqc-report": require("./events/cqcReport"),
    "cqc-safeguarding-refered": require("./events/cqcSafeguarding"),
    "customer-invoice": require("./events/customerInvoice"),
    "customer-campaign": require("./events/customerCampaign"),
    "system-updates": require("./events/systemupdates"),
    "user-notification": require("./events/usernotification"),
    "ask-for-document-signature": require("./events/askForDocumentSignature"),
    "send-signed-copy-to-signee": require("./events/sendSignedCopyToSignee"),
    "share-document": require("./events/shareDocument"),
    "system-dates-ended": require("./events/systemDatesEnded"),
    "demo-request-recieved-confirmation": require("./events/demoRequestRecievedConfirmation"),
    //will be implement leter
    "account-invitation": require("./events/accountInvitaion"),
    "account-recovery": require("./events/accountRecovery"),
    "create-partnership": require("./events/partnershipCreation"),
    "accept-partnership": require("./events/acceptPartnership"),
    "bug-report-forward": require("./events/bugReportForwardToiMS"),
    "bug-report-confirmation": require("./events/bugReportRecievedConfirmation"),
    "onboard-success": require("./events/onboardSuccess"),
    "register-interest-success": require("./events/registerInterestSuccess"),
    "txn-email-invitation": require("./events/txnEmailInvitaion"),
    "new-project-created": require("./events/newProjectCreated"),
  };
  const builder = events[type];
  if (!builder) throw new Error("No event.");
  return builder({ payload: config.payload });
}

const usingOutlook = (type, receiver, payload, config) => {
  return new Promise(async (resolve, reject) => {
    try {
      let generatedMail = await generateMail(type, { payload });
      let mailOptions = {
        from: `iMS Systems ${sender}`,
        to: receiver,
        subject: generatedMail.subject,
        html: generatedMail.template,
        attachments: payload.attachments
          ? payload.attachments.map((attachment) => ({
              ...attachment,
              content: fs.readFileSync(attachment.path).toString("base64"),
            }))
          : [],
      };
      var transporter = nodeMailer.createTransport({
        host: "smtp-mail.outlook.com", // hostname
        secureConnection: false, // TLS requires secureConnection to be false
        port: 587, // port for secure SMTP
        tls: {
          ciphers: "SSLv3",
        },
        auth: {
          user: "hello@imssystems.tech",
          pass: "Mothertree@43",
        },
      });
      // send mail with defined transport object
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          logger.info(error);
          return reject({
            error,
          });
        }
        resolve({
          msg: "Email sent successfully ",
          sentDetails,
        });
        logger.info("Message sent: ", { response: info.response });
      });
    } catch (err) {
      reject({
        msg: "Failed to send email ",
        error: err,
      });
    }
  });
};
const usingSendGrid = (type, receiver, payload, config) => {
  return new Promise(async (resolve, reject) => {
    try {
      let generatedMail = await generateMail(type, { payload });
      let mailOptions = {
        from: {
          name: "iMS Systems",
          email: sender,
        },
        to: receiver,
        replyTo: config.replyTo || sender,
        subject: payload.subject || generatedMail.subject,
        html: generatedMail.template,
        trackingSettings: {
          clickTracking: {
            enable: false,
            enableText: false,
          },
          openTracking: {
            enable: true,
          },
        },
        attachments: payload.attachments
          ? payload.attachments.map((attachment) => ({
              ...attachment,
              content: fs.readFileSync(attachment.path).toString("base64"),
            }))
          : [],
      };
      let sentDetails = config.multiple
        ? await sgMail.sendMultiple(mailOptions)
        : await sgMail.send(mailOptions);
      resolve({
        msg: "Email sent successfully ",
        sentDetails,
      });
    } catch (err) {
      reject({
        msg: "Failed to send email ",
        error: err,
      });
    }
  });
};
exports.sendMail = (
  type,
  receiver,
  payload,
  config = {
    multiple: true,
    service: "sendgrid",
    replyTo: null,
  }
) => {
  switch (config.service) {
    case "sendgrid":
      return usingSendGrid(type, receiver, payload, config);
    case "outlook":
      return usingOutlook(type, receiver, payload, config);
    default:
      return usingSendGrid(type, receiver, payload, config);
  }
};
