CLIENTELE
---------

Clientele was created to DRY up some of the JS work commonly required when cranking design-centered websites. 
Currently offering very few features, the library's intention is to include the dynamic idioms we use 
frequently, and to handle the edge cases we've run into when including them on various sites.

Clientele requires jQuery.

The library currently includes:

  * [default ON ] Image replacement to replace live text headings with non-websafe typography embedded in images
  * [default OFF] Image placeholders to automatically display a "spinner" image while large images load
  * [default OFF] Automatic IE6 transparency fixing for PNG-24s under specified branch of the DOM
  * [default ON ] Show default text in input fields when specified, hide on focus.
  
QUICK START
-----------

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

To add image placeholding to the basic functionality, you have to set the path to your spinner image:

    new clientele.Standard({imagery: {placeHolderImage: '/images/spinner.gif'}})

To add IE6 transparency fixing to the basic functionality, simply turn it on.  Best to also specify a DOM element under which 
to search, otherwise all elements under the body tag will get scanned for PNGs.  (All elements are checked since background images
are also handled by supersleight):

    new clientele.Standard({imagery: {doPngTransparency: true,
                                      pngAncestorSelector: '.elements-containing-pngs'}})
