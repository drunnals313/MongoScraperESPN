
// dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
// Comment and Article models
var Comment = require("./models/Comment.js"); ////?
var Article = require("./models/Article.js");
// scraping tools
var request = require("request");
var cheerio = require("cheerio");

mongoose.Promise = Promise;

var PORT = process.env.PORT || 3000;

// database connections
var herokuDeploy = "mongodb://heroku_5561mt58:rvrb2ap0lnnu1v971v107hi5fd@ds031632.mlab.com:31632/heroku_5561mt58";
var localDeploy = "mongodb://localhost/ESPN";  //"mongodb://localhost/

var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static("public"));

mongoose.connect(herokuDeploy);

var db = mongoose.connection;

db.on("error", function (error) {
  console.log("Mongoose Error: ", error);
});

db.once("open", function () {
  console.log("Mongoose connection successful.");
});
// scrape
app.get("/scrape", function (req, res) {
  request("http://www.espn.com/nba/", function (error, response, html) {
    var $ = cheerio.load(html);
    $(".contentItem__padding").each(function (i, element) {
      var result = {};
      result.title = $(this).children("div").children("h1").text();
      result.description = $(this).children("div").children("p").text();
      result.link = $(this).attr("href");
      result.img = $(this).children("figure").children("picture").children("img").attr("data-default-src");
      result.sport = "NBA";
      var newArticle = new Article(result);

      newArticle.save(function (err, doc) {
        if (err) {
          console.log(err);
        }
        else {
          console.log(doc);
        }
      });

      console.log("NBA!!!\n\n", result);
    });

  });

  res.redirect("Scraped");
});

app.get("/articles", function (req, res) {
  Article.find({}, function (error, doc) {
    if (error) {
      console.log(error);
    }
    else {
      res.json(doc);
    }
  }).sort({_id: -1});
});

app.get("/:sport", function (req, res) {
  Article.find({ "sport": req.params.sport })
    .populate('Comment')
    .exec(function (error, doc) {
      if (error) {
        console.log(error);
      }
      else {
        res.json(doc);
      }
    });
})

app.get("/articles/:id", function (req, res) {
  Article.findOne({ "_id": req.params.id })
  .populate('Comment')
    .exec(function (error, doc) {
      if (error) {
        console.log(error);
      }
      else {
        res.json(doc);
      }
    });
});

/* app.post("/articles/:id", function (req, res) {
  var newComment = new Comment(req.body);
  console.log(req);
  newComment.save(function (error, doc) {
    if (error) {
    console.log(error);
    }
    else {
  Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": req.body.saved })
    .populate('comment')
    .exec(function (err, doc) {
      if (err) {
        console.log(err);
      }
      else {
        res.json(doc);
      }
    });
  }
});
}); */
app.post('/comment/:id', function(req, res) {
  var user = req.body.name;
  var summary = req.body.comment;
  var articleId = req.params.id;

  var commentObj = {
    name: user,
    body: summary
  };
 
  //creates a new comment
  var newComment = new Comment(commentObj);

  //save comment to database to the ID of the article
  newComment.save(function(err, doc) {
      if (err) {
          console.log(err);
      } else {
          console.log("document ID: " + doc._id)
          console.log("Article ID: " + articleId)

          //find the article and push the comment in database to the ID 
          Article.findOneAndUpdate({ "_id": req.params.id }, {$push: {'comment':doc._id}}, {new: true})
            .exec(function(err, doc) {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect('/Article/' + articleId);
                }
            });
        }
  });
});

app.listen(PORT, function () {
  console.log(`App running on port ${PORT}!`);
});