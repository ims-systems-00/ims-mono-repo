const moment = require('moment')
module.exports = data => `
<!DOCTYPE html>
<html lang="en">
   <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" >
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="x-apple-disable-message-reformatting">
      <title>Audit internal audit report</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
      <style>
        /* *font-family: 'Poppins', sans-serif;*/
         * { margin:0; padding:0; box-sizing:border-box; -moz-box-sizing:border-box; -webkit-box-sizing:border-box;}
         *:before, *:after { box-sizing:border-box; -moz-box-sizing:border-box; -webkit-box-sizing:border-box;}
         img{ max-width:100% !important;}
         @media print {
           .break-before {
                page-break-before: always;
            }
            .special {
                margin-top: -1px;
            }
         }
      </style>
   </head>
   <body style="width:100% !important; margin:0 !important; padding:0 !important; -webkit-font-smoothing: antialiased !important; font-family: 'Poppins', sans-serif; font-style: normal; font-display: swap;">
      
      <table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" style="border-collapse: collapse !important;margin:0 auto !important;background-color: #ffffff;width: 595px;height: 842px;background-image: url(https://s3.eu-west-2.amazonaws.com/imssystems.tech/assets/images/cover_bg.jpg);background-size: cover;background-repeat: no-repeat;">
         <tr>
            <td valign="bottom" style="padding: 0px 0px 0px 0px;">
               <table bwidth="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                  <tr>
                     <td valign="bottom" style="padding: 0px 0px 0px 0px;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0">
                           <tr>
                              <td style="margin: 0;padding: 0;" align="center">
                                 <img src="https://s3.eu-west-2.amazonaws.com/imssystems.tech/assets/images/IMS_logo_full_blue_white.svg" style="vertical-align: middle;">
                              </td>
                           </tr>
                           <tr>
                              <td style="margin: 0;padding: 24px 45px 60px;" align="center">
                                 <p style="font-size: 16px;font-weight: 500;line-height: 1.5;text-align: center;color: #ffffff;font-family: 'Poppins', sans-serif;">Your operational key to live, up to the moment data giving you the power to make the best decisions for your business on time and at the right time.</p>
                              </td>
                           </tr>
                           <tr>
                              <td style="margin: 0;padding: 0 0 45px 0;" align="center">
                                 <img src="https://s3.eu-west-2.amazonaws.com/imssystems.tech/assets/images/add-vantage-logo.png" style="vertical-align: middle;">
                              </td>
                           </tr>
                        </table>
                     </td>
                  </tr>
               </table>
            </td>
         </tr>
      </table>

      <table class="break-before special" width="100%" border="0" cellpadding="0" cellspacing="0" align="center" style="border-collapse: collapse !important;margin:0 auto !important;background-color: #ffffff;width: 595px;height: 100%;">
         <tr>
            <td valign="top" style="padding: 0px 0px 0px 0px;">
               <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                  <tr>
                     <td valign="top" style="padding: 0px 0px 0px 0px;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;background-image: url(https://imssystems.tech/static/assets/images/hero.png);background-size: cover;background-repeat: no-repeat;">
                           <tr>
                              <td style="margin: 0;padding: 62px 24px 24px 24px;" align="left">
                                <h1 style="font-family: 'Poppins', sans-serif;font-size: 30px;font-weight: bold;line-height: 1.2;color: #fff;">${data.title} ${data.type.toLowerCase()} audit report</h1>
                              </td>
                           </tr>
                        </table>
                     </td>
                  </tr>
               </table>
            </td>
         </tr>
         <tr>
            <td valign="top" style="padding: 30px 24px 30px 24px;">
               <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                  <tr>
                     <td valign="top" style="padding: 0px 0px 20px 0px;margin: 0px 0px 0px 0px;border-bottom: solid 1px #d4d5d9">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                           <tr>
                              <th width="40%" align="left" style="margin: 0;padding: 0px 6px 6px 0px;font-family: 'Poppins', sans-serif;font-size: 16px;font-weight: 500;line-height: 1.38;letter-spacing: 0.34px;color: #1c2745;">Business Function
                              </th>
                              <th width="60%" align="left" style="margin: 0;padding: 0px 0px 6px 0px;font-family: 'Poppins', sans-serif;font-size: 16px;font-weight: 500;line-height: 1.38;letter-spacing: 0.34px;color: #1c2745;">Auditor's Name
                              </th>
                           </tr>
                           <tr>
                              <td style="margin: 0;font-family: 'Poppins', sans-serif;font-size: 14px;font-weight: normal;line-height: 1.43;letter-spacing: 0.3px;color: #808396;padding: 0px 6px 6px 0;">${data.group && data.group.name}</td>
                              <td style="margin: 0;font-family: 'Poppins', sans-serif;font-size: 14px;font-weight: normal;line-height: 1.43;letter-spacing: 0.3px;color: #808396;padding: 0px 0px 0px 0px;">${data.auditor && data.auditor.name}</td>
                           </tr>
                        </table>
                     </td>
                  </tr>
               </table>
            </td>
         </tr>
         <tr>
            <td valign="top" style="padding: 0px 24px 30px 24px;">
               <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                  <tr>
                     <td style="margin: 0;font-family: 'Poppins', sans-serif;font-size: 16px;font-weight: 600;letter-spacing: 0.34px;color: #16a4fa;">Details</td>
                  </tr>
                  <tr>
                     <td style="margin: 0;font-family: 'Poppins', sans-serif; font-size: 14px;line-height: 1.43;letter-spacing: 0.3px;color: #808396;">
                        <p style="font-family: 'Poppins', sans-serif; font-size: 14px;line-height: 1.43;letter-spacing: 0.3px;color: #808396;margin: 6px 0 0 0;">Title ${data.title}</p>
                        <p style="font-family: 'Poppins', sans-serif; font-size: 14px;line-height: 1.43;letter-spacing: 0.3px;color: #808396;margin: 6px 0 0 0;">Focus area ${data.focusArea}</p>
                     </td>
                  </tr>
               </table>
            </td>
         </tr>
         <tr>
            <td valign="top" style="padding: 0px 24px 30px 24px;">
               <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                  <tr>
                     <td style="margin: 0;font-family: 'Poppins', sans-serif;font-size: 16px;font-weight: 600;letter-spacing: 0.34px;color: #16a4fa;">Non conformities</td>
                  </tr>
                  <tr>
                     <td style="margin: 0;font-family: 'Poppins', sans-serif; font-size: 14px;line-height: 1.43;letter-spacing: 0.3px;color: #808396;">
                     ${data.identifications.map(identifications => `
                        <p style="font-family: 'Poppins', sans-serif; font-size: 14px;line-height: 1.43;letter-spacing: 0.3px;color: #808396;margin: 6px 0 0 0;">${identifications.nonConformity}</p>
                    `).join('')}
                     </td>
                  </tr>
               </table>
            </td>
         </tr>

         <tr>
            <td valign="top" style="padding: 0px 24px 30px 24px;">
               <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                  <tr>
                     <td style="margin: 0;font-family: 'Poppins', sans-serif;font-size: 16px;font-weight: 600;letter-spacing: 0.34px;color: #16a4fa;">Root cause</td>
                  </tr>
                  <tr>
                     <td style="margin: 0;font-family: 'Poppins', sans-serif; font-size: 14px;line-height: 1.43;letter-spacing: 0.3px;color: #808396;">
                     ${data.identifications.map(identifications => `
                        <p style="font-family: 'Poppins', sans-serif; font-size: 14px;line-height: 1.43;letter-spacing: 0.3px;color: #808396;margin: 6px 0 0 0;">${identifications.rootCause}</p>
                    `).join('')}
                     </td>
                  </tr>
               </table>
            </td>
         </tr>
         <tr>
            <td valign="top" style="padding: 0px 24px 30px 24px;">
                <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                <tr>
                    <td style="margin: 0;font-family: 'Poppins', sans-serif;font-size: 16px;font-weight: 600;letter-spacing: 0.34px;color: #16a4fa;">Risks</td>
                </tr>
                <tr>
                    <td style="margin: 0;font-family: 'Poppins', sans-serif; font-size: 14px;line-height: 1.43;letter-spacing: 0.3px;color: #808396;">
                    ${data.risks.map((risk, index) => `
                        <p style="font-family: 'Poppins', sans-serif; font-size: 14px;font-weight: 500;line-height: 1.57;letter-spacing: 0.3px;color: #1c2745;margin: 12px 0 0 0;">${risk.title}</p>
                        <p style="font-family: 'Poppins', sans-serif; font-size: 12px;font-weight: 500;line-height: normal;letter-spacing: normal;color: #808396;margin: 5px 0 0 0;">${risk.description}</p>
                    `).join('')}
                    </td>
                </tr>
                </table>
            </td>
        </tr>
         <tr>
            <td valign="top" style="padding: 0px 24px 30px 24px;">
               <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                  <tr>
                     <td style="margin: 0;font-family: 'Poppins', sans-serif;font-size: 16px;font-weight: 600;letter-spacing: 0.34px;color: #16a4fa;">Opportunities for improvements</td>
                  </tr>
                  <tr>
                     <td style="margin: 0;font-family: 'Poppins', sans-serif; font-size: 14px;line-height: 1.43;letter-spacing: 0.3px;color: #808396;">
                     ${data.cips.map((cip, index) => `
                        <p style="font-family: 'Poppins', sans-serif; font-size: 14px;font-weight: 500;line-height: 1.57;letter-spacing: 0.3px;color: #1c2745;margin: 12px 0 0 0;">${cip.title}</p>
                        <p style="font-family: 'Poppins', sans-serif; font-size: 12px;font-weight: 500;line-height: normal;letter-spacing: normal;color: #808396;margin: 5px 0 0 0;">${cip.opportunityForImprovement}</p>
                    `).join('')}
                     </td>
                  </tr>
               </table>
            </td>
         </tr>
         <tr>
            <td valign="top" style="padding: 0px 24px 30px 24px;">
               <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                  <tr>
                     <td style="margin: 0;font-family: 'Poppins', sans-serif; font-size: 22px;line-height: 1.43;letter-spacing: 0.3px;color: #808396;">
                        <p style="font-family: 'Poppins', sans-serif; font-size: 18px;font-weight: 500;line-height: 1.57;letter-spacing: 0.3px;color: #1c2745;margin: 12px 0 0 0;">Scheduled date</p>
                        <p style="font-family: 'Poppins', sans-serif; font-size: 16px;font-weight: 500;line-height: normal;letter-spacing: normal;color: #808396;margin: 5px 0 0 0;">${moment(data.startDate).format('DD/MM/YYYY hh:mm a')}</p>
                        </td>
                        <td style="margin: 0;font-family: 'Poppins', sans-serif; font-size: 22px;line-height: 1.43;letter-spacing: 0.3px;color: #808396;">
                        <p style="font-family: 'Poppins', sans-serif; font-size: 18px;font-weight: 500;line-height: 1.57;letter-spacing: 0.3px;color: #1c2745;margin: 12px 0 0 0;">Completed date</p>
                        <p style="font-family: 'Poppins', sans-serif; font-size: 16px;font-weight: 500;line-height: normal;letter-spacing: normal;color: #808396;margin: 5px 0 0 0;">${moment(data.completed.on).format('DD/MM/YYYY')}</p>
                     </td>
                  </tr>
               </table>
            </td>
         </tr>

      </table>

   </body>
</html>
`