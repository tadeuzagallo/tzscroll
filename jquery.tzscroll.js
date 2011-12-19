(function() {
  var _TZScroll;
  var __slice = Array.prototype.slice, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  jQuery.fn.tzscroll = function() {
    var cbs, options, x, _i, _len, _results;
    options = arguments[0], cbs = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if (options == null) options = {};
    _results = [];
    for (_i = 0, _len = this.length; _i < _len; _i++) {
      x = this[_i];
      _results.push(new _TZScroll(x, options, cbs));
    }
    return _results;
  };

  _TZScroll = (function() {

    function _TZScroll(el, options, cbs) {
      var x, _i, _j, _len, _len2, _ref, _ref2;
      this.el = el;
      this.cbs = cbs != null ? cbs : [];
      this.scrollUnclick = __bind(this.scrollUnclick, this);
      this.scrollClick = __bind(this.scrollClick, this);
      this.onMouseWheel = __bind(this.onMouseWheel, this);
      this.onMouseMove = __bind(this.onMouseMove, this);
      this.onMouseDown = __bind(this.onMouseDown, this);
      this.onMouseUp = __bind(this.onMouseUp, this);
      this.onMouseOut = __bind(this.onMouseOut, this);
      this.updateScrollbar = __bind(this.updateScrollbar, this);
      this._clicking = false;
      this.__v = false;
      this.__h = false;
      this.target = null;
      this.holderMove = true;
      this.options = $.extend({}, this.options, options);
      if (this.options.barSize !== this.options.buttonSize) {
        if (this.options.barSize > this.options.buttonSize) {
          this.options.size = this.options.barSize;
          this.options.buttonMargin = (this.options.barSize - this.options.buttonSize) / 2;
          this.options.barMargin = 0;
        } else {
          this.options.size = this.options.buttonSize;
          this.options.barMargin = (this.options.buttonSize - this.options.barSize) / 2;
          this.options.buttonMargin = 0;
        }
      } else {
        this.options.size = this.options.barSize || this.options.buttonSize;
      }
      this.document = $(document);
      this.setStructure();
      $(window).bind('resize', this.updateScrollbar);
      this.holder.bind('mouseover.holder', this.updateScrollbar).bind('tzchange', this.updateScrollbar).bind('mouseout.holder', this.onMouseOut).bind('mousewheel.holder', this.onMouseWheel);
      this.document.bind('mousemove.document', this.updateScrollbar);
      _ref = [this.scrollbarH, this.scrollbarV];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        x = _ref[_i];
        x.bind('dragstart', false).bind('mousedown', this.onMouseDown);
      }
      _ref2 = [this.scrollUp, this.scrollDown, this.scrollLeft, this.scrollRight];
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        x = _ref2[_j];
        x.bind('mousedown', this.scrollClick).bind('dragstart', false);
      }
    }

    _TZScroll.prototype.updateScrollbar = function(e) {
      var ch, chh, chw, cw, hh, hw, t1, t12, t2, t22, tmp, _h, _hover, _left, _top, _unbind, _w;
      console.log('here', e ? e.type : e);
      this.__v = this.__h = false;
      hh = this.holder.height();
      ch = this.content.height();
      chh = this.contentHolder.height();
      hw = this.holder.width();
      cw = this.content.width();
      chw = this.contentHolder.width();
      _unbind = _hover = e && e.type === 'mouseover';
      if (e && e.type === 'mousemove') {
        _unbind = _hover = this.overHolder(e);
        this.document.unbind('mousemove.document');
        this.holderMove = false;
      } else if (e && e.type === 'resize') {
        if (!this.holderMove) {
          this.document.bind('mousemove.document', this.updateScrollbar);
          this.holderMove = true;
        }
        _hover = true;
      }
      if ((((_hover || ch !== this._ch) && ch > chh) || this.options.alwaysVisible) && this.options.allowVertical) {
        this.scrollVHolder.show();
        this.__v = true;
      } else {
        this.scrollHHolder.hide();
        this.__v = false;
      }
      if ((((_hover || cw !== this._cw) && cw > chw) || this.options.alwaysVisible) && this.options.allowHorizontal) {
        this.scrollHHolder.show();
        this.__h = true;
      } else {
        this.scrollVHolder.hide();
        this.__h = false;
      }
      if (!this.options.alwaysVisible) {
        tmp = this.options.margin * 2 + this.options.size;
        _h = ch - chh;
        if (_h < 0) _h = 0;
        _w = cw - chw;
        if (_w < 0) _w = 0;
        _top = -parseInt(this.content.css('marginTop')) || 0;
        _left = -parseInt(this.content.css('marginLeft')) || 0;
        if (_top <= 0) {
          _top = 0;
        } else if (_top >= _h) {
          _top = _h;
        }
        if (_left <= 0) {
          _left = 0;
        } else if (_left >= _w) {
          _left = _w;
        }
        if (_top === _h && this.__h) _top += tmp;
        if (_left === _w && this.__v) _left += tmp;
        this.content.css({
          marginTop: -_top,
          marginLeft: -_left
        });
      }
      t1 = hh - (this.__h ? this.options.size + this.options.margin * 2 : 0);
      t12 = hw - (this.__v ? this.options.size + this.options.margin * 2 : 0);
      t2 = hh - (this.options.showButtons ? this.options.buttonSize * 2 : 0) - (this.options.margin * (this.options.showButtons ? 4 : 2)) - (this.__h ? this.options.size + this.options.margin : 0);
      t22 = hw - (this.options.showButtons ? this.options.buttonSize * 2 : 0) - (this.options.margin * (this.options.showButtons ? 4 : 2)) - (this.__v ? this.options.size + this.options.margin : 0);
      this.scrollVHolder.css('height', t1 - this.options.margin);
      this.scrollHHolder.css('width', t12 - this.options.margin);
      this.scrollVArea.css('height', t2);
      this.scrollHArea.css('width', t22);
      chw = this.__v ? t12 : hw;
      chh = this.__h ? t1 : hh;
      this.contentHolder.css({
        width: chw,
        height: chh
      });
      this.scrollbarV.css('height', (chh / ch * 100) + '%');
      this.scrollbarH.css('width', (chw / cw * 100) + '%');
      if (this.__v) {
        this._limitBottom = this.scrollVArea.height() - this.scrollbarV.height();
        this.setVScrollMargin();
      }
      if (this.__h) {
        this._limitRight = this.scrollHArea.width() - this.scrollbarH.width();
        this.setHScrollMargin();
      }
      this._ch = ch;
      this._cw = cw;
      if (_unbind) return this.holder.unbind('mouseover.holder');
    };

    _TZScroll.prototype.onMouseOut = function(e) {
      var $t, _h, _left, _top, _w;
      $t = $(e.toElement);
      if ($t.parents('.tz-holder').size() || $t.get(0) === this.holder.get(0)) {
        return false;
      }
      if (!this.options.alwaysVisible) {
        this.scrollVHolder.hide();
        this.scrollHHolder.hide();
        this.contentHolder.css({
          'height': '100%',
          'width': '100%'
        });
        _h = this.content.height() - this.contentHolder.height();
        if (_h < 0) _h = 0;
        _w = this.content.width() - this.contentHolder.width();
        if (_w < 0) _w = 0;
        _top = -parseInt(this.content.css('marginTop')) || 0;
        _left = -parseInt(this.content.css('marginLeft')) || 0;
        if (_top > _h) _top = _h;
        if (_left > _w) _left = _w;
        this.content.css({
          marginLeft: -_left,
          marginTop: -_top
        });
      }
      this._hover = false;
      return this.holder.bind('mouseover.holder', this.updateScrollbar);
    };

    _TZScroll.prototype.overHolder = function(e) {
      var _p;
      _p = this.holder.offset();
      return (e.clientY > _p.top && e.clientY < _p.top + this.holder.height()) && (e.clientX > _p.left && e.clientX < _p.left + this.holder.width());
    };

    _TZScroll.prototype.onMouseUp = function(e) {
      this.holder.bind('mouseout.holder', this.onMouseOut);
      this.document.unbind('mousemove').unbind('mouseup').unbind('selectstart');
      if (!this.overHolder(e)) return this.onMouseOut(e);
    };

    _TZScroll.prototype.onMouseDown = function(e) {
      this._e = e;
      this._e.target = $(this._e.target);
      this._startY = this._e.clientY;
      this._startX = this._e.clientX;
      this._offsetY = parseInt(this._e.target.css('marginTop')) || 0;
      this._offsetX = parseInt(this._e.target.css('marginLeft')) || 0;
      this.document.bind('mousemove.document', this.onMouseMove).bind('mouseup.document', this.onMouseUp).bind('selectstart.document', false);
      return this.holder.unbind('mouseout.holder');
    };

    _TZScroll.prototype.onMouseMove = function(e) {
      var aHeight, aWidth, ap, target;
      if (this._e.target.hasClass('tz-vertical-scrollbar')) {
        target = this._offsetY + e.clientY - this._startY;
        target = target > this._limitBottom ? this._limitBottom : (target < this._limitTop ? this._limitTop : target);
        aHeight = this.scrollVArea.height() - this.scrollbarV.height();
        ap = target / aHeight;
        this._e.target.css('marginTop', target);
        return this.content.css('marginTop', -((this.content.height() - this.contentHolder.height()) * ap));
      } else if (this._e.target.hasClass('tz-horizontal-scrollbar')) {
        target = this._offsetX + e.clientX - this._startX;
        target = target < this._limitLeft ? this._limitLeft : target > this._limitRight ? this._limitRight : target;
        aWidth = this.scrollHArea.width() - this.scrollbarH.width();
        ap = target / aWidth;
        this._e.target.css('marginLeft', target);
        return this.content.css('marginLeft', -((this.content.width() - this.contentHolder.width()) * ap));
      }
    };

    _TZScroll.prototype.onMouseWheel = function(e) {
      this.target = $(e.target);
      if (this.target.hasClass('tz-scroll-left') || this.target.hasClass('tz-scroll-right') || e.originalEvent.wheelDeltaX) {
        return this.goHorizontal(e);
      } else {
        return this.go(e);
      }
    };

    _TZScroll.prototype.goHorizontal = function(e) {
      var direction, t, target, _target;
      var _this = this;
      if (!this.__h) return;
      this.target = $(e.target);
      t = this.contentHolder.width() - this.content.width();
      if (e.originalEvent.wheelDeltaX) {
        direction = e.originalEvent.wheelDeltaX > 0 ? 1 : -1;
      } else {
        direction = this.target.hasClass('tz-scroll-left') ? 1 : -1;
      }
      target = (parseInt(this.content.css('marginLeft')) || 0) + this.options.step * direction;
      _target = target < t ? t : (target > 0 ? 0 : target);
      if (target === _target) e.preventDefault();
      this.content.css('marginLeft', _target);
      this.setHScrollMargin();
      if (e.type === 'mousedown') {
        return setTimeout(function() {
          if (_this._clicking) return _this.goHorizontal(e);
        }, this.options.interval);
      }
    };

    _TZScroll.prototype.go = function(e) {
      var t, target, _target;
      var _this = this;
      if (!this.__v) return;
      if (e.type === 'mousedown') {
        e.wheelDelta = this.target.hasClass('tz-scroll-down') ? -1 : 1;
      } else {
        e.wheelDelta || (e.wheelDelta = e.originalEvent.wheelDelta);
      }
      target = (parseInt(this.content.css('marginTop')) || 0) + (e.wheelDelta > 0 ? this.options.step : -this.options.step);
      t = this.contentHolder.height() - this.content.height();
      _target = target < t ? t : (target > 0 ? 0 : target);
      if (target === _target) e.preventDefault();
      this.content.css('marginTop', _target);
      this.setVScrollMargin();
      if (e.type === 'mousedown') {
        return setTimeout(function() {
          if (_this._clicking) return _this.go(e);
        }, this.options.interval);
      }
    };

    _TZScroll.prototype.setHScrollMargin = function() {
      var t, w, w1;
      w = this.scrollHArea.width() - this.scrollbarH.width();
      w1 = this.content.width() - this.contentHolder.width();
      t = (w1 + (parseInt(this.content.css('marginLeft')) || 0)) * w / w1;
      t = w - t;
      t = t < this._limitLeft ? this._limitLeft : (t > this._limitRight ? this._limitRight : t);
      return this.scrollbarH.css('marginLeft', t);
    };

    _TZScroll.prototype.setVScrollMargin = function() {
      var h, h1, t;
      h = this.content.height() - this.contentHolder.height();
      h1 = this.scrollVArea.height() - this.scrollbarV.height();
      t = (h + (parseInt(this.content.css('marginTop')) || 0)) * h1 / h;
      t = h1 - t;
      t = t < this._limitTop ? this._limitTop : (t > this._limitBottom ? this._limitBottom : t);
      return this.scrollbarV.css('marginTop', t);
    };

    _TZScroll.prototype.scrollClick = function(e) {
      this._clicking = true;
      this.document.bind('selectstart', false).bind('mouseup', this.scrollUnclick);
      this.holder.unbind('mouseout.holder');
      return this.onMouseWheel(e);
    };

    _TZScroll.prototype.scrollUnclick = function(e) {
      this._clicking = false;
      this.document.unbind('selectstart').unbind('mouseup');
      return this.holder.bind('mouseout.holder', this.onMouseOut);
    };

    _TZScroll.prototype.options = {
      showButtons: true,
      alwaysVisible: false,
      barSize: 9,
      buttonSize: 9,
      barBackground: '#999',
      buttonBackground: '#999',
      buttonRadius: 50,
      barRadius: 10,
      margin: 3,
      step: 30,
      interval: 50,
      allowVertical: true,
      allowHorizontal: true
    };

    _TZScroll.prototype.setStructure = function(el) {
      var a, basic, buttons, _i, _len, _ref, _results;
      this.holder = $(this.el).addClass('tz-holder');
      this.contentHolder = $('<div>').addClass('tz-content-holder');
      this.content = $('<div>').html(this.holder.html()).addClass('tz-content').appendTo(this.contentHolder);
      this.contentHolder.appendTo(this.holder.empty());
      this.scrollVHolder = $('<div>').hide().addClass('tz-vertical-scroll-holder').appendTo(this.holder);
      this.scrollUp = $('<div>').addClass('tz-scroll-up').appendTo(this.scrollVHolder);
      this.scrollVArea = $('<div>').addClass('tz-vertical-scroll-area').appendTo(this.scrollVHolder);
      this.scrollbarV = $('<div>').addClass('tz-vertical-scrollbar').appendTo(this.scrollVArea);
      this.scrollDown = $('<div>').addClass('tz-scroll-down').appendTo(this.scrollVHolder);
      this.scrollHHolder = $('<div>').hide().addClass('tz-horizontal-scroll-holder').appendTo(this.holder);
      this.scrollLeft = $('<div>').addClass('tz-scroll-left').appendTo(this.scrollHHolder);
      this.scrollHArea = $('<div>').addClass('tz-horizontal-scroll-area').appendTo(this.scrollHHolder);
      this.scrollbarH = $('<div>').addClass('tz-horizontal-scrollbar').appendTo(this.scrollHArea);
      this.scrollRight = $('<div>').addClass('tz-scroll-right').appendTo(this.scrollHHolder);
      this._limitTop = this._limitLeft = 0;
      this.contentHolder.css({
        overflow: 'hidden',
        height: '100%',
        width: '100%'
      });
      this.holder.find('div').css('float', 'left');
      basic = {
        borderRadius: this.options.buttonRadius,
        background: this.options.barBackground,
        cursor: 'pointer'
      };
      this.scrollVHolder.css({
        width: this.options.barSize,
        marginLeft: this.options.margin,
        marginTop: this.options.margin
      });
      this.scrollHHolder.css({
        height: this.options.barSize,
        marginTop: this.options.margin,
        marginLeft: this.options.margin
      });
      this.scrollbarV.css($.extend({
        width: this.options.barSize,
        marginLeft: this.options.barMargin
      }, basic));
      this.scrollbarH.css($.extend({
        height: this.options.barSize,
        marginTop: this.options.barMargin
      }, basic));
      buttons = $.extend(basic, {
        width: this.options.buttonSize,
        height: this.options.buttonSize,
        background: this.options.buttonBackground
      });
      if (!this.options.showButtons) {
        $.extend(buttons, {
          display: 'none'
        });
      }
      this.scrollUp.css($.extend({
        marginLeft: this.options.buttonMargin
      }, buttons));
      this.scrollLeft.css($.extend({
        marginTop: this.options.buttonMargin
      }, buttons));
      this.scrollDown.css($.extend({
        marginLeft: this.options.buttonMargin,
        marginTop: this.options.margin
      }, buttons));
      this.scrollRight.css($.extend({
        marginTop: this.options.buttonMargin,
        marginLeft: this.options.margin
      }, buttons));
      this.scrollVArea.css('marginTop', this.options.margin);
      this.scrollHArea.css('marginLeft', this.options.margin);
      this.scrollVArea.css({
        'marginTop': this.options.margin
      });
      this.scrollHArea.css({
        'marginLeft': this.options.margin
      });
      this.updateScrollbar();
      _ref = this.cbs;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        a = _ref[_i];
        _results.push(this.isFunction(a) ? a() : void 0);
      }
      return _results;
    };

    return _TZScroll;

  })();

}).call(this);
