const express = require('express')
const port = 3000
const bodyParser = require('body-parser')
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// ejs set up
app.set('view engine', 'ejs');

// mongoose connect to local instance
mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

// chaining get, post, and delete methods
app.route('/articles')
.get( (req, res) => {
  Article.find(function(err, foundArticles){
    if(!err){
      res.send(foundArticles);
    } else {
      res.send(err);
    }

  });
})
.post( (req, res) => {
  var title = req.body.title;
  var body = req.body.content;
  console.log(title, body)

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save(function(err){
    if (!err){
      res.send("Successfully added new article")
    } else {
      res.send(err);
    }
  });
})
.delete( (req, res) => {
  Article.deleteMany(function(err){
    if (!err){
      res.send("All articles successfully deleted");
    } else {
      res.send(err);
    }

  });
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
