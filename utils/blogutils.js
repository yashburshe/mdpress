const marked = require("marked");
const fs = require("fs");
const { dir } = require("console");
const path = require("path");
const { title } = require("process");

// in next update: rel="author" href="/author/john-doe" create author system

function toDateStrings(date) {
  let day = date.getDate();
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let nth;
  if ((day >= 4 && day <= 20) || (day >= 24 && day <= 30)) {
    nth = "th";
  } else if (day == 1 || day == 21 || day == 31) {
    nth = "st";
  } else if (day == 2 || day == 22) {
    nth = "nd";
  } else {
    nth = "rd";
  }
  const monthDayYear = `${
    months[date.getMonth() + 1]
  } ${day}${nth}, ${date.getFullYear()}`;
  const slashedDate = `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`;
  return { monthDayYear, slashedDate };
}

function toHtmlPage(formData) {
  const parsed = marked.parse(formData.content);
  const dateStrings = toDateStrings(new Date(formData.date));
  const html = `
    <html>
      <%- include('../partials/header') %>
      <body>
      <div class="wrapper">
        <%- include('../partials/navbar') %>
        <a href='/posts'><< Go Back</a>
        <main>
          <hgroup>
          <h1 class="headline">${formData.title}</h1>
          <div class="byline">
            <address class="author">By <a>${formData.author}</a></address> 
            on <time pubdate date="${formData.date}" title="${
            dateStrings.monthDayYear
            }">${dateStrings.slashedDate}</time>
          </div>
          </hgroup>
          ${parsed.trim()}
        </main>
        <div>
      </body>
    </html>
  `;
  return html;
}

function makeEjsFile(html, slug) {
  var filePath = path.join(__dirname, "..", "views", "posts", `${slug}.ejs`);
  fs.writeFile(filePath, html, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Written successfully");
    }
  });
}

function addToJson(formData) {
  let postMetaData = {
    slug: formData.slug,
    title: formData.title,
    date: formData.date,
    author: formData.author,
  };
  let starterJson = [postMetaData];
  var filePath = path.join(__dirname, "posts.json");
  if (fs.existsSync(filePath)) {
    let jsonFile = fs.readFileSync(filePath, "utf-8");
    let jsonData = JSON.parse(jsonFile);
    jsonData.push(postMetaData);
    fs.writeFileSync(filePath, JSON.stringify(jsonData), (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Json made success");
      }
    });
  } else {
    fs.writeFileSync(filePath, JSON.stringify(starterJson), (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Json made success");
      }
    });
  }
}

function getPosts() {
  const filePath = path.join(__dirname, "posts.json");
  let posts;
  if (fs.existsSync(filePath)) {
    posts = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } else {
    posts = [];
  }
  return posts;
}

function deletePost(slug) {
  const filePath = path.join(__dirname, "posts.json");
  const postPath = path.join(__dirname, "..", "views", "posts", `${slug}.ejs`);
  const posts = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  let index;
  for (let i = 0; i < posts.length; i++) {
    if (posts[i].slug === slug) {
      index = i;
      break;
    }
  }
  console.log;
  posts.splice(index, 1);
  fs.writeFileSync(filePath, JSON.stringify(posts), (err) => {
    if (err) throw err;
    console.log("Post removed");
  });
  fs.unlinkSync(postPath);
}

module.exports = { toHtmlPage, makeEjsFile, addToJson, getPosts, deletePost };
