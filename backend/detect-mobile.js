module.exports = (req, res, next) => {
  let ua = req.get("user-agent");

  if (ua) {
    req.is_mobile = /mobile/i.test(ua);
  }

  next();
};
