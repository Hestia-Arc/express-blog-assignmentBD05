var express = require('express');
var router = express.Router();
var fs = require('fs');
const { parse, isSameDay, isBefore } = require("date-fns");

/* categories page. */
router.get('/:category', function(req, res, next) {
  let rawdata = fs.readFileSync('./database/posts.json');

  const { category } = req.params;

  // console.log(req.params)

  // if(category) {
  //   console.log(category)
  // } 
  // -----------------------
  let allPost = JSON.parse(rawdata)

  let data = JSON.parse(rawdata).sort(function (a, b) {
    let dateOne = parse(a.created_at, 'yyyy-MM-dd', new Date())

    let dateTwo = parse(b.created_at, 'yyyy-MM-dd', new Date());

    if (isSameDay(dateOne, dateTwo)) {
      return 0;
    }

    if (isBefore(dateOne, dateTwo)) {
      return 1;
    }

    return -1;
  });

  let navigationLinks = Array.from(new Set(data.map((post) => post.category).sort()));

  let dates = data.map(function(post) {
    let [year, month] = post.created_at.split('-');
    return new Date(`${year}-${month}-01`);
  });

  res.render('pages/category', {
    title: 'Categories',
    links: navigationLinks,
    category: category,
    posts: allPost.filter((post) => post.category === category),
    archives: Array.from(new Set(dates))

  });

});

module.exports = router;
