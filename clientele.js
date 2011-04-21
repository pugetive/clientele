/**
 Clientele: a JavaScript utility library for client projects
 @author Todd Gehman (toddgehman@gmail.com)
 Copyright (c) 2010 Todd Gehman

 Includes the Supersleight jQuery plugin with some modifications.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

clientele = {
  Typography : function() {},
  Imagery    : function() {},
  Formality  : function() {},
  UI         : function() {},
  Standard   : function() {}
}

/**
  The Standard constructor can be used to implement all the clientele
  default features - though specific options can be specified via 
  a passed in two-dimensional hash:

   new clientele.Standard({typography: {someOption: optionValue},
                           imagery   : {someOption: optionValue},
                           formality : {someOption: optionValue}})
*/

clientele.Standard = function(options) {
  if (typeof(options) == 'undefined'){
    options = new Array();
  }
  $(function(){
    new clientele.Typography(options['typography']);
    new clientele.Imagery(options['imagery']);
    new clientele.Formality(options['formality']);
  });
}


clientele.Error = function(text) {
  this.debugMode = false;

  var complete_message = 'clientele.js DEBUG: ' + text;

  try {
    console.log(complete_message);
  } catch(err){
    if (this.debugMode)
      alert(complete_message);
  }

}

/**
* ----------------------------------------------------------------------
* Typography 
* ----------------------------------------------------------------------
*/

clientele.Typography = function(options) {
  /**
   * The following attributes specify how the replaced text tags are selected, how the 
   * corresponding image tag is constructed.
   *
   *   For instance, based on the settings below, the tag:
   *     <h1 class="c-swap" title="Best of Times">It was the best of times, it was the worst of times</h1>
   *   ...will get automatically replaced with the image at path:
   *     /clientele/images/heading-best-of-times.png
  */  
  this.replacedTextSelector      = '.c-swap';
  this.embeddedFilenameAttribute = 'title';
  this.imageDirectory            = '/images';
  this.imagePrefix               = 'heading-';
  this.imageSuffix               = '.png';
  // this.lineHeightToFontSizeRatio = 1.2;

  this.defaultBackgroundImagePosition = 'top left';
  this.backgroundPositionPrefix       = 'c-position';
  this.wrappingClassPrefix            = 'wrapped';
  
  this.doSwapHeadings = true;

  // Replace the defaults with any passed in parameters;
  for (var n in options) { this[n] = arguments[0][n]; }

  var position_match = '(top|bottom|left|right|center|[0-9]+px)';
  this._backgroundPositionRegExp = new RegExp([this.backgroundPositionPrefix, position_match, position_match].join('-'), 'ig');

  if (this.doSwapHeadings) { this.swapHeadings(); }
}

clientele.Typography.prototype.swapHeadings = function() {
  var t = this;
  $(t.replacedTextSelector).each(function() {
    var heading_element = $(this);
    var title = heading_element.attr(t.embeddedFilenameAttribute);

    // If there is no image filename implied via the embeddedFilenameAttribute, get it from the live text.
    // This allows you to use:
    //  <h3 class="swap">My House</h3>
    //  ...instead of the redundant:
    //  <h3 class="swap" title="My House">My House</h3>
    if (!title.match(/\S/)) {
      title = heading_element.html();
    }

    var line_height = parseFloat(heading_element.css('line-height'));
    var text_height = heading_element.height();
  //  alert('line ' + line_height + ' text ' + text_height);
    
    var multi_line = false;

    var background_image_position = t.defaultBackgroundImagePosition;

    // Handle these edge cases:
    //  1) The live text wraps to two lines but gets replaced with a single-line graphic
    //     - In this case, we want to remove the extra block space that would have been left by the wrapped live text
    //  2) The graphic heading is known to contain multiple lines (signified by the "wrapped-N" class)
    //     - In this case, we need to make sure the live block will be tall enough to accomodate the graphic,
    //       whether or not the live text wrapped
    var classes = heading_element.attr('class').split(' ');
    $.each(classes, function(index, item){

      // Handle classes specifying how to wrap the lines: wrapped-3
        if (item.match(t.wrappingClassPrefix)) {
          var num_lines = parseInt(item.split('-')[1]);
          if (num_lines == undefined){
            num_lines = 2;
          }
          text_height = num_lines * line_height;
//          alert('line: ' + line_height + 'text: ' + text_height);
          multi_line = true;
        }

        // Handle classes specifying how to position the background image within the block: c-position-top-right
        // (default is top left)
        if(positions = item.match(t._backgroundPositionRegExp)){
          background_image_position = positions[0].split('-').splice(-2).join(' ');
        }

    });

    if (!multi_line && (text_height > line_height)) {
      text_height = line_height;
    }
    
    image_path = t.titleToImagePath(title)

    if (heading_element.get(0).tagName == 'SPAN'){
      heading_element.css('display', 'block');
    }

    if (image_path){
      var existing_background_image = heading_element.css('background-image');
      var existing_background_color = heading_element.css('background-color');
      if (existing_background_image != 'none' || existing_background_color != 'transparent'){
        heading_wrapper = $("<div>").css({'background-image'    : existing_background_image,
                                           'background-repeat'   : heading_element.css('background-repeat'),
                                           'background-position' : heading_element.css('background-position'),
                                           'background-color'    : existing_background_color});
        heading_element.wrap(heading_wrapper);
      }
      heading_element.html("&nbsp;").css('line-height', 0);
      heading_element.css('background', 'transparent url(' + image_path + ') no-repeat ' + background_image_position);
      if (text_height > 0){
        heading_element.height(0).css('padding-top', text_height);
      };
    };
  });
}

