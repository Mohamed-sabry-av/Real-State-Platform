const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  console.log(req.userId);
  const token = req.cookies.token;

  if (!token) return res.status(400).json({ message: "Not Authentecated" });

  jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
    if (err) return res.status(403).json({ message: "Token isn't valid" });

    req.userId = payload.id;
    next();
  });
};
