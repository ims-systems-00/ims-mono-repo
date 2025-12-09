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
                                <h1 style="font-family: 'Poppins', sans-serif;font-size: 30px;font-weight: bold;line-height: 1.2;color: #fff;">Safeguarding Alert</h1>
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
                     <td valign="top" style="padding: 0;margin: 0;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                           <thead>
                              <tr>
                                 <th width="100%" align="left" style="margin: 0;font-family: 'Poppins', sans-serif;padding: 16px 16px 16px 16px;border-radius: 3px;background-color: #e3f1f9;font-size: 16px;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.38;letter-spacing: 0.34px;color: #16a4fa;">Business unit</th>
                              </tr>
                           </thead>
                           <tbody>
                              <tr>
                                 <td style="padding: 15px 0 0 16px;font-family: 'Poppins', sans-serif; font-size: 14px;line-height: 1.43;letter-spacing: 0.3px;color: #808396;">
                                    ${data.group.name}
                                 </td>
                              </tr>
                           </tbody>
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
                     <td valign="top" style="padding: 0;margin: 0;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                           <thead>
                              <tr>
                                 <th width="100%" align="left" style="margin: 0;font-family: 'Poppins', sans-serif;padding: 16px 16px 16px 16px;border-radius: 3px;background-color: #e3f1f9;font-size: 16px;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.38;letter-spacing: 0.34px;color: #16a4fa;">Person affected</th>
                              </tr>
                           </thead>
                           <tbody>
                              <tr>
                                 <td style="padding: 15px 0 0 16px;font-family: 'Poppins', sans-serif; font-size: 14px;line-height: 1.43;letter-spacing: 0.3px;color: #808396;">
                                    ${data.personAffected}
                                 </td>
                              </tr>
                           </tbody>
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
                     <td valign="top" style="padding: 0;margin: 0;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                           <thead>
                              <tr>
                                 <th width="100%" align="left" style="margin: 0;font-family: 'Poppins', sans-serif;padding: 16px 16px 16px 16px;border-radius: 3px;background-color: #e3f1f9;font-size: 16px;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.38;letter-spacing: 0.34px;color: #16a4fa;">Risk register</th>
                              </tr>
                           </thead>
                           <tbody>
                              <tr>
                                 <td style="padding: 15px 0 0 16px;font-family: 'Poppins', sans-serif; font-size: 14px;line-height: 1.43;letter-spacing: 0.3px;color: #808396;">
                                    ${data.riskRegistar}
                                 </td>
                              </tr>
                           </tbody>
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
                     <td valign="top" style="padding: 0;margin: 0;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                           <thead>
                              <tr>
                                 <th width="100%" align="left" style="margin: 0;font-family: 'Poppins', sans-serif;padding: 16px 16px 16px 16px;border-radius: 3px;background-color: #e3f1f9;font-size: 16px;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.38;letter-spacing: 0.34px;color: #16a4fa;">Summery of concerns</th>
                              </tr>
                           </thead>
                           <tbody>
                              <tr>
                                 <td style="padding: 15px 0 0 16px;font-family: 'Poppins', sans-serif; font-size: 14px;line-height: 1.43;letter-spacing: 0.3px;color: #808396;">
                                    ${data.summaryOfConcerns}
                                 </td>
                              </tr>
                           </tbody>
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
                     <td valign="top" style="padding: 0;margin: 0;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                           <thead>
                              <tr>
                                 <th width="100%" align="left" style="margin: 0;font-family: 'Poppins', sans-serif;padding: 16px 16px 16px 16px;border-radius: 3px;background-color: #e3f1f9;font-size: 16px;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.38;letter-spacing: 0.34px;color: #16a4fa;">Agencies involved</th>
                              </tr>
                           </thead>
                           <tbody>
                              <tr>
                                 <td style="padding: 15px 0 0 16px;font-family: 'Poppins', sans-serif; font-size: 14px;line-height: 1.43;letter-spacing: 0.3px;color: #808396;">
                                    ${data.agenciesInvolved}
                                 </td>
                              </tr>
                           </tbody>
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
                     <td valign="top" style="padding: 0;margin: 0;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                           <thead>
                              <tr>
                                 <th width="100%" align="left" style="margin: 0;font-family: 'Poppins', sans-serif;padding: 16px 16px 16px 16px;border-radius: 3px;background-color: #e3f1f9;font-size: 16px;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.38;letter-spacing: 0.34px;color: #16a4fa;">Investigation</th>
                              </tr>
                           </thead>
                           <tbody>
                              <tr>
                                 <td style="padding: 15px 0 0 16px;font-family: 'Poppins', sans-serif; font-size: 14px;line-height: 1.43;letter-spacing: 0.3px;color: #808396;">
                                    ${data.investigation}
                                 </td>
                              </tr>
                           </tbody>
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
                     <td valign="top" style="padding: 0;margin: 0;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                           <thead>
                              <tr>
                                 <th width="100%" align="left" style="margin: 0;font-family: 'Poppins', sans-serif;padding: 16px 16px 16px 16px;border-radius: 3px;background-color: #e3f1f9;font-size: 16px;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.38;letter-spacing: 0.34px;color: #16a4fa;">Outcome</th>
                              </tr>
                           </thead>
                           <tbody>
                              <tr>
                                 <td style="padding: 15px 0 0 16px;font-family: 'Poppins', sans-serif; font-size: 14px;line-height: 1.43;letter-spacing: 0.3px;color: #808396;">
                                    ${data.outcome}
                                 </td>
                              </tr>
                           </tbody>
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
                     <td valign="top" style="padding: 0;margin: 0;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                           <thead>
                              <tr>
                                 <th width="100%" align="left" style="margin: 0;font-family: 'Poppins', sans-serif;padding: 16px 16px 16px 16px;border-radius: 3px;background-color: #e3f1f9;font-size: 16px;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.38;letter-spacing: 0.34px;color: #16a4fa;">Shared with</th>
                              </tr>
                           </thead>
                           <tbody>
                              ${data.sharedWith.map(user => `
                              <tr>
                                 <td style="padding: 15px 0 0 16px;font-family: 'Poppins', sans-serif; font-size: 14px;line-height: 1.43;letter-spacing: 0.3px;color: #808396;">
                                    ${user.name}
                                 </td>
                              </tr>
                              `).join("")}
                           </tbody>
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
                     <td valign="top" style="padding: 0;margin: 0;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                           <thead>
                              <tr>
                                 <th width="100%" align="left" style="margin: 0;font-family: 'Poppins', sans-serif;padding: 16px 16px 16px 16px;border-radius: 3px;background-color: #e3f1f9;font-size: 16px;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.38;letter-spacing: 0.34px;color: #16a4fa;">Reported by</th>
                              </tr>
                           </thead>
                           <tbody>
                              <tr>
                                 <td style="padding: 15px 0 0 16px;font-family: 'Poppins', sans-serif; font-size: 14px;line-height: 1.43;letter-spacing: 0.3px;color: #808396;">
                                    ${data.created.by.name}
                                 </td>
                              </tr>
                           </tbody>
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
                     <td valign="top" style="padding: 0;margin: 0;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                           <thead>
                              <tr>
                                 <th width="100%" align="left" style="margin: 0;font-family: 'Poppins', sans-serif;padding: 16px 16px 16px 16px;border-radius: 3px;background-color: #e3f1f9;font-size: 16px;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.38;letter-spacing: 0.34px;color: #16a4fa;">Report date</th>
                              </tr>
                           </thead>
                           <tbody>
                              <tr>
                                 <td style="padding: 15px 0 0 16px;font-family: 'Poppins', sans-serif; font-size: 14px;line-height: 1.43;letter-spacing: 0.3px;color: #808396;">
                                    ${moment(data.created.on).format('DD/MM/YYYY')}
                                 </td>
                              </tr>
                           </tbody>
                        </table>
                     </td>
                  </tr>
               </table>
            </td>
         </tr>
      </table>
   </body>
</html>
`