const express = require('express');
var router = express.Router();
var moment = require('moment');
require('dotenv').config()
const jwt = require('jsonwebtoken');
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({
  extended: true
}));
var Quiz = require('./quiz.js');
const Teacher = require('./teacher');
router.use(bodyParser.json());
router.get('/:id', async function(req, res) {
  console.log(req.params.id);
  await Quiz.findOne({
    _id: req.params.id
  }, function(err, doc) {
    if (!err) {
      res.render('studentMarkSheet', {
        markjson: JSON.stringify({
          stdlist: doc.stdslist,
          totalmark: doc.mark
        })
      });
    }
  });
});
module.exports = router;
