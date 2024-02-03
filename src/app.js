const express = require("express");
const authController = require("./controllers/authController");
const authMiddleware = require("./middlewares/authMiddleware");
const postController = require("./controllers/postController");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Register route
app.post("/register", authController.register);

// Login route
app.post("/login", authController.login);

// Protected route
app.get("/posts", authMiddleware.verifyToken, postController.getPosts);
app.get("/posts/:id", authMiddleware.verifyToken, postController.getPostById);

app.post("/posts", authMiddleware.verifyToken, postController.createPost);
app.delete("/posts/:id", authMiddleware.verifyToken, postController.deletePost);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
