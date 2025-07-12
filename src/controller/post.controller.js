const Post = require("../models/post.model");

exports.getPosts = async (res, req) => {
  try {
    const posts = await Post.find().populate("postDetail");
    res.status(200).json(posts);
  } catch (err) {
    res.status(400).json({ message: "Failed to get Post" });
  }
};
exports.getPost = async (res, req) => {
  const id = req.params;
  try {
    const posts = await Post.findById({
      where: {
        id: id,
      },
      // include: {
      //   postDetail: true,
      // },
    });
    res.status(200).json(posts);
  } catch (err) {
    res.status(400).json({ message: "Failed to get Post" });
  }
};
exports.updatePost = async (res, req) => {
  try {
    res.status(200).json();
  } catch (err) {
    res.status(400).json({ message: "Failed to get Post" });
  }
};
exports.deletePost = async (res, req) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  try {
    const post = await Post.findById({
      where: {
        id: id,
      },
    });
    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    res.status(200).json();
  } catch (err) {
    res.status(400).json({ message: "Failed to get Post" });
  }
};
exports.addPost = async (res, req) => {
  const { postDetail, ...postData } = req.body;
  const tokenUserId = req.userId;

  try {
    let postDetailId;
    if (postDetail) {
      const newPostDetail = await postDetail.create(postDetail);
      postDetailId = newPostDetail._id;
    }
    const newPost = await Post.create({
      ...postData,
      userId:tokenUserId,
      postDetail:postDetail
    })
    const populatedPost = await Post.findById(newPost._id).populate("postDetail");
    res.status(200).json(populatedPost);
  } catch (err) {
    res.status(400).json({ message: "Failed to get Post" });
  }
};

// exports.addPost = async (res,req)=>{
//   const body = req.body;
//   const tokenUserId = req.userId;
//   try{
//     const newPost = await Post.create({
//       data:{
//         ...body.postData,
//         userId: tokenUserId,
//         postDetail:{
//           create: body.postDetail,
//         },
//       },
//     })
//     res.status(200).json(newPost)
//   } catch(err){
//     res.status(400).json({error:err.{message})
//   }
// }}
