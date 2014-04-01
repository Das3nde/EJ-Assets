$(function() {

  $(".zoom").anythingZoomer({
    overlay : true,
    edit: false,
    // If you need to make the left top corner be at exactly 0,0, adjust the offset values below
    offsetX : 0,
    offsetY : 0,
    edge : -50
  });

  $('.president')
  .bind('click', function(){
    return false;
  })
  .bind('mouseover click', function(){
    var loc = $(this).attr('rel');
    if (loc && loc.indexOf(',') > 0) {
      loc = loc.split(',');
      $('.zoom').anythingZoomer( loc[0], loc[1] );
    }
    return false;
  });

});
