const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function createPost(req, res) {
  const { id } = req.user;
  const { title, content } = req.body;
  try {
    const newPost = await prisma.post.create({
      data: {
        title: title,
        content: content,
        authorId: id,
        published: true,
      },
    });
    res.json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getPosts(req, res) {
  try {
    const posts = await prisma.post.findMany({
      //include: { author: true },

      where: {
        authorId: req.user.id,
      },
    });
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function deletePost(req, res) {
  const { id } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id),
        authorId: req.user.id,
      },
    });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    await prisma.post.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getPostById(req, res) {
  const { id } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id),
        authorId: req.user.id,
      },
    });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  createPost,
  getPosts,
  deletePost,
  getPostById,
};