clientele.Typography.prototype.titleToImagePath = function(title) {
  if (title == ""){
    return false;
  }

  var string_cleaning = {"'"     : '',
                         ":"     : '',
                         ','     : '',
                         '&amp;' : 'and',
                         '&'     : 'and'};


  var clean_title = title;
  for(key in string_cleaning) {
    clean_title = clean_title.replace(key, string_cleaning[key]);
  };
  var path_token = clean_title.toLowerCase().split(/ /).join('-');

  var path_prefix = '';
  if (this.imageDirectory.match(/\S/)){
    path_prefix = this.imageDirectory + "/";
  }
  var image_path = path_prefix + this.imagePrefix + path_token + this.imageSuffix;
  return image_path;
}

/**
* ----------------------------------------------------------------------
* Imagery
* ----------------------------------------------------------------------
*/

clientele.Imagery = function(options) {

  this.placeheldImageSelector     = '.c-placeheld';
  this.placeholderBackgroundColor = '#ccc';
  this.pngAncestorSelector        = 'body'; // NOTE: performance cost to doing this globally with 'body'
  // this.placeholderText        = 'Loading...'

  if (typeof(options) == 'undefined'){
    options = new Array();
  }

  if (options['placeholderImage']){
    this.doPlaceholdImages = true;
  } else {
    this.doPlaceholdImages = false;
  }
  this.doPngTransparency = false;

  // Replace the defaults with any passed in parameters;
  for (var n in options) { this[n] = arguments[0][n]; }

  var t = this;

  if (t.doPlaceholdImages && ($(t.placeheldImageSelector).size > 0)) {
    if(options && options['placeholderImage']){
      t.placeholderImage = options['placeholderImage'];
    } else {
      new clientele.Error('Image placeholding requires the imagery:placeholderImage option to be set to a URL. ' + 
                          'Or turn off placeholding by setting doPlaceholdImages to false;');
    }
  }

  if (this.doPlaceholdImages) { this.placeholdImages(); }
  if (this.doPngTransparency) { $(this.pngAncestorSelector).supersleight(); } 
}


clientele.Imagery.prototype.placeholdImages = function() {
  var placeholder = this;
  function preloadImage(image_source, callback) {
    var image_preloader = new Image();

    image_preloader.src = image_source;
    if(image_preloader.complete){
      callback();
      image_preloader.onload = function(){};
    } else {
      image_preloader.onload = function() {
        callback();
        image_preloader.onload = function(){};
      }
    }
  }

  $(this.placeheldImageSelector).each(function() {
    var image_element = $(this);
    image_element.css('visibility', 'hidden');
    image_element.wrap(function(){
      var wrapper = $('<span>');
      wrapper.css({'display'            : 'inline-block',
                   'background-color'   : placeholder.placeholderBackgroundColor,
                   'background-image'   : 'url(' + placeholder.placeholderImage + ')',
                   'background-repeat'  : 'no-repeat',
                   'background-position': 'center center',
                   'border'  : 0,
                   'padding' : 0,
                   'margin'  : 0});
      return wrapper;
    });
    preloadImage(image_element.attr('src'), function(){
      image_element.fadeOut(100, function(){
        $(this).css('visibility', 'visible').fadeIn().unwrap();
      });
    });
  });
}

clientele.Imagery.slideShow = function(options) {
  this.frameID            = '#c-slideshow';
  this.interval           = 5;
  this.imageDirectory     = '/images';
  this.backgroundPosition = 'center center';
  this.doPngTransparency  = true;
  
  for (var n in options) { this[n] = arguments[0][n]; }

  if (options['images'] == undefined){
    new clientele.Error('images parameter is required to instantiate a slideShow.')
    return false;
  } else {
    this._images = options['images'];
  }

  if (options["imageTargets"]){
    this._imageTargets = options["imageTargets"];
  }

  this._frame = $(this.frameID);
  this._imagePaths    = new Array();
  for (image_index in this._images){
    this._imagePaths.push(this.imageDirectory + '/' + this._images[image_index]);
  }

  this._currentSlideIndex = 0;

  var slideshow_handler = this;

  // Show the first slide if it's not already there.
  if (this._frame.css('background-image') != this._imagePaths[0]){
    slideshow_handler.showSlide(0);
  }

  function timedSlide() {
    slideshow_handler.nextSlide();
  }

  setInterval(timedSlide, this.interval * 1000);

}

clientele.Imagery.slideShow.prototype.nextSlide = function() {
  if (this._currentSlideIndex < this.images.length - 1) {
    this.showSlide(this._currentSlideIndex + 1);
  } else {
    this.showSlide(0);
  }
}

