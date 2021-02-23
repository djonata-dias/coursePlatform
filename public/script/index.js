$(document).ready(() => {
  let count = 0;
  $('.weekday').each(element => {
    if ($(`#weekday${element}`).children().length && count == 0) {
      count = + 1;
      $(`#weekday${element}`).addClass('show');
    }
  });
});
