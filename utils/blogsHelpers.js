const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.reduce((acc, { likes }) => likes + acc, 0);
};

const favoriteBlog = (blogs) => {
  let favBlog = blogs[0];

  for (const blog of blogs) {
    if (blog.likes > favBlog.likes) {
      favBlog = blog;
    }
  }

  return favBlog ? favBlog : 0;
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return {};

  const mostBlogsObject = {};

  for (const blog of blogs) {
    if (blog.author in mostBlogsObject) {
      mostBlogsObject[blog.author] += 1;
    } else {
      mostBlogsObject[blog.author] = 1;
    }
  }

  const maxCount = Math.max(...Object.values(mostBlogsObject));

  const [author, count] = Object.entries(mostBlogsObject).find(
    ([author, count]) => count === maxCount,
  );

  return { author: author, blogs: count };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return {};

  const mostLikesObject = {};

  for (const blog of blogs) {
    if (blog.author in mostLikesObject) {
      mostLikesObject[blog.author] += blog.likes;
    } else {
      mostLikesObject[blog.author] = blog.likes;
    }
  }

  const maxLikes = Math.max(...Object.values(mostLikesObject));

  const [author, mostLikes] = Object.entries(mostLikesObject).find(
    ([author, likes]) => likes === maxLikes,
  );

  return { author: author, likes: mostLikes };
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
