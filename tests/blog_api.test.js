const { test, after, beforeEach } = require("node:test");
const assert = require("assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const Blog = require("../models/blogItem");

const api = supertest(app);

const initialBlogs = [
  { title: "Title 1", author: "Author 1", url: "Url 1", likes: 1 },
  { title: "Title 2", author: "Author 2", url: "Url 2", likes: 2 },
  { title: "Title 3", author: "Author 3", url: "Url 3", likes: 3 },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);
});

test("blogs list are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");
  assert.strictEqual(response.body.length, initialBlogs.length);
});

test("unique identifier is id", async () => {
  const blogs = await api.get("/api/blogs");

  const result = blogs.body.every((blog) => blog.id !== undefined);
  assert.strictEqual(result, true);
});

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "Title 4",
    author: "Author 4",
    url: "Url 4",
    likes: 4,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogs = await api.get("/api/blogs");
  assert.strictEqual(blogs.body.length, initialBlogs.length + 1);

  const { title, author, url, likes } = blogs.body.find(
    (blog) => blog.title === "Title 4",
  );

  assert.deepStrictEqual(
    { title, author, url, likes },
    {
      title: "Title 4",
      author: "Author 4",
      url: "Url 4",
      likes: 4,
    },
  );
});

test("a blog without likes has 0 as a default value", async () => {
  const newBlog = {
    title: "Title 5",
    author: "Author 5",
    url: "Url 5",
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogs = await api.get("/api/blogs");
  assert.strictEqual(blogs.body.length, initialBlogs.length + 1);

  const blog = blogs.body.find((blog) => blog.title === "Title 5");
  assert.strictEqual(blog.likes, 0);
});

test("a blog can not added without title", async () => {
  const newBlog = { author: "Author 6", url: "Url 6" };
  await api.post("/api/blogs").send(newBlog).expect(400);
});

test("a blog can not added without url", async () => {
  const newBlog = { title: "Title 7", author: "Author 7" };
  await api.post("/api/blogs").send(newBlog).expect(400);
});

after(async () => await mongoose.connection.close());
