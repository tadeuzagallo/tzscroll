#jquery.tzscroll.js

Javascript scrollbar written with [*jQuery*](http://jquery.com/) and [*CoffeeScript*](http://jashkenas.github.com/coffee-script/)

News:
   
The update action now listens to a 'tzchange' event, that may be triggered when update the div content;\n
Support to horizontal and vertical mousewheel;
Options to hide buttons, and set different sizes to bars and buttons, allow or not the scroll to one direction

Usage: $('#myDiv').tzscroll(options);

Ajax update e.g.
   
   var myDiv = $('#myDiv');
   $.ajax({
      url: url,
      success: function(data){
         myDiv.find('.tz-content').html(data); // first change the content
         myDiv.trigger('tzchange'); // after trigger the event to update the scrollbars
      }
   });

Options must be a JSON object, and may have the following properties:

- showButtons: Boolean value, true for show the buttons. Default: true 
- alwaysVisible: Boolean value to don't hide the scrollbar when the mouse goes out of the div or the scroll is not needed. Default: false
- barSize: Bar size in pixels. Default: 9
- buttonSize: Button size in pixels. Default: 9
- barBackground: Bar background css property. Default: #999
- buttonBackground: Button background css property. Default: #999
- buttonRadius: Value for the radius of the button. Default: 50
- barRadius: Value for the radius of the bar. Default: 10
- margin: Value in pixels for the margin between the buttons and the edges. Default: 3
- step: Value in pixels for each click in the scroll button or event from the mouse wheel. Default: 30
- interval: Value in miliseconds that sets the interval to repeat the scroll action when keep the button clicked. Default: 50
- allowVertical: Allow vertical scrolling. Default: true
- allowHorizontal: Allow horizontal scrolling. Default: true

