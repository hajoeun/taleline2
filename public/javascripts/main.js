$(function() {
  console.log("Welcome to Main Page");
  $('.main_header').on('click', '.thumb', function() {
    $.post('/apis/signout').then(function(){
      window.location.reload();
    })
  });

  $('.btn_wrapper').on('click', '.submit', function() {
    var $textarea = $('textarea');
    if (!$textarea.val()) return;

    var body = { content: $textarea() };
    $.post('/apis/post/create', body).then(__(
      _.t.each('post','\
        li.{{post.id}} {{post.content}}\
      '),
      $,
      (jq_elem) => {
        $textarea.val('');
        jq_elem.prependTo($('ul'));
      }
    ))
  });


  getList();
  function getList() {
    $.get('/apis/post/list').then(__(
      _.t.each('post', '\
        li.{{post.id}} {{post.content}}\
      '),
      $,
      function(jq_elem) {
        jq_elem.appendTo($('ul'));
      }
    ))
  }

  $('.btn_wrapper').on('click', '.refresh', getList)


});