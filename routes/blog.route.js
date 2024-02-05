const express = require("express");
const { BlogModel } = require("../models/blog.model");
const BlogRoute = express.Router();

BlogRoute.get("/", async (req, res) => {
  try {
    const blogs = await BlogModel.find();
    res.send(blogs);
  } catch (error) {
    res.send({ err: error });
  }
  
});

BlogRoute.get("/:MetaTitle", async (req,res) => {
  try {
    const  {MetaTitle} = req.params;
    const blogs = await BlogModel.find({_id:MetaTitle});
    res.send(blogs);
  } catch (error) {
    res.send({ err: error });
  }
})

BlogRoute.post("/", async (req, res) => {
  try {
    const newBlog = new BlogModel(req.body);
    await newBlog.save();
    res.send({ msg: "New blog added successfully!" });
  } catch (error) {
    res.send({ err: error });
  }
});

BlogRoute.delete("/delete/:id", async (req, res) => {
    try {
        const {id} = req.params
        const afterDeletion = await BlogModel.findByIdAndDelete({_id:id})
        res.send({msg:"blog is deleted successfully!"})
    } catch (error) {
        res.send({ err: error });
    }
});

BlogRoute.patch("/update/:id",async(req,res) => {
  try {
    const {id} = req.params
    const afterUpdation = await BlogModel.findByIdAndUpdate({_id:id},req.body)
    res.send({msg:"blog is updated successfully!"})
  } catch (error) {
    res.send({ err: error });
  }
})


module.exports = {
  BlogRoute,
};
