// import http from "./httpServices"
// import {getCurrentUserInfo} from "./userServices"
// import moment from 'moment'
// moment().format()
// const apiEndPoint = `/api/${process.env.REACT_APP_API_VERSION}/businessFunctions`

// export function createBusinessFunction(businessFunction,user){
//     return http.post(`${apiEndPoint}/${getCurrentUserInfo().organizationId._id}`,{
//         name:businessFunction.name,
//         operatingLocation:businessFunction.operatingLocation,
//         responsibility:businessFunction.responsibility,
//         user,
//         by:getCurrentUserInfo()
//     })
// }
// export function getBusinessFunctions(){
//     return http.get(`${apiEndPoint}/${getCurrentUserInfo().organizationId._id}`)
// }
// export function getBusinessFunction(BusinessFunctionId){
//     return http.get(`${apiEndPoint}/${getCurrentUserInfo().organizationId._id}/${BusinessFunctionId}`)
// }
// export function updateBusinessFunction(route){
//     return http.post(`${apiEndPoint}/${getCurrentUserInfo().organizationId._id}/${route}`)
// }
// export function mapToBusinessFunctionModel(businessFunction){
//     return {
//         data:{
//             name:businessFunction.name,
//             operatingLocation:businessFunction.operatingLocation,
//             responsibility:businessFunction.responsibility,
//             user:'annonymus',
//             numberOfStaffs:businessFunction.numberOfStaffs
//         },
//         errors:{}
//     }
// }
// // this route is down for maintanance ...
// export function deleteBusinessFunction(businessFunctionId){
//     return http.post(`${apiEndPoint}/${getCurrentUserInfo().organizationId._id}/${businessFunctionId}`)
// }
// export function createJobRole(businessFunctionID,jobrole){
//     return http.post(`${apiEndPoint}/${getCurrentUserInfo().organizationId._id}/${businessFunctionID}/jobrole/`,{
//         isRemote:jobrole.isRemote,
//         name:jobrole.name,
//         salary:jobrole.salary,
//         userName:jobrole.userName,
//         email:jobrole.email,
//     })
// }
// export function getJobRoles(businessFunctionID){
//     return http.get(`${apiEndPoint}/${getCurrentUserInfo().organizationId._id}/${businessFunctionID}/jobrole`)
// }
// export function getJobRole(businessFunctionID,jobRoleId){
//     return http.get(`${apiEndPoint}/${getCurrentUserInfo().organizationId._id}/${businessFunctionID}/jobrole/${jobRoleId}`)
// }
// export function mapToJobRoleModel(jobrole){
//     return {
//         data:{
//             userName:jobrole.userName,
//             email:jobrole.email,
//             isRemote:jobrole.isRemote,
//             name:jobrole.name,
//             salary:jobrole.salary,
//             isHeadOfService:jobrole.isHeadOfService,
//             hasAccess:jobrole.hasAccess
//         },
//         errors:{}
//     }
// }
// export function updateJobRole(businessFunctionID,jobrole,jobRoleId){
//     return http.put(`${apiEndPoint}/${getCurrentUserInfo().organizationId._id}/${businessFunctionID}/jobrole/${jobRoleId}`,{
//         isRemote:jobrole.isRemote,
//         name:jobrole.name,
//         salary:jobrole.salary,
//     })
// }

// export function deleteJobRole(businessFunctionId,jobRoleId){
//     return http.delete(`${apiEndPoint}/${getCurrentUserInfo().organizationId._id}/${businessFunctionId}/jobrole/${jobRoleId}`)
// }

// export function createPremise(businessFunctionID,premise){
//     return http.post(`${apiEndPoint}/${getCurrentUserInfo().organizationId._id}/${businessFunctionID}/premise`,{
//         name:premise.name,
//         address:premise.address,
//         location:premise.location
//     })
// }
// export function getPremises(businessFunctionID){
//     return http.get(`${apiEndPoint}/${getCurrentUserInfo().organizationId._id}/${businessFunctionID}/premise`)
// }
// export function mapToPremiseModel(premise){
//     return {
//         data:{
//             name:premise.name,
//             address:premise.address,
//             location:premise.location,
//         },
//         errors:{}
//     }
// }
// export function updatePremise(businessFunctionID,premise,premiseId){
//     return http.put(`${apiEndPoint}/${getCurrentUserInfo().organizationId._id}/${businessFunctionID}/premise/${premiseId}`,{
//         name:premise.name,
//         address:premise.address,
//         location:premise.location
//     })
// }
// export function deletePremise(businessFunctionId,premiseId){
//     return http.delete(`${apiEndPoint}/${getCurrentUserInfo().organizationId._id}/${businessFunctionId}/premise/${premiseId}`)
// }

// export function grantImsAccess(businessFunctionId,jobRoleId){
//     return http.put(`${apiEndPoint}/${getCurrentUserInfo().organizationId._id}/${businessFunctionId}/jobrole/${jobRoleId}/grantAccess`,{by:getCurrentUserInfo()})
// }
// export function revokeImsAccess(businessFunctionId,jobRoleId){
//     return http.put(`${apiEndPoint}/${getCurrentUserInfo().organizationId._id}/${businessFunctionId}/jobrole/${jobRoleId}/revokeAccess`)
// }
// export function getHead(businessFunctionId){
//     return http.get(`${apiEndPoint}/${getCurrentUserInfo().organizationId._id}/${businessFunctionId}/head`)
// }
// export function changeHead(businessFunctionId,formerHead,newHead){
//     return http.put(`${apiEndPoint}/${getCurrentUserInfo().organizationId._id}/${businessFunctionId}/changeHead`,{
//         formerHead,
//         newHead,
//         by:getCurrentUserInfo()
//     })
// }
// export function allocateLicense(businessFunctionId,data){
//     return http.put(`${apiEndPoint}/${getCurrentUserInfo().organizationId._id}/${businessFunctionId}/license`,{
//         amount:data.amount,
//     })
// }
