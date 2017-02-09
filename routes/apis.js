var express = require('express');
var app = express();
var credentials = require('../private/credentials');
var knex = require('knex')({
  client: 'pg',
  connection: credentials.pg_connection,
  debug: false
});

app.post('/', function(req, res) {
  res.send("----------------");
});

app.post('/signin', function(req, res) {
  knex('users').where({
    email: req.body.email,
    password: req.body.password
  }).then(function(user) {
    user = _.omit(_.first(user), 'password');
    if (user.id) {
      req.session.user = user;
    }
    res.redirect(303, '/');
  });
});

app.post('/signup', function(req, res) {
  var user = req.body;
  if (user.password !== user.password_confirm) {
    req.session.message = {
      type: 'error',
      text: '비밀번호가 일치하지 않습니다.'
    };
    return res.redirect(303, '/');
  }

  knex('users').insert({
    name: user.name,
    email: user.email,
    password: user.password
  }).then(function() {
    req.session.user = user;
    res.redirect(303, '/');
  });
});

app.post('/signout', function(req, res) {
  req.session.user = {};
  console.log('signout!');
  res.redirect(303, '/');
});

module.exports = app;
