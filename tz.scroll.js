var Scroll = function(id, options){
	this.x = function(){
		return false;
	}
	
	this.has = function(a, b){
		if(b.length) for(var q = 0; q < b.length; q ++) if(b[q] == a) return true;
		else for(var x in b)if(x == a) return true; return false;
	}
	
	this.updateScrollbar = tz._(function(e){
		if(this.content.offsetHeight > this.contentHolder.offsetHeight && !first){
			tz.set({'style': {'display': 'block'}}, this.scrollVHolder);
			__v = true;
		}
		
		if(this.content.offsetWidth > this.contentHolder.offsetWidth && !first){
			tz.set({'style': {'display': 'block'}}, this.scrollHHolder);
			__h = true;
		}
		
		first = false;
		
		if(__v && __h){
			tz.set({'style': { 'width': this.holder.offsetWidth - (this.options.margin * 2) - this.options.size }}, this.scrollHHolder);
			tz.set({'style': { 'height': this.holder.offsetHeight - (this.options.margin * 2) - this.options.size }}, this.scrollVHolder);
			tz.set({'style': {'height': this.holder.offsetHeight - this.options.size * 3 - this.options.margin * 4}}, this.scrollVArea);
			tz.set({'style': {'width': this.holder.offsetWidth - this.options.size * 3 - this.options.margin * 4}}, this.scrollHArea);
			tz.set({'style': {'width': this.holder.offsetWidth - this.options.size - this.options.margin * 2, 'height': this.holder.offsetHeight - this.options.size - this.options.margin * 2}}, this.contentHolder);
		}else if(__v){
			tz.set({'style': 
				{
					'height': this.holder.offsetHeight - (this.options.margin * 2) - this.options.size
					,'margin-top': this.options.margin
					,'margin-left': this.options.margin
				}}, this.scrollVHolder);
			
			tz.set({'style': {'height': this.holder.offsetHeight - this.options.size * 2 - this.options.margin * 4}}, this.scrollVArea);
			tz.set({'style': {'width': this.holder.offsetWidth - this.options.size - this.options.margin * 2, 'height': this.holder.offsetHeight}}, this.contentHolder);
		}else if(__h){
			tz.set({'style': 
			{
				'width': this.holder.offsetWidth - (this.options.margin * 2)
				,'margin-left': this.options.margin
				,'margin-top': this.options.margin
			}}, this.scrollHHolder);
			
			tz.set({'style': {'width': this.holder.offsetWidth - this.options.size * 2 - this.options.margin * 4}}, this.scrollHArea);		
			tz.set({'style': {'width': this.holder.offsetWidth, 'height': this.holder.offsetHeight - this.options.size - this.options.margin * 2}}, this.contentHolder);
		}
		
		tz.set({'style': {'height': (this.holder.offsetHeight / this.content.offsetHeight * 100) + '%'}}, this.scrollbarV);
		tz.set({'style': {'width': (this.holder.offsetWidth / this.content.offsetWidth * 100) + '%'}}, this.scrollbarH);
		
		this._limitBottom = this.scrollVArea.offsetHeight - this.scrollbarV.offsetHeight;
		this._limitRight = this.scrollHArea.offsetWidth - this.scrollbarH.offsetWidth;
		this._limitLeft = 0;
		this._limitTop = 0;
		
		document.onmousewheel = this.x;
	});
	
	this.onMouseOut = tz._(function(e){
		tz.set({'style': {'display': 'none'}}, this.scrollVHolder, this.scrollHHolder);
		
		document.onmousewheel = undefined;
	});
	
	this.onMouseUp = tz._(function(e){
		this.holder.onmouseout = this.onMouseOut;
		document.onmousemove = undefined;
		document.onselectstart = undefined;
		e.target.ondragstart = undefined;
		document.onmouseup = undefined;
		
		if((e.clientY < this.holder.offsetTop || e.clientY > this.holder.offsetTop + this.holder.offsetHeight) || (e.clientX < this.holder.offsetLeft || e.clientX > this.holder.offsetLeft + this.holder.offsetWidth)){
			this.onMouseOut();
		}
	});
	
	this.onMouseDown = tz._(function(e){
		this._startY = e.clientY;
		this._startX = e.clientX;
		this._offsetY = parseInt(e.target.offsetTop);
		this._offsetX = parseInt(e.target.offsetLeft);
		this._e = e;
		
		document.onmousemove = this.onMouseMove;
		document.onmouseup = this.onMouseUp;
		
		document.onselectstart = this.x;
		e.target.ondragstart = this.x;
		this.holder.onmouseout = undefined;
		this.x();
	});
	
	this.onMouseMove = tz._(function(e){
		if(this._e.target.className.indexOf('vertical') != -1){
			var target = this._offsetY + e.clientY - this._startY;
			target = target > this._limitBottom ? this._limitBottom : (target < this._limitTop ? this._limitTop : target);
			
			var aHeight = this.scrollVArea.offsetHeight - this.scrollbarV.offsetHeight;
			var ap = target/aHeight;
			
			tz.set({'style': {'margin-top': target}}, this._e.target);
			tz.set({'style': {'margin-top': -((this.content.offsetHeight - this.contentHolder.offsetHeight) * ap)}}, this.content);
		}else if(this._e.target.className.indexOf('horizontal') != -1){
			var target = this._offsetX + e.clientX - this._startX;
			target = target > this._limitRight ? this._limitRight : (target < this._limitLeft ? this._limitLeft : target);
			
			var aWidth = this.scrollHArea.offsetWidth - this.scrollbarH.offsetWidth;
			var ap = target/aWidth;
			
			tz.set({'style': {'margin-left': target}}, this._e.target);
			tz.set({'style': {'margin-left': -((this.content.offsetWidth - this.contentHolder.offsetWidth) * ap)}}, this.content);
		}
	});
	
	this.onMouseWheel = tz._(function(e){
		this.go(e);
	});
	
	this.goHorizontal = function(e){
		var direction = e.target.className.indexOf('left') != -1 ? 1 : -1;
		
		var target = (parseInt(this.content.style.marginLeft) || 0) + this.options.step * direction;
		var _target = target < this.contentHolder.offsetWidth - this.content.offsetWidth ? this.contentHolder.offsetWidth - this.content.offsetWidth : (target > 0 ? 0 : target);
		tz.set({'style': {'margin-left': _target}}, this.content);
		
		if(_target == target){
			var t = (this.scrollHArea.offsetWidth - this.scrollbarH.offsetWidth) * (this.content.offsetWidth - this.contentHolder.offsetWidth + (parseInt(this.content.style.marginLeft) || 0)) / (this.content.offsetWidth - this.contentHolder.offsetWidth);
			t = this.scrollHArea.offsetWidth - this.scrollbarH.offsetWidth - t;
			tz.set({'style': {'margin-left': t}}, this.scrollbarH);
		}else{
			tz.set({'style': {'margin-left': _target == 0 ? 0 : (this.scrollHArea.offsetWidth - this.scrollbarH.offsetWidth)}}, this.scrollbarH);
		}
		
		if(_clicking){
			setTimeout(tz.wrap(this, function(){this.goHorizontal(e)}), 50);
		}
	};
	
	this.go = function(e){
		if(e.target.className) if(e.target.className && e.target.className.indexOf('left') != -1 || e.target.className.indexOf('right') != -1){
			return this.goHorizontal(e);
		}
		
		if(!e.wheelDelta){
			if(e instanceof WheelEvent){
				e.wheelDelta = e.detail * -1;
			}else{
				e.wheelDelta = e.target.className.indexOf('tz-scroll-down') != -1 ? -1 : 1;
			}
		}
		
		var target = ((parseInt(this.content.style.marginTop) || 0) + (e.wheelDelta > 0 ? (this.options.step) : (- this.options.step)));
		
		var _target = target < this.contentHolder.offsetHeight - this.content.offsetHeight ? this.contentHolder.offsetHeight - this.content.offsetHeight : (target > 0 ? 0 : target);
		
		tz.set({'style': {'margin-top': _target}}, this.content);
		
		if(_target == target){
			//var t = (this.content.offsetWidth - this.contentHolder.offsetWidth + (parseInt(this.content.style.marginLeft) || 0)) * (this.scrollHArea.offsetWidth - this.scrollbarH.offsetWidth)  / (this.content.offsetWidth - this.contentHolder.offsetWidth);
			var t = (this.content.offsetHeight - this.contentHolder.offsetHeight + (parseInt(this.content.style.marginTop) || 0)) * (this.scrollVArea.offsetHeight - this.scrollbarV.offsetHeight) / (this.content.offsetHeight - this.contentHolder.offsetHeight);
			t = this.scrollVArea.offsetHeight - this.scrollbarV.offsetHeight - t;
			tz.set({'style': {'margin-top': t}}, this.scrollbarV);
		}else{
			tz.set({'style': {'margin-top': _target == 0 ? 0 : (this.scrollVArea.offsetHeight - this.scrollbarV.offsetHeight)}}, this.scrollbarV);
		}
		
		if(!(e instanceof WheelEvent) && _clicking){
			setTimeout(tz.wrap(this, function(){this.go(e)}), 50);
		}
	};
	
	this.scrollClick = tz._(function(e){
		_clicking = true;
		document.onselectstart = this.x;
		e.target.ondragstart = this.x;
		this.holder.onmouseout = undefined;
		document.onmouseup = this.scrollUnclick;
		this.go(e);
		this.x();
	});
	
	this.scrollUnclick = tz._(function(e){
		_clicking = false;
		document.onmousemove = undefined;
		document.onselectstart = undefined;
		e.target.ondragstart = undefined;
		this.holder.onmouseout = this.onMouseOut;
		document.onmouseup = undefined;
	});
	
	var _clicking = false;
	var first = true;
	var _margin = 3;
	var _stack = 0;
	var __v = false;
	var __h = false;
	
	this.holder 		= tz.$(id);
	this._content 		= tz.$(id).innerHTML;
	this.content		= tz.$$('div');
	this.contentHolder  = tz.$$('div');
	this.scrollbarV		= tz.$$('div');
	this.scrollbarH		= tz.$$('div');
	this.scrollVArea 	= tz.$$('div');
	this.scrollHArea 	= tz.$$('div');
	this.scrollVHolder 	= tz.$$('div');
	this.scrollHHolder 	= tz.$$('div');
	this.scrollUp 		= tz.$$('div');
	this.scrollDown 	= tz.$$('div');
	this.scrollLeft		= tz.$$('div');
	this.scrollRight	= tz.$$('div');
	
	this._e;
	this._offsetY;
	this._offsetX;
	this._clientY;
	this._clientX;
	this._limitBottom;
	this._limitTop;	
	this._limitRight;
	this._limitLeft;	
				
	this.options = {
		'showButtons': true
		,'alwaysVisible': false
		,'size': 9
		,'background': '#999'
		,'buttonRadius': 50
		,'barRadius': 10
		,'margin': 3
		,'step': 15
	};
		
	this.setStructure = function(){
		this.content.innerHTML = this._content;
		this.holder.innerHTML = '';
		tz.ac(this.contentHolder, this.content);
		tz.ac(this.holder, this.contentHolder);
		
		(function verticalStructure(){
			tz.ac(this.scrollVArea, this.scrollbarV);
			tz.ac(this.scrollVHolder, this.scrollUp, this.scrollVArea, this.scrollDown);
			tz.ac(this.holder, this.scrollVHolder);
		}).call(this);
		
		(function horizontalStructure(){
			tz.ac(this.scrollHArea, this.scrollbarH);
			tz.ac(this.scrollHHolder, this.scrollLeft, this.scrollHArea, this.scrollRight);
			tz.ac(this.holder, this.scrollHHolder);
		}).call(this);
		
		tz.set({'style': {'float': 'left'}}, this.contentHolder, this.scrollVHolder, this.scrollbarV, this.scrollUp, this.scrollDown, this.scrollVArea, this.scrollLeft, this.scrollRight, this.scrollHArea, this.scrollHHolder);
		
		tz.set({'style': {'width': 'auto', 'height': 'auto', 'float': 'left'}}, this.content);
		tz.set({'style': {'overflow': 'hidden', 'height': '100%', 'width': '100%'}}, this.contentHolder);
		
		tz.set({'style': {'display': 'none'}}, this.scrollVHolder, this.scrollHHolder);
		tz.set({'style': {'width': this.options.size}}, this.scrollVHolder, this.scrollbarV, this.scrollUp, this.scrollDown, this.scrollLeft, this.scrollRight);
		tz.set({'style': {'height': this.options.size}}, this.scrollHHolder, this.scrollbarH, this.scrollUp, this.scrollDown, this.scrollLeft, this.scrollRight);
		tz.set({'style': {'border-radius': this.options.buttonRadius, '-webkit-border-radius': this.options.buttonRadius, '-moz-border-radius': this.options.buttonRadius}}, this.scrollUp, this.scrollDown, this.scrollLeft, this.scrollRight);
		tz.set({'style': {'border-radius': this.options.barRadius, '-webkit-border-radius': this.options.barRadius, '-moz-border-radius': this.options.barRadius}}, this.scrollbarV, this.scrollbarH);
		
		tz.set({'style': {'margin-top': this.options.margin}}, this.scrollVArea, this.scrollDown, this.scrollVHolder);
		tz.set({'style': {'margin-left': this.options.margin}}, this.scrollHArea, this.scrollRight, this.scrollVHolder, this.scrollHHolder);
		
		tz.set({'style': {'background': this.options.background, 'cursor': 'pointer'}}, this.scrollbarV, this.scrollUp, this.scrollDown, this.scrollbarH, this.scrollLeft, this.scrollRight);
		
		
		this.holder.className += ' tz-holder';
		this.content.className += ' tz-content';
		this.contentHolder.className += ' tz-content-holder';
		this.scrollUp.className = 'tz-scroll-up';
		this.scrollDown.className = 'tz-scroll-down';
		this.scrollLeft.className = 'tz-scroll-left';
		this.scrollRight.className = 'tz-scroll-right';
		this.scrollVArea.className = 'tz-vertical-scroll-area';
		this.scrollHArea.className = 'tz-horizontal-scroll-area';
		this.scrollbarV.className = 'tz-vertical-scrollbar';
		this.scrollbarH.className = 'tz-horizontal-scrollbar';
		this.scrollVHolder.className = 'tz-vertical-scroll-holder';
		this.scrollHHolder.className = 'tz-horizontal-scroll-holder';
		
		this.updateScrollbar();
	};
				
	(function start(){
		tz.bind(this, 'updateScrollbar', 'onMouseOut', 'onMouseWheel', 'onMouseMove', 'onMouseUp', 'onMouseDown', 'scrollClick', 'scrollUnclick', 'setOptions');
		tz.extend(this.options, options);
		
		tz.set({'onmouseover': this.updateScrollbar}, this.scrollbarV, this.scrollUp, this.scrollDown, this.scrollVArea, this.scrollVHolder, this.holder, this.scrollHHolder, this.scrollLeft, this.scrollRight, this.scrollbarH);
		tz.set({'onmouseout': this.onMouseOut}, this.holder);
		tz.set({'onmousedown': this.onMouseDown}, this.scrollbarV, this.scrollbarH);
		tz.set({'onmousewheel': this.onMouseWheel}, this.holder);
		tz.set({'onmousedown': this.scrollClick}, this.scrollUp, this.scrollDown, this.scrollLeft, this.scrollRight);
		
		this.setStructure();
	}).apply(this, arguments);
}

window.TZScroll = function(id, options){
	return new Scroll(id, (options || {}));
}
