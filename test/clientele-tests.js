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
  module("Typography")

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

  module("Imagery")
  var imagery = new clientele.Imagery({placeholderImage: '/clientele/images/slider.gif'});
  // FIXME: Test ping-24 stuff here...somehow.

  module("Formality")
  test('bindDefaultedTextInputs()', function() {
    expect(2)
    var defaultText = 'Type here kthx...';
    var formality = new clientele.Formality({defaultTextColor: 'red'});
    equal($('#defaulted').val(), 'Type Here kthx', 'should have inserted input title as default text')

    $('#defaulted').focus();
    equal($('#defaulted').css('color'), 'rgb(0, 0, 0)', 'On focus, final input text color should have been restored')    

  });

});