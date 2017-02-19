var express = require('express');
var app = express();

/* GET home page. */
app.get('/', function(req, res) {
  var user = req.session && req.session.user;
  console.log(user);
  var body = (user && user.name) ? './main.ejs' : './welcome.ejs';

  res.render('index', {
    title: 'Taleline',
    body: body,
    user: user,
    message: req.session && req.session.message,
  });
});

module.exports = app;
