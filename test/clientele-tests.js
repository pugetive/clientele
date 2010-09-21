function countBackgroundImages(selector) {
  var images = 0;
  $(selector + ' *').each(function(){
    if ($(this).css('background-image') != 'none'){
      ++images;
    }
  });
  return images;
};

$(function(){

  /* ----------------------------------------------------- */
  module("Typography")
  /*----------------------------------------------------- */

  test("swapHeadings()", function(){
    expect(2);
    var images = countBackgroundImages('#swap-headings');
    equal(images, 0, "should initiate with zero images");
    
    var type = new clientele.Typography({imageDirectory: '/clientele/images'});
    // var type = new clientele.Standard({formality: {defaultTextColor: 'red'},
    //                                    imagery  : {placeholderImage: 'http://www.urbaninfluence.com/sites/all/themes/urbaninfluence/images/slider.gif'}});
    // // var type = new clientele.Standard({formality: {defaultTextColor: 'red'}});
    images = countBackgroundImages('#swap-headings');
    equal(images, 5, "should have created background images in place of text");
  });


  /*----------------------------------------------------- */
  module("Imagery")
  /*----------------------------------------------------- */

  var placeholder = new clientele.Imagery({placeholderImage: '/clientele/images/slider.gif'});
  // FIXME: Test ping-24 stuff here...somehow.

  var slideshow = new clientele.Imagery.slideShow({imageDirectory: '/clientele/images',
                                                   images: ['image-medium.jpg', 'heading-access-expired.png', 'heading-automatically-logged-out.png'],
                                                   interval: 1});

  test("slideShow()", function(){
    stop();
    alert('Running asynchronous tests.  Click okay then wait a sec...')
    image_1 = slideshow._currentSlideIndex;
    setTimeout(function() {
      expect(1);
      image_2 = slideshow._currentSlideIndex;
      ok(image_1 != image_2);
      start();
    }, 2000);
  });


  /*----------------------------------------------------- */  
  module("Formality")
  /*----------------------------------------------------- */  

  test('bindDefaultedTextInputs()', function() {
    expect(2);
    var defaultText = 'Type here kthx...';
    var formality = new clientele.Formality({defaultTextColor: 'red'});
    equal($('#defaulted').val(), 'Type Here kthx', 'should have inserted input title as default text')

    $('#defaulted').focus();
    equal($('#defaulted').css('color'), 'rgb(0, 0, 0)', 'On focus, final input text color should have been restored')    

  });


  /*----------------------------------------------------- */
  module("UI")
  /*----------------------------------------------------- */

  var tabs = new clientele.UI.tabs("tab-test");
  $('.c-tab').last().click();

  test("tabs()", function(){
    expect(2);
    equal($('.c-tab-content').first().css('display'), 'none', "Clicking second tab should have hid the first's content.");
    equal($('.c-tab').last().hasClass('c-tab-on'), true, "Clicking second tab should have turned the tab on.");
  });

});