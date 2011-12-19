jQuery.fn.tzscroll = (options = {}, cbs...)->
		(new _TZScroll x, options, cbs) for x in this

class _TZScroll
	constructor: (@el, options, @cbs = []) ->
		@_clicking = no
		@__v = no
		@__h = no
		@target = null
		@holderMove = yes
		@options = $.extend {}, @options, options

		if @options.barSize isnt @options.buttonSize
			if @options.barSize > @options.buttonSize
				@options.size = @options.barSize
				@options.buttonMargin = (@options.barSize - @options.buttonSize) / 2
				@options.barMargin = 0
			else
				@options.size = @options.buttonSize
				@options.barMargin = (@options.buttonSize - @options.barSize) / 2
				@options.buttonMargin = 0
		else
			@options.size = @options.barSize or @options.buttonSize


		@document = $ document
	
		do @setStructure
		
		$(window).bind 'resize', @updateScrollbar	
		
		@holder.bind('mouseover.holder', @updateScrollbar)
				.bind('tzchange', @updateScrollbar)
				.bind('mouseout.holder', @onMouseOut)
				.bind 'mousewheel.holder', @onMouseWheel
		
		@document.bind 'mousemove.document', @updateScrollbar

		x.bind('dragstart', false).bind('mousedown', @onMouseDown) for x in [@scrollbarH, @scrollbarV]
		
		x.bind('mousedown', @scrollClick).bind('dragstart', false) for x in [@scrollUp, @scrollDown, @scrollLeft, @scrollRight]
	
	updateScrollbar: (e)=>
		@__v = @__h = no
		
		hh = @holder.height()
		ch = @content.height()
		chh = @contentHolder.height()
		
		hw = @holder.width()
		cw = @content.width()
		chw = @contentHolder.width()
		

		_unbind = _hover = e and e.type is 'mouseover'
		
		if e and e.type is 'mousemove'
				_unbind = _hover = @overHolder e
				@document.unbind 'mousemove.document'
				@holderMove = no
		else if e and e.type is 'resize'
			unless @holderMove
				@document.bind 'mousemove.document', @updateScrollbar 
				@holderMove = yes
			_hover = true
		
		if (((_hover or ch isnt @_ch) and ch > chh) or @options.alwaysVisible) and @options.allowVertical
			do @scrollVHolder.show
			@__v = yes
		else 
			do @scrollHHolder.hide
			@__v = no
		
		if (((_hover or cw isnt @_cw) and cw > chw) or @options.alwaysVisible) and @options.allowHorizontal
			do @scrollHHolder.show
			@__h = yes
		else
			do @scrollVHolder.hide
			@__h = no
		
		unless @options.alwaysVisible
			tmp = @options.margin * 2 + @options.size
			_h = ch - chh
			_h = 0 if _h < 0
			_w = cw - chw
			_w = 0 if _w < 0
			_top = - parseInt(@content.css 'marginTop') or 0 
			_left = - parseInt(@content.css 'marginLeft') or 0 
			
			if _top <= 0
				_top = 0
			else if _top >= _h
				_top = _h
			
			if _left <= 0
				_left = 0
			else if _left >= _w
				_left = _w
			
			if _top is _h and @__h
				_top += tmp 
			
			if _left is _w and @__v
				_left += tmp
			
			@content.css 
				marginTop: -_top
				marginLeft: -_left
		
		t1  = hh - (if @__h then (@options.size + @options.margin * 2) else 0)
		t12 = hw - (if @__v then (@options.size + @options.margin * 2) else 0)
		
		t2  = hh - (if @options.showButtons then @options.buttonSize * 2 else 0) - (@options.margin * (if @options.showButtons then 4 else 2)) - (if @__h then (@options.size + @options.margin) else 0)
		t22 = hw - (if @options.showButtons then @options.buttonSize * 2 else 0) - (@options.margin * (if @options.showButtons then 4 else 2)) - (if @__v then (@options.size + @options.margin) else 0)
		
		@scrollVHolder.css 'height', t1 - @options.margin
		@scrollHHolder.css 'width', t12 - @options.margin
		
		@scrollVArea.css 'height', t2
		@scrollHArea.css 'width', t22
		
		chw = if @__v then t12 else hw
		chh = if @__h then t1 else hh
		@contentHolder.css 
			width: chw
			height: chh

		
		@scrollbarV.css 'height', (chh / ch * 100) + '%'
		@scrollbarH.css 'width',(chw / cw * 100) + '%'
		
		if @__v
			@_limitBottom = @scrollVArea.height() - @scrollbarV.height()
			do @setVScrollMargin
		if @__h
			@_limitRight = @scrollHArea.width() - @scrollbarH.width()
			do @setHScrollMargin
		
		@_ch = ch
		@_cw = cw

		if _unbind
			@holder.unbind 'mouseover.holder'
	
	onMouseOut: (e)=>
		$t = $ e.toElement
		if $t.parents('.tz-holder').size() or $t.get(0) is @holder.get(0)
			return false
		
		unless @options.alwaysVisible
			@scrollVHolder.hide()
			@scrollHHolder.hide()
		
			@contentHolder.css
				'height': '100%'
				'width': '100%'
		
			_h = @content.height() - @contentHolder.height()
			_h = 0 if _h < 0
			_w = @content.width() - @contentHolder.width()
			_w = 0 if _w < 0
			_top = - parseInt(@content.css 'marginTop') or 0 
			_left = - parseInt(@content.css 'marginLeft') or 0 
			
			_top = _h if _top > _h
			_left = _w if _left > _w
			
			@content.css
				marginLeft: -_left
				marginTop: -_top
		
		@_hover = no
		@holder.bind 'mouseover.holder', @updateScrollbar
	
	
	overHolder: (e)->
		_p = @holder.offset()
		(e.clientY > _p.top and e.clientY < _p.top + @holder.height()) and (e.clientX > _p.left && e.clientX < _p.left + @holder.width())
	
	onMouseUp: (e)=>
		@holder.bind 'mouseout.holder', @onMouseOut
		@document.unbind('mousemove').unbind('mouseup').unbind 'selectstart'
		
		unless @overHolder e
			@onMouseOut e
	
	onMouseDown: (e)=>
		@_e = e
		@_e.target = $ @_e.target
		@_startY = @_e.clientY
		@_startX = @_e.clientX
		@_offsetY = parseInt(@_e.target.css 'marginTop') || 0
		@_offsetX = parseInt(@_e.target.css 'marginLeft') || 0
		
		@document.bind('mousemove.document', @onMouseMove).bind('mouseup.document', @onMouseUp).bind 'selectstart.document', false
		@holder.unbind 'mouseout.holder'
	
	onMouseMove: (e)=>
		if @_e.target.hasClass('tz-vertical-scrollbar')
			target = @_offsetY + e.clientY - @_startY
			target = if target > @_limitBottom then @_limitBottom else (if target < @_limitTop then @_limitTop else target)
			aHeight = @scrollVArea.height() - @scrollbarV.height()
			ap = target/aHeight;
			
			@_e.target.css 'marginTop', target
			@content.css 'marginTop', -((@content.height() - @contentHolder.height()) * ap)
		else if @_e.target.hasClass('tz-horizontal-scrollbar')
			target = @_offsetX + e.clientX - @_startX
			
			target = if target < @_limitLeft then @_limitLeft else if target > @_limitRight then @_limitRight else target
			
			aWidth = @scrollHArea.width() - @scrollbarH.width()
			ap = target/aWidth
			
			@_e.target.css 'marginLeft', target
			@content.css 'marginLeft', -((@content.width() - @contentHolder.width()) * ap)
	
	onMouseWheel: (e)=>
		@target = $ e.target
		
		if @target.hasClass('tz-scroll-left') or @target.hasClass('tz-scroll-right') or e.originalEvent.wheelDeltaX
			@goHorizontal e
		else 
			@go e
	
	goHorizontal: (e)->
		unless @__h
			return
		
		@target = $ e.target
		t = @contentHolder.width() - @content.width()
		
		if e.originalEvent.wheelDeltaX
			direction = if e.originalEvent.wheelDeltaX > 0 then 1 else -1
		else
			direction =  if @target.hasClass 'tz-scroll-left' then 1 else -1
		
		target = (parseInt(@content.css 'marginLeft') || 0) + @options.step * direction;
		
		_target = if target < t then t else (if target > 0 then 0 else target);
		
		if target is _target
			do e.preventDefault
		
		@content.css 'marginLeft', _target
		
		do @setHScrollMargin
		
		if e.type is 'mousedown'
			setTimeout =>
					@goHorizontal(e) if @_clicking
				,@options.interval
	
	go: (e)->
		unless @__v
			return
		
		if e.type is 'mousedown'
			e.wheelDelta = if @target.hasClass('tz-scroll-down') then -1 else 1
		else
			e.wheelDelta or= e.originalEvent.wheelDelta
			
		target = (parseInt(@content.css 'marginTop') || 0) + (if e.wheelDelta > 0 then @options.step else -@options.step)
		
		t = @contentHolder.height() - @content.height()
		_target = if target < t then t else (if target > 0 then 0 else target)
		
		if target is _target
			do e.preventDefault
		
		@content.css 'marginTop',  _target
		
		do @setVScrollMargin
		
		if e.type is 'mousedown'
			setTimeout =>
					@go(e) if @_clicking
				,@options.interval
	
	setHScrollMargin: ->
		w = @scrollHArea.width() - @scrollbarH.width()
		w1 = @content.width() - @contentHolder.width()
		
		t = (w1 + (parseInt(@content.css 'marginLeft') || 0)) * w / w1
		t = w - t;
		t = if t < @_limitLeft then @_limitLeft else (if t > @_limitRight then @_limitRight else t)
		
		@scrollbarH.css 'marginLeft', t
	
	setVScrollMargin: ->
		h = @content.height() - @contentHolder.height()
		h1 = @scrollVArea.height() - @scrollbarV.height()
		
		t = (h + (parseInt(@content.css 'marginTop') || 0)) * h1 / h;
		t = h1 - t
		t = if t < @_limitTop then @_limitTop else ( if t > @_limitBottom then @_limitBottom else t)
		
		@scrollbarV.css 'marginTop', t
	
	scrollClick: (e)=>
		@_clicking = yes
		
		@document.bind('selectstart', false).bind 'mouseup', @scrollUnclick
		@holder.unbind 'mouseout.holder'
		
		@onMouseWheel(e)
	
	scrollUnclick: (e)=>
		@_clicking = no
		
		@document.unbind('selectstart').unbind 'mouseup'
		@holder.bind 'mouseout.holder', @onMouseOut
	
	options: 
		showButtons: true
		alwaysVisible: false
		barSize: 9
		buttonSize: 9
		barBackground: '#999'
		buttonBackground: '#999'
		buttonRadius: 50
		barRadius: 10
		margin: 3
		step: 30
		interval: 50
		allowVertical: true
		allowHorizontal: true
		
	setStructure: (el)->
		@holder 		= $(@el).addClass 'tz-holder'
		@contentHolder  = $('<div>').addClass 'tz-content-holder'
		@content		= $('<div>').html(do @holder.html).addClass('tz-content').appendTo @contentHolder
		
		@contentHolder.appendTo do @holder.empty
		
		@scrollVHolder 	= $('<div>').hide().addClass('tz-vertical-scroll-holder').appendTo @holder
		@scrollUp 		= $('<div>').addClass('tz-scroll-up').appendTo @scrollVHolder
		@scrollVArea 	= $('<div>').addClass('tz-vertical-scroll-area').appendTo @scrollVHolder
		@scrollbarV		= $('<div>').addClass('tz-vertical-scrollbar').appendTo @scrollVArea
		@scrollDown 	= $('<div>').addClass('tz-scroll-down').appendTo @scrollVHolder
		
		@scrollHHolder 	= $('<div>').hide().addClass('tz-horizontal-scroll-holder').appendTo @holder
		@scrollLeft		= $('<div>').addClass('tz-scroll-left').appendTo @scrollHHolder
		@scrollHArea 	= $('<div>').addClass('tz-horizontal-scroll-area').appendTo @scrollHHolder
		@scrollbarH		= $('<div>').addClass('tz-horizontal-scrollbar').appendTo @scrollHArea
		@scrollRight	= $('<div>').addClass('tz-scroll-right').appendTo @scrollHHolder
	
		@_limitTop = @_limitLeft = 0
		
		@contentHolder.css
			overflow: 'hidden'
			height: '100%'
			width: '100%'
		
		@holder.find('div').css 'float', 'left'
		
		basic = 
			borderRadius: @options.buttonRadius
			background: @options.barBackground
			cursor: 'pointer'

		@scrollVHolder.css
			width: @options.barSize
			marginLeft: @options.margin
			marginTop: @options.margin
			
		@scrollHHolder.css
			height: @options.barSize
			marginTop: @options.margin
			marginLeft: @options.margin
			
		@scrollbarV.css $.extend width: @options.barSize, marginLeft: @options.barMargin, basic
		
		@scrollbarH.css $.extend height: @options.barSize, marginTop: @options.barMargin, basic
		
		buttons = $.extend basic,
			width: @options.buttonSize
			height: @options.buttonSize
			background: @options.buttonBackground
		
		unless @options.showButtons
			$.extend buttons, display: 'none'

		@scrollUp.css $.extend marginLeft: @options.buttonMargin, buttons
		@scrollLeft.css $.extend marginTop: @options.buttonMargin, buttons
		@scrollDown.css $.extend marginLeft: @options.buttonMargin, marginTop: @options.margin, buttons
		@scrollRight.css $.extend marginTop: @options.buttonMargin, marginLeft: @options.margin, buttons
			
		@scrollVArea.css 'marginTop', @options.margin
		@scrollHArea.css 'marginLeft', @options.margin
		
		@scrollVArea.css
			'marginTop': @options.margin
		
		@scrollHArea.css
			'marginLeft': @options.margin
			
		
		do @updateScrollbar
		(do a if @isFunction a) for a in @cbs