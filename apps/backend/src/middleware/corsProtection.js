module.exports = (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Methods", [
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "OPTIONS",
    "PATCH",
  ]);
  res.setHeader("Access-Control-Allow-Headers", [
    "Content-Type",
    "Authorization",
    "x-auth-accesstoken",
    "x-auth-refreshtoken",
    "x-org-id",
    "x-group-id",
    "x-file-name",
    "x-register-token",
    "x-recovery-token",
    "x-resetpassword-token",
    "x-verification-token",
    "x-file-key",
    "x-file-bucket",
    "x-file-name",
    "x-file-public",
    "x-file-path",
    "x-moduleType",
    "x-moduleId",
    "x-invitation-token",
    "x-tenant",
    "x-doc-parentnode",
    "x-doc-filename",
    "x-doc-nodeid",
    "x-signpermission-token",
    "x-auth-limited-cid",
    "x-auth-limited-accesstoken",
  ]);
  res.setHeader("Access-Control-Max-Age", 1728000);
  res.setHeader(
    "Access-Control-Expose-Headers",
    "x-auth-newaccesstoken,x-auth-newrefreshtoken,x-auth-newgrouppolicytoken,x-auth-newrolepolicytoken"
  );
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
};
