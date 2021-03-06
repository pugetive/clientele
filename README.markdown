Clientele
---------

Clientele was created to DRY up some of the JS work commonly required when cranking out design-centered websites. 
It's basically just a convenient place to store the code to implement dynamic idioms we use frequently, and to handle the 
edge cases we've run into when doing this stuff across a broad range of sites.

Clientele requires jQuery.

The library currently includes some functionality that finds and binds to elements:

  * [default ON ] Image replacement to replace live text headings with non-websafe typography embedded in images
  * [default OFF] Image placeholders to automatically display a "spinner" image while large images load
  * [default OFF] Automatic IE6 transparency fixing for PNG-24s under specified branch of the DOM
  * [default ON ] Show default text in input fields when specified, hide on focus.

...as well as features that can be instantiated:

  * slideShow to rotate background images within a DIV at a specified interval
  * inline tabbed content to turn tabs and their corresponding content on and off
  * hideawayDictionary to add a dynamic show/hide feature to FAQ pages, etc
  * truncatedLists to allow each line item to be truncated to a specified length and wrapped in show/hide behavior
  
Basics
------

Instantiate the default functionality (currently: image replacement and default text handling) using the Standard class:

    <script src="jquery-1.4.2-min.js" type="text/javascript"></script>
    <script src="clientele.js" type="text/javascript"></script>
    <script type="text/javascript"> 
    new clientele.Standard();
    </script>

    <h1 class="c-swap" title="This Gets Replaced">This Heading will be replaced with /images/heading-this-gets-replaced.png</h1>

    <form action="#">
      <fieldset>
        <label for="stuff">This input field will have text that goes away when the element gets focus.</label>
        <input class="c-defaulted" type="text" title="Type Stuff Here" name="stuff" />
      </fieldset>
    </form>

Image Placeholders
------------------

To add image placeholding to the basic functionality, you have to set the path to your spinner image:

    new clientele.Standard({imagery: {placeholderImage: '/images/spinner.gif'}})


IE6 PNG-24 Transparency Fix
---------------------------

To add IE6 transparency fixing to the basic functionality, simply turn it on.  Best to also specify a DOM selector under which 
to search, otherwise all elements under the body tag will get scanned for PNGs.  (All elements are checked since background images
are also handled by supersleight):

    new clientele.Standard({imagery: {doPngTransparency: true,
                                      pngAncestorSelector: '.elements-containing-pngs'}})

Inline Tabbed Content
---------------------
You can create inline tabbed content simply by using a "c-tab" class for each tab element, and a "c-tab-content" class for each content block. Just specify a wrapping div within which the tabs and content can be found.  This feature *applies no styles* to the content.  The specific design of the tabs and their layout is left completely in the developer's hands. Highlighted tab will have the "c-tab-on" class.

    new clientele.UI.tabs('home-tabs');

Example CSS:

    .c-tab {
      float: left;
      cursor: pointer;
      height: 40px;
      min-height: 40px;
    }
    .c-tab-on { cursor: default; }

    #tab-1 { background: transparent url(/images/tab-1-off.png) no-repeat right bottom; }
    #tab-2 { background: transparent url(/images/tab-2-off.png) no-repeat left bottom; }

    #tab-1.c-tab-on { background-image: url(/images/tab-1-on.png); }
    #tab-2.c-tab-on { background-image: url(/images/tab-2-on.png); }


Hideaway Dictionary
-------------------
Hideaway definition lists display a term but hide the corresponding definition. Clicking the term shows/hides the definition. Useful for dictionaries, FAQ pages, etc. For styling, an "open" class is toggled for the DT/DD tag pair.

    new clientele.UI.hideawayDictionary('.hideaway-list');

Example CSS, including a "plus or minus" sprite image for each term:

    dl.hideaway-list {
      margin-left: 20px;
    }

    dl.hideaway-list dt {
      padding: 10px 0 10px 35px;
      background: transparent url(../images/icon-plus-minus.png) no-repeat 10px 12px;
      cursor: pointer;
    }

    dl.hideaway-list dt.open {
      background-position: 10px -29px;
    }

Truncated List
--------------
Truncated list shortens the contents of each line item's contents to a specified character length and allows the entire contents to be seen after a "read more" or embedded toggle icon are clicked.

    new clientele.UI.truncatedList({parent_selector : 'ul.truncated',
                                    num_characters  : 100, 
                                    read_more_text  : 'Read More',
                                    embed_icon      : true});

Example CSS, using both a read more link and toggle icon:

    ul.truncated a.truncated-icon {
      display: block;
      float: left;
      width: 15px;
      height: 15px;
      background: transparent url(../images/icon-plus-minus.png) no-repeat left top;
      margin: 3px 5px;
    }

    ul.truncated a.truncated-icon.open {
      background-position: left -40px;
    }

    ul.truncated span.truncated-content {
      display: block;
      float: left;
      width: 500px;
    }



Slideshows
----------

Slideshows - background images rotating through a specific element at a specified interval (default 5 seconds), can be achieved by including and styling a div with id #c-slideshow and then instantiating a slideShow with the images (and optional targets for them to link to):

    new clientele.Imagery.slideShow({images: ['rotate-1.png', 'rotate-2.png', 'rotate-3.png', 'rotate-4.png'],
                                     imageTargets: ['/first-page', '/second-page', '/third-page', '/fourth-page']})

By default, each slide will have the PNG transparency fix run on it - note that this can cause issues with image positioning when the images are positioned other than top left.
