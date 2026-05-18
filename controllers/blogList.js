const blogRoute = require("express").Router();
const Blog = require("../models/blogItem");

blogRoute.get("/", async (request, response) => {
  try {
    const blogs = await Blog.find({});
    response.json(blogs);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
});

blogRoute.post("/", async (request, response) => {
  try {
    const blog = new Blog(request.body);
    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

module.exports = blogRoute;
