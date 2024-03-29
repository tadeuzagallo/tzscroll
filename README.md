#_jquery.tzscroll.js_

Javascript scrollbar written with [*jQuery*](http://jquery.com/) and [*CoffeeScript*](http://jashkenas.github.com/coffee-script/)

##_New features_:
   
- The update action now listens to a 'tzchange' event, that may be triggered when update the div content;\n
- Support to horizontal and vertical mousewheel;
- Options to hide buttons, and set different sizes to bars and buttons, allow or not the scroll to one direction

##_Usage_:

_Basic usage_: 

    $('#myDiv').tzscroll(options); // Options must be a JSON object, and may have the properties listed bellow.

_Ajax update e.g._

    var myDiv = $('#myDiv');
    $.ajax({
        url: url,
        success: function(data){
            myDiv.find('.tz-content').html(data); // first change the content
            myDiv.trigger('tzchange'); // after trigger the event to update the scrollbars
        }
    });

##_Options_:

- __showButtons__: Boolean value, true for show the buttons. _Default: true_
- __alwaysVisible__: Boolean value to don't hide the scrollbar when the mouse goes out of the div or the scroll is not needed. _Default: false_
- __barSize__: Bar size in pixels. _Default: 9_
- __buttonSize__: Button size in pixels. _Default: 9_
- __barBackground__: Bar background css property. _Default: #999_
- __buttonBackground__: Button background css property. _Default: #999_
- __buttonRadius__: Value for the radius of the button. _Default: 50_
- __barRadius__: Value for the radius of the bar. _Default: 10_
- __margin__: Value in pixels for the margin between the buttons and the edges. _Default: 3_
- __step__: Value in pixels for each click in the scroll button or event from the mouse wheel. _Default: 30_
- __interval__: Value in miliseconds that sets the interval to repeat the scroll action when keep the button clicked. _Default: 50_
- __allowVertical__: Allow vertical scrolling. _Default: true_
- __allowHorizontal__: Allow horizontal scrolling. _Default: true_

