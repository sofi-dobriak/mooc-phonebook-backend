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

    if (!blog.title || !blog.url) {
      return response.status(400).send("Title or url is missing");
    }

    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
});

blogRoute.patch("/:id", async (req, res) => {
  const updateBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true },
  );

  updateBlog ? res.json(updateBlog) : res.status(404).end();
});

blogRoute.delete("/:id", async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  blog ? res.status(204).end() : res.status(404).send("Blog not found");
});

module.exports = blogRoute;
