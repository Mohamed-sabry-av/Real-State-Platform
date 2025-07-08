const jwt = require("jsonwebtoken");

exports.shoudBeLoggedIn = async (req, res) => {
  console.log(req.userId)
  res.status(200).json({message:"you are authentecated"})
};

exports.shouldBeAdmin = async (req,res)=>{
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: "Not authentecated" });

  jwt.verify(token, process.env.JWT_SECRET, async(err,payload) =>{
    if(err) return res.status(403).json({message: "Token isnt valid"})
      if(!payload.isAdmin) return res.status(403).json({message: "You are not admin"})
  });

  res.status(200).json({message:"you are authentecated"})
}
