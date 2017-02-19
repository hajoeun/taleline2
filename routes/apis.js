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
  res.redirect(303, '/');
});

app.post('/post/create', function(req, res) {
  var date = new Date();
  knex('posts')
    .insert(_.extend({}, req.body, {
      user_name: req.session.user.name,
      user_id: req.session.user.id,
      created_at: date,
      updated_at: date
    }))
    .returning('*')
    .orderBy('updated_at', 'desc')
    .then(function(data) {
      res.json(data);
    })
});

app.get('/post/list', function(req, res) {
  knex('posts')
    .where({
      user_id: req.session.user.id
    })
    .select('id', 'user_name', 'content', 'updated_at')
    .orderBy('updated_at', 'desc')
    .then(function(post_list) {
      res.json(post_list);
    });
});


app.get('/sieum_data', function(req, res) {
  var poem_data = {
    mon: {
      title : '호수',
      author: '정지용',
      content : '얼굴 하나야\
                 손바닥 둘로 폭 가리지만\
                 보고픈 마음 호수만 하니\
                 눈감을 밖에',
      img: '0'
    },
    tue: {
      title : '풀꽃',
      author : '나태주',
      content : '자세히 보아야 예쁘다\
               오래 보아야 사랑스럽다\
               너도 그렇다',
      img: '1'
    },
    wed: {
      title : '진정한 여행',
      author : '나짐 히크메트',
      content : '가장 훌륭한 시는 아직 씌어지지 않았다\
              가장 아름다운 노래는 아직 불려지지 않았다\
              최고의 날들은 아직 살지 않은 날들\
              가장 넓은 바다는 아직 항해되지 않았고\
              가장 먼 여행은 아직 끝나지 않았다.\
              \
              불멸의 춤은 아직 추어지지 않았으며\
              가장 빛나는 별은 아직 발견되지 않은 별.\
              \
              무엇을 해야 할 지 더 이상 알 수 없을 때\
              그 때 비로소 진실로 무엇인가를 할 수 있다\
              어느 길로 가야할 지 더 이상 알 수 없을 때\
              그 때가 비로소 진정한 여행의 시작이다.',
      img: '2'
    }
  };

  res.jsonp(JSON.stringify(poem_data));
});

module.exports = app;
