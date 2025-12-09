module.exports = (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
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
