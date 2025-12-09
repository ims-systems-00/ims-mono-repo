const moment = require('moment')
module.exports = data => `
<!DOCTYPE html>
<html lang="en">
   <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" >
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="x-apple-disable-message-reformatting">
      <title>${data.groupName} iMS report</title>
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
   <body style="width:100% !important; margin:0 !important; padding:0 !important; -webkit-font-smoothing: antialiased !important; font-family: 'Poppins', sans-serif;">
      
      <table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" style="border-collapse: collapse !important;margin:0 auto !important;background-color: #ffffff;width: 595px;height: 842px;background-size: cover;background-repeat: no-repeat;">
         <tr>
            <td valign="bottom" style="padding: 0px 0px 0px 0px;">
               <table bwidth="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                  <tr>
                     <td valign="bottom" style="padding: 0px 0px 0px 0px;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0">
                           <tr>
                              <td style="margin: 0;padding: 0;" align="center">
                                 <img src="https://s3.eu-west-2.amazonaws.com/imssystems.tech/assets/images/IMS_logo_full_blue_Dark.svg" style="vertical-align: middle; width:100px;">
                              </td>
                           </tr>
                           <tr>
                              <td style="margin: 0;padding: 24px 45px 60px;" align="center">
                                 <p style="font-size: 16px;font-weight: 500;line-height: 1.5;text-align: center;color: #16a4fa;;font-family: 'Poppins', sans-serif;">Future of business operations</p>
                              </td>
                           </tr>
                           <tr>
                              <td style="margin: 0;padding: 24px 45px 60px;" align="center">
                                 <p style="font-size: 16px;font-weight: 500;line-height: 1.5;text-align: center;color: #16a4fa;;font-family: 'Poppins', sans-serif;">Your operational key to live, up to the moment data giving you the power to make the best decisions for your business on time and at the right time.</p>
                              </td>
                           </tr>
                           <tr>
                              <td style="margin: 0;padding: 0 0 45px 0;" align="center">
                                 <img src="https://s3.eu-west-2.amazonaws.com/imssystems.tech/assets/images/addvantage-technologies-logo.svg" style="vertical-align: middle; width:100px;">
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
                              <td style="margin: 0;padding: 26px 24px 24px 24px;" align="left">
                              <h1 style="font-family: 'Poppins', sans-serif;font-size: 30px;font-weight: bold;line-height: 1.2;color: #fff;">${data.groupName} iMS report</h1>
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
                                 <th width="100%" align="left" style="margin: 0;font-family: 'Poppins', sans-serif;padding: 16px 16px 16px 16px;border-radius: 3px;background-color: #e3f1f9;font-size: 16px;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.38;letter-spacing: 0.34px;color: #16a4fa;">Integrated management systems</th>
                              </tr>
                           </thead>
                           <tbody>
                              <tr>
                                 <td style="padding: 15px 0 0 16px;font-family: 'Poppins', sans-serif; font-size: 14px;line-height: 1.43;letter-spacing: 0.3px;color: #808396;">
                                    <ul style="margin: 0;padding: 0;">
                                       <li style="margin: 6px 0 0 0;padding: 0;list-style-position: inside;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.57;letter-spacing: 0.3px;color: #1c2745;font-size: 14px;font-family: 'Poppins', sans-serif;">Business function name  ${data.groupName}</li>
                                       <li style="margin: 6px 0 0 0;padding: 0;list-style-position: inside;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.57;letter-spacing: 0.3px;color: #1c2745;font-size: 14px;font-family: 'Poppins', sans-serif;">Number of staffs  ${data.numberOfStaffs}</li>
                                       <li style="margin: 6px 0 0 0;padding: 0;list-style-position: inside;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.57;letter-spacing: 0.3px;color: #1c2745;font-size: 14px;font-family: 'Poppins', sans-serif;">Staff remote  ${data.staffRemote}</li>
                                       <li style="margin: 6px 0 0 0;padding: 0;list-style-position: inside;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.57;letter-spacing: 0.3px;color: #1c2745;font-size: 14px;font-family: 'Poppins', sans-serif;">Premises ${data.premises}</li>
                                       <li style="margin: 6px 0 0 0;padding: 0;list-style-position: inside;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.57;letter-spacing: 0.3px;color: #1c2745;font-size: 14px;font-family: 'Poppins', sans-serif;">Organisational state ${data.organizationalState}</li>
                                       <li style="margin: 6px 0 0 0;padding: 0;list-style-position: inside;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.57;letter-spacing: 0.3px;color: #1c2745;font-size: 14px;font-family: 'Poppins', sans-serif;">Critical area ${data.criticalArea}</li>
                                    </ul>
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
                                 <th width="100%" align="left" style="margin: 0;font-family: 'Poppins', sans-serif;padding: 16px 16px 16px 16px;border-radius: 3px;background-color: #e3f1f9;font-size: 16px;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.38;letter-spacing: 0.34px;color: #16a4fa;">Digital maturity matrix</th>
                              </tr>
                           </thead>
                           <tbody>
                              <tr>
                                 <td style="padding: 15px 0 0 16px;font-family: 'Poppins', sans-serif; font-size: 14px;line-height: 1.43;letter-spacing: 0.3px;color: #808396;">
                                    <ul style="margin: 0;padding: 0;">
                                    ${Object.values(data.digitalMaturityMatrix).map((area, index) => `
                                       <li style="margin: 6px 0 0 0;padding: 0;list-style-position: inside;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.57;letter-spacing: 0.3px;color: #1c2745;font-size: 14px;font-family: 'Poppins', sans-serif;">${area.label} : ${area.point === 1 ? "Manual" : area.point === 2 ? "Digital" : area.point === 3 ? "Active" : "Optimised"}</li>
                                    `).join('')}
                                    </ul>
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
      <table class="break-before special" width="100%" border="0" cellpadding="0" cellspacing="0" align="center" style="border-collapse: collapse !important;margin:0 auto !important;background-color: #ffffff;width: 595px;height: 100%;">
         <tr>
            <td valign="top" style="padding: 0px 0px 0px 0px;">
               <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                  <tr>
                     <td valign="top" style="padding: 0px 0px 0px 0px;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;background-image: url(https://imssystems.tech/static/assets/images/hero.png);background-size: cover;background-repeat: no-repeat;">
                           <tr>
                              <td style="margin: 0;padding: 26px 24px 24px 24px;" align="left">
                                <h1 style="font-family: 'Poppins', sans-serif;font-size: 30px;font-weight: bold;line-height: 1.2;color: #fff;">${data.groupName} iMS report</h1>
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
                                 <th width="100%" align="left" style="margin: 0;font-family: 'Poppins', sans-serif;padding: 16px 16px 16px 16px;border-radius: 3px;background-color: #e3f1f9;font-size: 16px;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.38;letter-spacing: 0.34px;color: #16a4fa;">Organisational confidece level</th>
                              </tr>
                           </thead>
                           <tbody>
                              <tr>
                                 <td style="padding: 15px 0 0 16px;font-family: 'Poppins', sans-serif; font-size: 14px;line-height: 1.43;letter-spacing: 0.3px;color: #808396;">
                                    <ul style="margin: 0;padding: 0;">
                                       <li style="margin: 6px 0 0 0;padding: 0;list-style-position: inside;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.57;letter-spacing: 0.3px;color: #1c2745;font-size: 14px;font-family: 'Poppins', sans-serif;">${data.organizationalConfidence}%</li>
                                    </ul>
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
            <td valign="top" style="padding: 0px 24px 30px 24px;">
               <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                  <tr>
                     <td valign="top" style="padding: 0;margin: 0;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                           <thead>
                              <tr>
                                 <th width="100%" align="left" style="margin: 0;font-family: 'Poppins', sans-serif;padding: 16px 16px 16px 16px;border-radius: 3px;background-color: #e3f1f9;font-size: 16px;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.38;letter-spacing: 0.34px;color: #16a4fa;">Risk raised past six months</th>
                              </tr>
                           </thead>
                           <tbody>
                              <tr>
                                 <td style="padding: 15px 0 0 16px;font-family: 'Poppins', sans-serif; font-size: 14px;line-height: 1.43;letter-spacing: 0.3px;color: #808396;">
                                    <ul style="margin: 0;padding: 0;">
                                    ${data.risksByStatus.open.risks.map((risk, index) => `
                                        <li style="margin: 6px 0 0 0;padding: 0;list-style-position: inside;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.57;letter-spacing: 0.3px;color: #1c2745;font-size: 14px;font-family: 'Poppins', sans-serif;">${data.risksByStatus.open.months[index]} ${risk}</li>`
).join('')}
                                    </ul>
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
            <td valign="top" style="padding: 0px 24px 30px 24px;">
               <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                  <tr>
                     <td valign="top" style="padding: 0;margin: 0;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                           <thead>
                              <tr>
                                 <th width="100%" align="left" style="margin: 0;font-family: 'Poppins', sans-serif;padding: 16px 16px 16px 16px;border-radius: 3px;background-color: #e3f1f9;font-size: 16px;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.38;letter-spacing: 0.34px;color: #16a4fa;">Risk mitigated past six months</th>
                              </tr>
                           </thead>
                           <tbody>
                              <tr>
                                 <td style="padding: 15px 0 0 16px;font-family: 'Poppins', sans-serif; font-size: 14px;line-height: 1.43;letter-spacing: 0.3px;color: #808396;">
                                    <ul style="margin: 0;padding: 0;">
                                    ${data.risksByStatus.mitigated.risks.map((risk, index) => `
                                        <li style="margin: 6px 0 0 0;padding: 0;list-style-position: inside;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.57;letter-spacing: 0.3px;color: #1c2745;font-size: 14px;font-family: 'Poppins', sans-serif;">${data.risksByStatus.mitigated.months[index]} ${risk}</li>
                                    `).join('')}
                                    </ul>
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
      <table class="break-before special" width="100%" border="0" cellpadding="0" cellspacing="0" align="center" style="border-collapse: collapse !important;margin:0 auto !important;background-color: #ffffff;width: 595px;height: 100%;">
         <tr>
            <td valign="top" style="padding: 0px 0px 0px 0px;">
               <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                  <tr>
                     <td valign="top" style="padding: 0px 0px 0px 0px;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;background-image: url(https://imssystems.tech/static/assets/images/hero.png);background-size: cover;background-repeat: no-repeat;">
                           <tr>
                              <td style="margin: 0;padding: 26px 24px 24px 24px;" align="left">
                                <h1 style="font-family: 'Poppins', sans-serif;font-size: 30px;font-weight: bold;line-height: 1.2;color: #fff;">${data.groupName} iMS report</h1>
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
                                 <th width="100%" align="left" style="margin: 0;font-family: 'Poppins', sans-serif;padding: 16px 16px 16px 16px;border-radius: 3px;background-color: #e3f1f9;font-size: 16px;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.38;letter-spacing: 0.34px;color: #16a4fa;">Risk escalated past six months</th>
                              </tr>
                           </thead>
                           <tbody>
                              <tr>
                                 <td style="padding: 15px 0 0 16px;font-family: 'Poppins', sans-serif; font-size: 14px;line-height: 1.43;letter-spacing: 0.3px;color: #808396;">
                                    <ul style="margin: 0;padding: 0;">
                                    ${data.risksByStatus.escalated.risks.map((risk, index) => `
                                        <li style="margin: 6px 0 0 0;padding: 0;list-style-position: inside;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.57;letter-spacing: 0.3px;color: #1c2745;font-size: 14px;font-family: 'Poppins', sans-serif;">${data.risksByStatus.escalated.months[index]} ${risk}</li>
                                    `).join('')}
                                    </ul>
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
            <td valign="top" style="padding: 0px 24px 30px 24px;">
               <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                  <tr>
                     <td valign="top" style="padding: 0;margin: 0;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                           <thead>
                              <tr>
                                 <th width="100%" align="left" style="margin: 0;font-family: 'Poppins', sans-serif;padding: 16px 16px 16px 16px;border-radius: 3px;background-color: #e3f1f9;font-size: 16px;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.38;letter-spacing: 0.34px;color: #16a4fa;">Risk accepted past six months</th>
                              </tr>
                           </thead>
                           <tbody> 
                              <tr>
                                 <td style="padding: 15px 0 0 16px;font-family: 'Poppins', sans-serif; font-size: 14px;line-height: 1.43;letter-spacing: 0.3px;color: #808396;">
                                    <ul style="margin: 0;padding: 0;">
                                    ${data.risksByStatus.accepted.risks.map((risk, index) => `
                                        <li style="margin: 6px 0 0 0;padding: 0;list-style-position: inside;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.57;letter-spacing: 0.3px;color: #1c2745;font-size: 14px;font-family: 'Poppins', sans-serif;">${data.risksByStatus.accepted.months[index]} ${risk}</li>
                                    `).join('')}
                                    </ul>
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


      <table class="break-before special" width="100%" border="0" cellpadding="0" cellspacing="0" align="center" style="border-collapse: collapse !important;margin:0 auto !important;background-color: #ffffff;width: 595px;height: 100%;">
         <tr>
            <td valign="top" style="padding: 0px 0px 0px 0px;">
               <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                  <tr>
                     <td valign="top" style="padding: 0px 0px 0px 0px;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;background-image: url(https://imssystems.tech/static/assets/images/hero.png);background-size: cover;background-repeat: no-repeat;">
                           <tr>
                              <td style="margin: 0;padding: 26px 24px 24px 24px;" align="left">
                                <h1 style="font-family: 'Poppins', sans-serif;font-size: 30px;font-weight: bold;line-height: 1.2;color: #fff;">${data.groupName} iMS report</h1>
                              </td>
                           </tr>
                        </table>
                     </td>
                  </tr>
               </table>
            </td>
         </tr>

         <tr>
            <td valign="top" style="padding: 0px 24px 10px 24px;">
               <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                  <tr>
                     <td valign="top" style="padding: 0;margin: 0;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                           <tbody>
                              <tr>
                                 <td style="padding: 0px 0 0 16px;font-family: 'Poppins', sans-serif; font-size: 14px;line-height: 1.43;letter-spacing: 0.3px;color: #808396;">
                                    <p style="font-size: 16px;font-weight: 500;font-stretch: normal;line-height: normal;letter-spacing: 0.34px;color: #808396;font-family: 'Poppins', sans-serif;margin: 0px 0px 12px 0px;">Overview</p>

                                    <ul style="margin: 0;padding: 0;">
                                       <li style="margin: 6px 0 0 0;padding: 0;list-style-position: inside;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.57;letter-spacing: 0.3px;color: #1c2745;font-size: 14px;font-family: 'Poppins', sans-serif;">Total ${data.risksOverview.totalRisksInThisSystemDates}</li>
                                       <li style="margin: 6px 0 0 0;padding: 0;list-style-position: inside;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.57;letter-spacing: 0.3px;color: #1c2745;font-size: 14px;font-family: 'Poppins', sans-serif;">Total opened this month ${data.risksOverview.totalOpenedRisksInThisMonth}</li>
                                       <li style="margin: 6px 0 0 0;padding: 0;list-style-position: inside;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.57;letter-spacing: 0.3px;color: #1c2745;font-size: 14px;font-family: 'Poppins', sans-serif;">Total mitigated this month ${data.risksOverview.totalMitigatedRisksInThisMonth}</li>
                                       <li style="margin: 6px 0 0 0;padding: 0;list-style-position: inside;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.57;letter-spacing: 0.3px;color: #1c2745;font-size: 14px;font-family: 'Poppins', sans-serif;">Total escalated this month ${data.risksOverview.totalEscalatedRisksInThisMonth}</li>
                                       <li style="margin: 6px 0 0 0;padding: 0;list-style-position: inside;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.57;letter-spacing: 0.3px;color: #1c2745;font-size: 14px;font-family: 'Poppins', sans-serif;">Total accepted this month ${data.risksOverview.totalAcceptedRisksInThisMonth}</li>
                                    </ul>
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
            <td valign="top" style="padding: 0px 24px 30px 24px;">
               <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                  <tr>
                     <td valign="top" style="padding: 0;margin: 0;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                           <thead>
                              <tr>
                                 <th width="100%" align="left" style="margin: 0;font-family: 'Poppins', sans-serif;padding: 16px 16px 16px 16px;border-radius: 3px;background-color: #e3f1f9;font-size: 16px;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.38;letter-spacing: 0.34px;color: #16a4fa;">Finance</th>
                              </tr>
                           </thead>
                           <tbody>
                              <tr>
                                 <td style="padding: 15px 0 0 16px;font-family: 'Poppins', sans-serif; font-size: 14px;line-height: 1.43;letter-spacing: 0.3px;color: #808396;">
                                    <ul style="margin: 0;padding: 0;">
                                    ${data.finance.costs.map((cost, index) => `
                                        <li style="margin: 6px 0 0 0;padding: 0;list-style-position: inside;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.57;letter-spacing: 0.3px;color: #1c2745;font-size: 14px;font-family: 'Poppins', sans-serif;">${data.finance.areas[index]} £${cost}</li>
                                    `).join('')}
                                    </ul>
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
            <td valign="top" style="padding: 0px 24px 10px 24px;">
               <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                  <tr>
                     <td valign="top" style="padding: 0;margin: 0;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                           <tbody>
                              <tr>
                                 <td style="padding: 0px 0 0 16px;font-family: 'Poppins', sans-serif; font-size: 14px;line-height: 1.43;letter-spacing: 0.3px;color: #808396;">
                                    <p style="font-size: 16px;font-weight: 500;font-stretch: normal;line-height: normal;letter-spacing: 0.34px;color: #808396;font-family: 'Poppins', sans-serif;margin: 0px 0px 12px 0px;">Overview</p>

                                    <ul style="margin: 0;padding: 0;">
                                       ${data.inventory.amounts.map((amount, index) => `
                                             <li style="margin: 6px 0 0 0;padding: 0;list-style-position: inside;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.57;letter-spacing: 0.3px;color: #1c2745;font-size: 14px;font-family: 'Poppins', sans-serif;">${data.inventory.areas[index]} £${amount}</li>
                                       `).join('')}
                                    </ul>
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
      <table class="break-before special" width="100%" border="0" cellpadding="0" cellspacing="0" align="center" style="border-collapse: collapse !important;margin:0 auto !important;background-color: #ffffff;width: 595px;height: 100%;">
         <tr>
            <td valign="top" style="padding: 0px 0px 0px 0px;">
               <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                  <tr>
                     <td valign="top" style="padding: 0px 0px 0px 0px;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;background-image: url(https://imssystems.tech/static/assets/images/hero.png);background-size: cover;background-repeat: no-repeat;">
                           <tr>
                              <td style="margin: 0;padding: 26px 24px 24px 24px;" align="left">
                                <h1 style="font-family: 'Poppins', sans-serif;font-size: 30px;font-weight: bold;line-height: 1.2;color: #fff;">${data.groupName} iMS report</h1>
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
                                 <th width="100%" align="left" style="margin: 0;font-family: 'Poppins', sans-serif;padding: 16px 16px 16px 16px;border-radius: 3px;background-color: #e3f1f9;font-size: 16px;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.38;letter-spacing: 0.34px;color: #16a4fa;">Management review dates</th>
                              </tr>
                           </thead>
                           <tbody>
                              <tr>
                                 <td style="padding: 15px 0 0 16px;font-family: 'Poppins', sans-serif; font-size: 14px;line-height: 1.43;letter-spacing: 0.3px;color: #808396;">
                                    <ul style="margin: 0;padding: 0;">
                                       <li style="margin: 6px 0 0 0;padding: 0;list-style-position: inside;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.57;letter-spacing: 0.3px;color: #1c2745;font-size: 14px;font-family: 'Poppins', sans-serif;">Last conducted ${moment(data.lastManagementReviewDate).format('DD/MM/YYYY')}</li>
                                       <li style="margin: 6px 0 0 0;padding: 0;list-style-position: inside;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.57;letter-spacing: 0.3px;color: #1c2745;font-size: 14px;font-family: 'Poppins', sans-serif;">Next date ${moment(data.nextManagementReviewDate).format('DD/MM/YYYY')}</li>
                                    </ul>
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
            <td valign="top" style="padding: 0px 24px 30px 24px;">
               <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                  <tr>
                     <td valign="top" style="padding: 0;margin: 0;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                           <thead>
                              <tr>
                                 <th width="100%" align="left" style="margin: 0;font-family: 'Poppins', sans-serif;padding: 16px 16px 16px 16px;border-radius: 3px;background-color: #e3f1f9;font-size: 16px;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.38;letter-spacing: 0.34px;color: #16a4fa;">Kpi/Objectives</th>
                              </tr>
                           </thead>
                           <tbody>
                              <tr>
                                 <td style="padding: 15px 0 0 16px;font-family: 'Poppins', sans-serif; font-size: 14px;line-height: 1.43;letter-spacing: 0.3px;color: #808396;">
                                    <ul style="margin: 0;padding: 0;">
                                    ${data.kpiObjectives.map((kpi) => `
                                        <li style="margin: 6px 0 0 0;padding: 0;list-style-position: inside;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.57;letter-spacing: 0.3px;color: #1c2745;font-size: 14px;font-family: 'Poppins', sans-serif;">${kpi.value}</li>
                                    `).join('')}
                                    </ul>
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
            <td valign="top" style="padding: 0px 24px 10px 24px;">
               <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                  <tr>
                     <td valign="top" style="padding: 0;margin: 0;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                           <thead>
                              <tr>
                                 <th width="100%" align="left" style="margin: 0;font-family: 'Poppins', sans-serif;padding: 16px 16px 16px 16px;border-radius: 3px;background-color: #e3f1f9;font-size: 16px;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.38;letter-spacing: 0.34px;color: #16a4fa;">Audits</th>
                              </tr>
                           </thead>
                           <tbody>
                              <tr>
                                 <td style="padding: 15px 0 0 16px;font-family: 'Poppins', sans-serif; font-size: 14px;line-height: 1.43;letter-spacing: 0.3px;color: #808396;">
                                    <p style="font-size: 16px;font-weight: 500;font-stretch: normal;line-height: normal;letter-spacing: 0.34px;color: #808396;font-family: 'Poppins', sans-serif;margin: 0px 0px 12px 0px;">Non conformities</p>

                                    <ul style="margin: 0;padding: 0;">
                                    ${data.audits.findings.areas.map((name, index) => `
                                        <li style="margin: 6px 0 0 0;padding: 0;list-style-position: inside;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.57;letter-spacing: 0.3px;color: #1c2745;font-size: 14px;font-family: 'Poppins', sans-serif;"> ${name} ${data.audits.findings.data[index]}</li>
                                    `).join('')}
                                    </ul>
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

      <table class="break-before special" width="100%" border="0" cellpadding="0" cellspacing="0" align="center" style="border-collapse: collapse !important;margin:0 auto !important;background-color: #ffffff;width: 595px;height: 100%;">
         <tr>
            <td valign="top" style="padding: 0px 0px 0px 0px;">
               <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                  <tr>
                     <td valign="top" style="padding: 0px 0px 0px 0px;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;background-image: url(https://imssystems.tech/static/assets/images/hero.png);background-size: cover;background-repeat: no-repeat;">
                           <tr>
                              <td style="margin: 0;padding: 26px 24px 24px 24px;" align="left">
                                <h1 style="font-family: 'Poppins', sans-serif;font-size: 30px;font-weight: bold;line-height: 1.2;color: #fff;">${data.groupName} iMS report</h1>
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
                           <tbody>
                              <tr>
                                 <td style="padding: 0 0 0 16px;font-family: 'Poppins', sans-serif; font-size: 14px;line-height: 1.43;letter-spacing: 0.3px;color: #808396;">

                                    <p style="font-size: 16px;font-weight: 500;font-stretch: normal;line-height: normal;letter-spacing: 0.34px;color: #808396;font-family: 'Poppins', sans-serif;margin: 0px 0px 12px 0px;">Audit scheduled vs audit conducted</p>

                                    <ul style="margin: 0;padding: 0;">
                                       <li style="margin: 6px 0 0 0;padding: 0;list-style-position: inside;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.57;letter-spacing: 0.3px;color: #1c2745;font-size: 14px;font-family: 'Poppins', sans-serif;">Audits scheduled  ${data.audits.inCompleted}</li>
                                       <li style="margin: 6px 0 0 0;padding: 0;list-style-position: inside;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.57;letter-spacing: 0.3px;color: #1c2745;font-size: 14px;font-family: 'Poppins', sans-serif;">Audits completed ${data.audits.completed}</li>
                                    </ul>
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
            <td valign="top" style="padding: 0px 24px 30px 24px;">
               <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                  <tr>
                     <td valign="top" style="padding: 0;margin: 0;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                           <thead>
                              <tr>
                                 <th width="100%" align="left" style="margin: 0;font-family: 'Poppins', sans-serif;padding: 16px 16px 16px 16px;border-radius: 3px;background-color: #e3f1f9;font-size: 16px;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.38;letter-spacing: 0.34px;color: #16a4fa;">Incidents</th>
                              </tr>
                           </thead>
                           <tbody>
                              <tr>
                                 <td style="padding: 15px 0 0 16px;font-family: 'Poppins', sans-serif; font-size: 14px;line-height: 1.43;letter-spacing: 0.3px;color: #808396;">

                                    <p style="font-size: 16px;font-weight: 500;font-stretch: normal;line-height: normal;letter-spacing: 0.34px;color: #808396;font-family: 'Poppins', sans-serif;margin: 0px 0px 12px 0px;">Business functions with most incidents</p>

                                    <ul style="margin: 0;padding: 0;">
                                    ${data.incidentsByStatus.open.incidents.map((incident, index) => `
                                        <li style="margin: 6px 0 0 0;padding: 0;list-style-position: inside;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.57;letter-spacing: 0.3px;color: #1c2745;font-size: 14px;font-family: 'Poppins', sans-serif;">${data.incidentsByStatus.open.months[index]} ${incident}</li>
                                    `).join('')}
                                    </ul>
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
            <td valign="top" style="padding: 0px 24px 10px 24px;">
               <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                  <tr>
                     <td valign="top" style="padding: 0;margin: 0;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                           <tbody>
                              <tr>
                                 <td style="padding: 0px 0 0 16px;font-family: 'Poppins', sans-serif; font-size: 14px;line-height: 1.43;letter-spacing: 0.3px;color: #808396;">
                                    <p style="font-size: 16px;font-weight: 500;font-stretch: normal;line-height: normal;letter-spacing: 0.34px;color: #808396;font-family: 'Poppins', sans-serif;margin: 0px 0px 12px 0px;">Overview</p>

                                    <ul style="margin: 0;padding: 0;">
                                       <li style="margin: 6px 0 0 0;padding: 0;list-style-position: inside;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.57;letter-spacing: 0.3px;color: #1c2745;font-size: 14px;font-family: 'Poppins', sans-serif;">Total raised ${data.incidents.total}</li>
                                       <li style="margin: 6px 0 0 0;padding: 0;list-style-position: inside;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.57;letter-spacing: 0.3px;color: #1c2745;font-size: 14px;font-family: 'Poppins', sans-serif;">Total resolved ${data.incidents.resolved}</li>
                                       <li style="margin: 6px 0 0 0;padding: 0;list-style-position: inside;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.57;letter-spacing: 0.3px;color: #1c2745;font-size: 14px;font-family: 'Poppins', sans-serif;">P1  resolution time ${data.incidents.p1AvgResolutionTime.time}</li>
                                       <li style="margin: 6px 0 0 0;padding: 0;list-style-position: inside;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.57;letter-spacing: 0.3px;color: #1c2745;font-size: 14px;font-family: 'Poppins', sans-serif;">P2 resolution time ${data.incidents.p2AvgResolutionTime.time}</li>
                                       <li style="margin: 6px 0 0 0;padding: 0;list-style-position: inside;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.57;letter-spacing: 0.3px;color: #1c2745;font-size: 14px;font-family: 'Poppins', sans-serif;">P3 resolution time ${data.incidents.p3AvgResolutionTime.time}</li>
                                       <li style="margin: 6px 0 0 0;padding: 0;list-style-position: inside;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.57;letter-spacing: 0.3px;color: #1c2745;font-size: 14px;font-family: 'Poppins', sans-serif;">P4 resolution time ${data.incidents.p4AvgResolutionTime.time}</li>
                                    </ul>
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
      <table class="break-before special" width="100%" border="0" cellpadding="0" cellspacing="0" align="center" style="border-collapse: collapse !important;margin:0 auto !important;background-color: #ffffff;width: 595px;height: 100%;">
         <tr>
            <td valign="top" style="padding: 0px 0px 0px 0px;">
               <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                  <tr>
                     <td valign="top" style="padding: 0px 0px 0px 0px;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;background-image: url(https://imssystems.tech/static/assets/images/hero.png);background-size: cover;background-repeat: no-repeat;">
                           <tr>
                              <td style="margin: 0;padding: 26px 24px 24px 24px;" align="left">
                                <h1 style="font-family: 'Poppins', sans-serif;font-size: 30px;font-weight: bold;line-height: 1.2;color: #fff;">${data.groupName} iMS report</h1>
                              </td>
                           </tr>
                        </table>
                     </td>
                  </tr>
               </table>
            </td>
         </tr>

         <tr>
            <td valign="top" style="padding: 0px 24px 10px 24px;">
               <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                  <tr>
                     <td valign="top" style="padding: 0;margin: 0;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                           <tbody>
                              <tr>
                                 <td style="padding: 0px 0 0 16px;font-family: 'Poppins', sans-serif; font-size: 14px;line-height: 1.43;letter-spacing: 0.3px;color: #808396;">
                                    <p style="font-size: 16px;font-weight: 500;font-stretch: normal;line-height: normal;letter-spacing: 0.34px;color: #808396;font-family: 'Poppins', sans-serif;margin: 0px 0px 12px 0px;">Overview</p>

                                    <ul style="margin: 0;padding: 0;">
                                    ${data.incidentsByStatus.resolved.incidents.map((incident, index) => `
                                        <li style="margin: 6px 0 0 0;padding: 0;list-style-position: inside;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.57;letter-spacing: 0.3px;color: #1c2745;font-size: 14px;font-family: 'Poppins', sans-serif;">${data.incidentsByStatus.resolved.months[index]} ${incident}</li>
                                    `).join('')}
                                    </ul>
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
            <td valign="top" style="padding: 0px 24px 30px 24px;">
               <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                  <tr>
                     <td valign="top" style="padding: 0;margin: 0;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                           <thead>
                              <tr>
                                 <th width="100%" align="left" style="margin: 0;font-family: 'Poppins', sans-serif;padding: 16px 16px 16px 16px;border-radius: 3px;background-color: #e3f1f9;font-size: 16px;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.38;letter-spacing: 0.34px;color: #16a4fa;">Finance</th>
                              </tr>
                           </thead>
                           <tbody>
                              <tr>
                                 <td style="padding: 15px 0 0 16px;font-family: 'Poppins', sans-serif; font-size: 14px;line-height: 1.43;letter-spacing: 0.3px;color: #808396;">
                                    <ul style="margin: 0;padding: 0;">
                                    ${data.incidentsByStatus.escalated.incidents.map((incident, index) => `
                                        <li style="margin: 6px 0 0 0;padding: 0;list-style-position: inside;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.57;letter-spacing: 0.3px;color: #1c2745;font-size: 14px;font-family: 'Poppins', sans-serif;">${data.incidentsByStatus.escalated.months[index]} ${incident}</li>
                                    `).join('')}
                                    </ul>
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
      <table class="break-before special" width="100%" border="0" cellpadding="0" cellspacing="0" align="center" style="border-collapse: collapse !important;margin:0 auto !important;background-color: #ffffff;width: 595px;height: 100%;">
         <tr>
            <td valign="top" style="padding: 0px 0px 0px 0px;">
               <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                  <tr>
                     <td valign="top" style="padding: 0px 0px 0px 0px;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;background-image: url(https://imssystems.tech/static/assets/images/hero.png);background-size: cover;background-repeat: no-repeat;">
                           <tr>
                              <td style="margin: 0;padding: 26px 24px 24px 24px;" align="left">
                                <h1 style="font-family: 'Poppins', sans-serif;font-size: 30px;font-weight: bold;line-height: 1.2;color: #fff;">${data.groupName} iMS report</h1>
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
                                 <th width="100%" align="left" style="margin: 0;font-family: 'Poppins', sans-serif;padding: 16px 16px 16px 16px;border-radius: 3px;background-color: #e3f1f9;font-size: 16px;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.38;letter-spacing: 0.34px;color: #16a4fa;">Continual improvement plan</th>
                              </tr>
                           </thead>
                           <tbody>
                              <tr>
                                 <td style="padding: 15px 0 0 16px;font-family: 'Poppins', sans-serif; font-size: 14px;line-height: 1.43;letter-spacing: 0.3px;color: #808396;">

                                    <p style="font-size: 16px;font-weight: 500;font-stretch: normal;line-height: normal;letter-spacing: 0.34px;color: #808396;font-family: 'Poppins', sans-serif;margin: 0px 0px 12px 0px;">OFI last 6 months</p>

                                    <ul style="margin: 0;padding: 0;">
                                    ${data.improvementsByStatus.open.improvements.map((ofi, index) => `
                                        <li style="margin: 6px 0 0 0;padding: 0;list-style-position: inside;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.57;letter-spacing: 0.3px;color: #1c2745;font-size: 14px;font-family: 'Poppins', sans-serif;">${data.improvementsByStatus.open.months[index]} ${ofi}</li>
                                    `).join('')}
                                    </ul>
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
            <td valign="top" style="padding: 0px 24px 10px 24px;">
               <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                  <tr>
                     <td valign="top" style="padding: 0;margin: 0;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                           <tbody>
                              <tr>
                                 <td style="padding: 0px 0 0 16px;font-family: 'Poppins', sans-serif; font-size: 14px;line-height: 1.43;letter-spacing: 0.3px;color: #808396;">
                                    <p style="font-size: 16px;font-weight: 500;font-stretch: normal;line-height: normal;letter-spacing: 0.34px;color: #808396;font-family: 'Poppins', sans-serif;margin: 0px 0px 12px 0px;">OFIs implemented last 6 months</p>

                                    <ul style="margin: 0;padding: 0;">
                                    ${data.improvementsByStatus.implemented.improvements.map((ofi, index) => `
                                        <li style="margin: 6px 0 0 0;padding: 0;list-style-position: inside;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.57;letter-spacing: 0.3px;color: #1c2745;font-size: 14px;font-family: 'Poppins', sans-serif;">${data.improvementsByStatus.implemented.months[index]} ${ofi}</li>
                                    `).join('')}
                                    </ul>
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

      <table class="break-before special" width="100%" border="0" cellpadding="0" cellspacing="0" align="center" style="border-collapse: collapse !important;margin:0 auto !important;background-color: #ffffff;width: 595px;height: 100%;">
         <tr>
            <td valign="top" style="padding: 0px 0px 0px 0px;">
               <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;">
                  <tr>
                     <td valign="top" style="padding: 0px 0px 0px 0px;">
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse: collapse;border-spacing: 0;width: 100%;background-image: url(https://imssystems.tech/static/assets/images/hero.png);background-size: cover;background-repeat: no-repeat;">
                           <tr>
                              <td style="margin: 0;padding: 26px 24px 24px 24px;" align="left">
                                <h1 style="font-family: 'Poppins', sans-serif;font-size: 30px;font-weight: bold;line-height: 1.2;color: #fff;">${data.groupName} iMS report</h1>
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
                                 <th width="100%" align="left" style="margin: 0;font-family: 'Poppins', sans-serif;padding: 16px 16px 16px 16px;border-radius: 3px;background-color: #e3f1f9;font-size: 16px;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.38;letter-spacing: 0.34px;color: #16a4fa;">Supplier management</th>
                              </tr>
                           </thead>
                           <tbody>
                              <tr>
                                 <td style="padding: 15px 0 0 16px;font-family: 'Poppins', sans-serif; font-size: 14px;line-height: 1.43;letter-spacing: 0.3px;color: #808396;">
                                    <ul style="margin: 0;padding: 0;">
                                       <li style="margin: 6px 0 0 0;padding: 0;list-style-position: inside;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.57;letter-spacing: 0.3px;color: #1c2745;font-size: 14px;font-family: 'Poppins', sans-serif;">Total suppliers ${data.supplierCompliance.compliant + data.supplierCompliance.inCompliant}</li>
                                       <li style="margin: 6px 0 0 0;padding: 0;list-style-position: inside;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.57;letter-spacing: 0.3px;color: #1c2745;font-size: 14px;font-family: 'Poppins', sans-serif;">Total compliant suppliers ${data.supplierCompliance.compliant}</li>
                                       <li style="margin: 6px 0 0 0;padding: 0;list-style-position: inside;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.57;letter-spacing: 0.3px;color: #1c2745;font-size: 14px;font-family: 'Poppins', sans-serif;">Supplier incidents currently open ${data.supplierIncidents.open}</li>
                                       <li style="margin: 6px 0 0 0;padding: 0;list-style-position: inside;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.57;letter-spacing: 0.3px;color: #1c2745;font-size: 14px;font-family: 'Poppins', sans-serif;">Supplier incidents resolved ${data.supplierIncidents.resolved}</li>
                                       <li style="margin: 6px 0 0 0;padding: 0;list-style-position: inside;font-weight: 600;font-stretch: normal;font-style: normal;line-height: 1.57;letter-spacing: 0.3px;color: #1c2745;font-size: 14px;font-family: 'Poppins', sans-serif;">Total contract value ${data.supplier.contractValue.total}</li>
                                    </ul>
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