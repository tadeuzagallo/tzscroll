#_jquery.tzscroll.js_

Javascript scrollbar written with [*jQuery*](http://jquery.com/) and [*CoffeeScript*](http://jashkenas.github.com/coffee-script/)

##_New features_:
   
- The update action now listens to a 'tzchange' event, that may be triggered when update the div content;\n
- Support to horizontal and vertical mousewheel;
- Options to hide buttons, and set different sizes to bars and buttons, allow or not the scroll to one direction

##_Usage_:

_Basic usage_: 

	`$('#myDiv').tzscroll(options); // Options must be a JSON object, and may have the properties listed bellow.`

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

- _showButtons_: Boolean value, true for show the buttons. Default: true 
- _alwaysVisible_: Boolean value to don't hide the scrollbar when the mouse goes out of the div or the scroll is not needed. Default: false
- _barSize_: Bar size in pixels. Default: 9
- _buttonSize_: Button size in pixels. Default: 9
- _barBackground_: Bar background css property. Default: #999
- _buttonBackground_: Button background css property. Default: #999
- _buttonRadius_: Value for the radius of the button. Default: 50
- _barRadius_: Value for the radius of the bar. Default: 10
- _margin_: Value in pixels for the margin between the buttons and the edges. Default: 3
- _step_: Value in pixels for each click in the scroll button or event from the mouse wheel. Default: 30
- _interval_: Value in miliseconds that sets the interval to repeat the scroll action when keep the button clicked. Default: 50
- _allowVertical_: Allow vertical scrolling. Default: true
- _allowHorizontal_: Allow horizontal scrolling. Default: true