clientele.Imagery.slideShow.prototype.showSlide = function(slide_index){
  var slideshow = this;
  slideshow._currentSlideIndex = slide_index;
  var new_background_image = slideshow._imagePaths[slide_index];
  slideshow._frame.css('background', 'transparent url(' + new_background_image + ') no-repeat ' + slideshow.backgroundPosition);

  if (slideshow.doPngTransparency){
    $(slideshow.frameID).supersleight({sizing_method: 'image'});
  }

  var imageTarget = null;
  
  if (slideshow._imageTargets && slideshow._imageTargets[slide_index]){
    imageTarget = slideshow._imageTargets[slide_index];
  } else if (slideshow.defaultTarget){
    imageTarget = slideshow.defaultTarget; 
  }
  
  if (imageTarget){
    slideshow._frame.css('cursor', 'pointer').click(function(){
      window.location = imageTarget;
    });
  }
}

/**
* ----------------------------------------------------------------------
* Formality
* ----------------------------------------------------------------------
*/
clientele.Formality = function(options) {
  this.defaultedTextSelector = 'form input.c-defaulted';
  this.embeddedTextAttribute = 'title';
  this.defaultTextColor      = '#999';
  this.doDefaultText         = true;

  // Replace the defaults with any passed in parameters;
  for (var n in options) { this[n] = arguments[0][n]; }

  if (this.doDefaultText) { this.bindDefaultedTextInputs(); }
}

clientele.Formality.prototype.bindDefaultedTextInputs = function() {
  var t = this;
  $(t.defaultedTextSelector).each(function() {
    var input_element = $(this);
    var default_text = input_element.attr(t.embeddedTextAttribute);

    if (default_text.match(/\S/)){
      var final_text_color = input_element.css('color');

      input_element.val(default_text).css('color', t.defaultTextColor);
      input_element.focus(function() {
        if (input_element.val() == default_text){
          input_element.val("").css('color', final_text_color);
        }
        input_element.unbind('focus');
      });
    } else {
      new clientele.Error('You have specified a default text input field ' +
                          'but not defined the default string of text via the [' + t.embeddedTextAttribute + '] attribute.');
    }
  });
}

/**
* ----------------------------------------------------------------------
* UI
* ----------------------------------------------------------------------
*/
clientele.UI.tabs = function(wrapperID) {
  this.wrapperID          = wrapperID;
  this.selectorPrefix     = 'c-tab';
  this.tabSelector        = '.' + this.selectorPrefix;
  this.tabContentSelector = '.' + this.selectorPrefix + '-content';

  this._tabs = $('#' + this.wrapperID + ' ' + this.tabSelector);
  this._contentBlocks = $('#' + this.wrapperID + ' ' + this.tabContentSelector);

  this.showTab(0);

  var t = this;
  
  var t_index = 0;
  t._tabs.each(function() {
    var tab_number = t_index;
    $(this).click(function() {
      t.showTab(tab_number);
    });
    ++t_index;
  });
}

clientele.UI.tabs.prototype.showTab = function(tab_index) {
  this._tabs.removeClass(this.selectorPrefix + '-on');
  this._contentBlocks.hide();

  $(this._tabs[tab_index]).addClass(this.selectorPrefix + '-on');
  $(this._contentBlocks[tab_index]).show();
}

/* ------------------------------------------------------------
 * supersleight: jQuery plugin for dynamic handling of IE6 png transparency
 * http://allinthehead.com/retro/338/supersleight-jquery-plugin
 * ------------------------------------------------------------ 
 */
jQuery.fn.supersleight = function(settings) {
	settings = jQuery.extend({
		imgs: true,
		backgrounds: true,
    // You should install your own transparent gif rather than trying to rely on an external one.
    shim: 'http://upload.wikimedia.org/wikipedia/commons/c/ce/Transparent.gif',
		apply_positioning: false,
		sizing_method: null
	}, settings);

	return this.each(function(){
		if (jQuery.browser.msie && parseInt(jQuery.browser.version, 10) < 7 && parseInt(jQuery.browser.version, 10) > 4) {
			jQuery(this).find('*').andSelf().each(function(i,obj) {
				var self = jQuery(obj);
				// background pngs
				if (settings.backgrounds && self.css('background-image').match(/\.png/i) !== null) {
					var bg = self.css('background-image');
					var src = bg.substring(5,bg.length-2);
					var mode = (self.css('background-repeat') == 'no-repeat' ? 'crop' : 'scale');
          if (settings.sizing_method){
            mode = settings.sizing_method;
          }
    			var styles = {
            'background' : 'none',
    				'filter': "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod='" + mode + "', src='" + src + "')"
    		  };
					self.css(styles);
				};
				// image elements
				if (settings.imgs && self.is('img[src$=png]')){
					var styles = {
            'background' : 'none',
						'filter': "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=image, src='" + self.attr('src') + "')"
					};
          self.css(styles).attr('src', settings.shim);
				};
				// apply position to 'active' elements
				if (settings.apply_positioning && self.is('a, input') && (self.css('position') === '' || self.css('position') == 'static')){
					self.css('position', 'relative');
				};
			});
		};
	});
};
