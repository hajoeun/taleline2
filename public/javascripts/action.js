$(function() {
  var $tab_sign_in = $('.tab.sign_in'),
      $tab_sign_up = $('.tab.sign_up'),
      $form_sign_in = $('.sign_wrapper .sign_in'),
      $form_sign_up = $('.sign_wrapper .sign_up');

  $tab_sign_in.on('click', toggleSign);
  $tab_sign_up.on('click', toggleSign);

  function toggleSign() {
    if (this == $tab_sign_in[0]) {
      $form_sign_in.show();
      $form_sign_up.hide();
      $tab_sign_in.addClass('checked');
      $tab_sign_up.removeClass('checked');
    } else {
      $form_sign_up.show();
      $form_sign_in.hide();
      $tab_sign_up.addClass('checked');
      $tab_sign_in.removeClass('checked');
    }
  }
});