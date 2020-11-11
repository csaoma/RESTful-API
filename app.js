const express = require('express')
const port = 3000
const bodyParser = require('body-parser')
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express()

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// ejs set up
app.set('view engine', 'ejs');

// mongoose connect to local instance
mongoose.connect('mongodb://localhost:27017/wikiDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

// Requests for all articles
app.route('/articles')
  .get((req, res) => {
    Article.find(function(err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }

    });
  })
  .post((req, res) => {

    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });

    newArticle.save(function(err) {
      if (!err) {
        res.send("Successfully added new article")
      } else {
        res.send(err);
      }
    });
  })
  .delete((req, res) => {
    Article.deleteMany(function(err) {
      if (!err) {
        res.send("All articles successfully deleted");
      } else {
        res.send(err);
      }

    });
  });

// requests for specific articles
app.route('/articles/:articleTitle')
  .get((req, res) => {

    Article.findOne({
      title: req.params.articleTitle
    }, function(err, foundArticle) {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("Not found");
      }
    });
  })
  .put((req, res) => {
    Article.update(
      {title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content},
      {overwrite: true},
      function(err){
        if (!err){
          res.send("updated")
        }
      });
  })
  .patch((req, res) => {
    Article.update({
        title: req.params.articleTitle
      }, {
        $set: req.body
      },
      function(err) {
        if (!err) {
          res.send("updated article");
        } else {
          res.send(err);
        }
      }
    )
  })
  .delete((req, res) => {
    Article.deleteOne(
      {title: req.params.articleTitle},
      function(err){
        if(!err){
          res.send("item deleted");
        } else {
          res.send(err);
        }
      }
    );
  });


app.listen(port, () => {
  console.log(`Server at http://localhost:${port}`)
})
