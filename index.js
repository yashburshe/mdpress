const express = require("express");
const bodyParser = require("body-parser");
const blogutils = require("./utils/blogutils");
require("dotenv").config();

const app = express();
const port = process.env.PORT;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.get("/manage-posts", (req, res) => {
  const posts = blogutils.getPosts();
  res.render("manage-posts", { title: "Manage Posts", posts: posts });
});

app.get("/posts", (req, res) => {
  const posts = blogutils.getPosts();
  res.render("posts", { title: "Posts", posts: posts });
});

app.get("/create-post", (req, res) => {
  res.render("create-post", { title: "Create a Post" });
});

app.get("/posts/:slug", (req, res) => {
  res.render("posts/" + req.params.slug, { title: "Post" });
});

app.post("/save-post", (req, res) => {
  const formData = req.body;
  const html = blogutils.toHtmlPage(formData);
  blogutils.addToJson(formData);
  blogutils.makeEjsFile(html, formData.slug);
  const posts = blogutils.getPosts();
  res.redirect("/manage-posts");
});

app.post("/delete-post", (req, res) => {
  const formData = req.body;
  blogutils.deletePost(formData.slug);
  const posts = blogutils.getPosts();
  res.redirect("/manage-posts");
});

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
});
