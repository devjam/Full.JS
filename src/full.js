// Generated by CoffeeScript 1.4.0

/*
Copyright (c) 2012 SHIFTBRAIN Inc.
http://www.shiftbrain.co.jp/
http://memo.devjam.net/

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


(function() {
  var Manager, Util,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  if (this.console == null) {
    this.console = {
      log: function() {}
    };
  }

  if (this.FullJS == null) {
    this.FullJS = {
      LAYOUT_TYPE_NONE: "",
      LAYOUT_TYPE_VERTICAL: "v",
      LAYOUT_TYPE_HORIZONAL: "h",
      LAYOUT_TYPE_FIXED: "f",
      EVENT_FORCE_LOOP_START: "EventForceLoopStart",
      EVENT_FORCE_LOOP_COMPLETE: "EventForceLoopComplete",
      Sections: {},
      Plugins: {},
      Actions: {}
    };
  }

  Util = FullJS.Util = (function() {

    Util.UA = (function() {
      var isIPad3, ua, ver, _ua;
      _ua = navigator.userAgent.toLowerCase();
      ua = {
        isIE: 　false,
        isIE6: false,
        isIE7: false,
        isIE8: false,
        isLtIE9: false,
        isIOS: false,
        isIPhone: false,
        isIPad: false,
        isIPhone4: false,
        isIPad3: false,
        isAndroid: false,
        isAndroidMobile: false,
        isChrome: false,
        isSafari: false,
        isMozilla: false,
        isWebkit: false,
        isOpera: false,
        isPC: false,
        isTablet: false,
        isSmartPhone: false
      };
      if (ua.isIE = /msie (\d+)/.test(_ua)) {
        ver = RegExp.$1;
        ua.isIE6 = ver === 6;
        ua.isIE7 = ver === 7;
        ua.isIE8 = ver === 8;
        ua.isLtIE9 = ver < 9;
      }
      if (ua.isIPhone = /i(phone|pod)/.test(_ua)) {
        ua.isIPhone4 = window.devicePixelRatio === 2;
      }
      if (ua.isIPad = /ipad/.test(_ua)) {
        isIPad3 = window.devicePixelRatio === 2;
      }
      ua.isIOS = ua.isIPhone || ua.isIPad;
      ua.isAndroid = /android/.test(_ua);
      ua.isAndroidMobile = /android(.+)?mobile/.test(_ua);
      ua.isPC = !ua.isIOS && !ua.isAndroid;
      ua.isTablet = ua.isIPad || (ua.isAndroid && ua.isAndroidMobile);
      ua.isSmartPhone = ua.isIPhone || ua.isAndroidMobile;
      ua.isChrome = /chrome/.test(_ua);
      ua.isWebkit = /webkit/.test(_ua);
      ua.isOpera = /opera/.test(_ua);
      ua.isMozilla = _ua.indexOf("compatible") < 0 && /mozilla/.test(_ua);
      ua.isSafari = !ua.isChrome && ua.isWebkit;
      return ua;
    })();

    Util.venderPrefix = (function() {
      if (Util.UA.isIE) {
        return "-ms-";
      }
      if (Util.UA.isWebkit) {
        return "-webkit-";
      }
      if (Util.UA.isMozilla) {
        return "-moz-";
      }
      if (Util.UA.isOpera) {
        return "-o-";
      }
      return "";
    })();

    /*
    	http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    	http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
    
    	requestAnimationFrame polyfill by Erik Möller
    	fixes from Paul Irish and Tino Zijdel
    	fixes form kaminaly
    */


    Util.animationFrameDelta = 0;

    (function() {
      var callbacks, isDateHasNow, lastTime, prefix, setDelta;
      isDateHasNow = !!Date.now;
      lastTime = isDateHasNow ? Date.now() : +(new Date);
      callbacks = [];
      setDelta = function(calledTime) {
        Util.animationFrameDelta = calledTime - lastTime;
        lastTime = calledTime;
        window.requestAnimationFrame(setDelta);
      };
      if (!window.requestAnimationFrame) {
        prefix = Util.venderPrefix.replace(/-/g, "");
        window.requestAnimationFrame = window[prefix + "RequestAnimationFrame"];
        window.cancelAnimationFrame = window[prefix + "CancelAnimationFrame"] || window[prefix + "CancelRequestAnimationFrame"];
      }
      if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = (function() {
          var id;
          id = 0;
          return function(callback, element) {
            if (callbacks.length === 0) {
              id = setTimeout(function() {
                var cb, cbs, now;
                now = isDateHasNow ? Date.now() : +(new Date);
                cbs = callbacks;
                callbacks = [];
                while (cb = cbs.shift()) {
                  cb(now);
                }
              }, 16);
            }
            callbacks.push(callback);
            return id;
          };
        })();
        window.cancelAnimationFrame = function(id) {
          callbacks = [];
          return clearTimeout(id);
        };
      }
      setDelta(isDateHasNow ? Date.now() : +(new Date));
    })();

    Util.window = (function() {
      var doc, heigth, isUpdate, onResize, pageHeight, pageWidth, resizeCallbacks, width, win;
      win = $(window);
      doc = $(document);
      width = 0;
      heigth = 0;
      pageWidth = 0;
      pageHeight = 0;
      resizeCallbacks = [];
      isUpdate = 0;
      onResize = function() {
        var callback, callbacks, _i, _len;
        isUpdate = 3;
        callbacks = resizeCallbacks.concat();
        for (_i = 0, _len = callbacks.length; _i < _len; _i++) {
          callback = callbacks[_i];
          callback();
        }
      };
      win.resize(onResize);
      $(function() {
        width = win.width();
        heigth = win.height();
        pageWidth = doc.width();
        return pageHeight = doc.height();
      });
      return {
        size: function(withUpdate) {
          if (withUpdate == null) {
            withUpdate = false;
          }
          if (withUpdate || isUpdate & 1) {
            isUpdate = (isUpdate | 1) ^ 1;
            width = win.width();
            heigth = win.height();
          }
          return {
            width: width,
            height: heigth
          };
        },
        pageSize: function(withUpdate) {
          if (withUpdate == null) {
            withUpdate = false;
          }
          if (withUpdate || isUpdate & 2) {
            isUpdate = (isUpdate | 2) ^ 2;
            pageWidth = doc.width();
            pageHeight = doc.height();
          }
          return {
            width: pageWidth,
            height: pageHeigth
          };
        },
        isSizeUpdate: function() {
          return isUpdate |= 1;
        },
        isPageSizeUpdate: function() {
          return isUpdate |= 2;
        },
        bindResize: function(callback) {
          if (typeof callback === "function" && $.inArray(callback, resizeCallbacks) === -1) {
            resizeCallbacks.push(callback);
          }
        },
        unbindResize: function(callback, isReset) {
          var index;
          if (isReset == null) {
            isReset = false;
          }
          if (callback && (index = $.inArray(callback, resizeCallbacks)) !== -1) {
            resizeCallbacks.splice(index, 1);
          }
          if (isReset) {
            resizeCallbacks = [];
          }
        }
      };
    })();

    function Util() {
      throw new Error('it is static class');
    }

    return Util;

  })();

  FullJS.Sections.Base = (function() {

    function Base(manager, container, options) {
      var _ref;
      this.manager = manager;
      this.container = container;
      if (options == null) {
        options = {};
      }
      if (typeof this.container === "string") {
        this.container = $(this.container).eq(0);
      }
      if (((_ref = this.container) != null ? _ref.length : void 0) === 0) {
        this.container = $("<div />");
      }
      this.container.css({
        position: "absolute"
      });
      this.name = this.container.attr("id");
      this.anchor = 0;
      this.subAnchors = [];
      this.actions = [];
      this.isAutoMode = true;
      this.layoutType = options.layoutType ? options.layoutType : FullJS.LAYOUT_TYPE_NONE;
      this.autoLengthRatio = 1.0;
      this.length = 1;
      this.autoPreOffsetRatio = 1.0;
      this.autoPostOffsetRatio = 1.0;
      this.preOffset = 0;
      this.postOffset = 0;
      this.isIn = true;
      this.isCurrent = false;
      this.inVector = 1;
      this._init();
    }

    Base.prototype._init = function() {
      var size;
      this.init();
      if (this.isAutoMode) {
        size = Util.window.size();
        switch (this.layoutType) {
          case FullJS.LAYOUT_TYPE_VERTICAL:
            this.length = this.container.height() * this.autoLengthRatio;
            this.preOffset = size.height * this.autoPreOffsetRatio;
            return this.postOffset = size.height * this.autoPostOffsetRatio;
          case FullJS.LAYOUT_TYPE_HORIZONAL:
            this.length = this.container.width() * this.autoLengthRatio;
            this.preOffset = size.width * this.autoPreOffsetRatio;
            return this.postOffset = size.width * this.autoPostOffsetRatio;
        }
      }
    };

    Base.prototype.init = function() {};

    Base.prototype._update = function(position, width, height, vector, isScrollLayout, isResize) {
      var action, ratio, relative, _i, _len, _ref, _results;
      if (isResize) {
        this.onResize(width, height);
      }
      relative = position - this.anchor;
      ratio = relative / this.length;
      if (isScrollLayout) {
        switch (this.layoutType) {
          case FullJS.LAYOUT_TYPE_VERTICAL:
            this.container.css({
              top: -relative
            });
            break;
          case FullJS.LAYOUT_TYPE_HORIZONAL:
            this.container.css({
              left: -relative
            });
        }
      }
      if ((-this.preOffset <= relative && relative <= this.length + this.postOffset)) {
        if (!this.isIn) {
          this.isIn = true;
          this.container.css({
            display: "block"
          });
          this.inVector = vector;
        }
        if ((0 <= relative && relative <= this.length)) {
          if (!this.isCurrent) {
            this.isCurrent = true;
          }
        } else {
          if (this.isCurrent) {
            this.isCurrent = false;
          }
        }
        this.update(position, relative, ratio, width, height, this.inVector);
        _ref = this.actions;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          action = _ref[_i];
          _results.push(action.run(position, relative, ratio, width, height, this.inVector));
        }
        return _results;
      } else {
        if (this.isIn) {
          this.isIn = false;
          this.container.css({
            display: "none"
          });
        }
        if (this.isCurrent) {
          return this.isCurrent = false;
        }
      }
    };

    Base.prototype.update = function(absolute, relative, ratio, width, height, inVector) {};

    Base.prototype.addAction = function(action) {
      if (typeof action.run === "function" && $.inArray(action, this.actions) === -1) {
        this.actions.push(actions);
      }
    };

    Base.prototype.removeAction = function(action, isReset) {
      var index;
      if (isReset == null) {
        isReset = false;
      }
      if (action && (index = $.inArray(action, this.actions)) !== -1) {
        this.actions.splice(index, 1);
      }
      if (isReset) {
        this.actions = [];
      }
    };

    Base.prototype.createItem = function(css, tag, container) {
      if (css == null) {
        css = {};
      }
      if (tag == null) {
        tag = "<div />";
      }
      if (container == null) {
        container = this.container;
      }
      return $(tag).appendTo(container).css(css);
    };

    Base.prototype.onResize = function(width, height) {
      if (this.isAutoMode) {
        switch (this.layoutType) {
          case FullJS.LAYOUT_TYPE_VERTICAL:
            this.container.height(height);
            this.length = height * this.autoLengthRatio;
            this.preOffset = height * this.autoPreOffsetRatio;
            return this.postOffset = height * this.autoPostOffsetRatio;
          case FullJS.LAYOUT_TYPE_HORIZONAL:
            this.container.width(width);
            this.length = width * this.autoLengthRatio;
            this.preOffset = width * this.autoPreOffsetRatio;
            return this.postOffset = width * this.autoPostOffsetRatio;
        }
      }
    };

    return Base;

  })();

  FullJS.Actions.Base = (function() {

    function Base(element, start, end, params) {
      this.element = element;
      this.start = start;
      this.end = end;
      this.params = params;
    }

    Base.prototype.run = function(absolute, relative, ratio, width, height, inVector) {};

    return Base;

  })();

  FullJS.Plugins.Base = (function() {

    function Base() {}

    return Base;

  })();

  Manager = (function() {
    var event;

    event = $("<fulljs />");

    function Manager(container, options) {
      this.container = container;
      this.onResize = __bind(this.onResize, this);

      this.update = __bind(this.update, this);

      this.onWheel = __bind(this.onWheel, this);

      this.addWheelEvent = __bind(this.addWheelEvent, this);

      if (typeof this.container === "string") {
        this.container = $(this.container);
      }
      options = $.extend({
        minWidth: 1000,
        minHeight: 700,
        speed: 0.01,
        useScrollLayout: false
      }, options);
      this.minWidth = options.minWidth;
      this.minHeight = options.minHeight;
      this.speed = options.speed;
      this.useScrollLayout = options.useScrollLayout;
      this.useWheel = false;
      this.isLoopStart = false;
      this.force = 0;
      this.position = 0;
      this.minPosition = 0;
      this.maxPosition = 0;
      this.sections = [];
      this.waitingSections = [];
      Util.window.bindResize(this.onResize);
    }

    Manager.prototype.bind = function(type, callback) {
      return event.bind(type, callback);
    };

    Manager.prototype.unbind = function(type, callback) {
      return event.unbind(type, callback);
    };

    Manager.prototype.addWheelEvent = function() {
      this.useWheel = true;
      if (Util.UA.isIE) {
        $(document).bind("mousewheel", this.onWheel);
      } else {
        $(window).bind("mousewheel", this.onWheel);
      }
    };

    Manager.prototype.removeWheelEvent = function() {
      this.useWheel = false;
      if (Util.UA.isIE) {
        $(document).unbind("mousewheel", this.onWheel);
      } else {
        $(window).unbind("mousewheel", this.onWheel);
      }
    };

    Manager.prototype.onWheel = function(event, delta, deltaX, deltaY) {
      this.force -= delta * 10;
      this.forceLoop();
      return false;
    };

    Manager.prototype.forceLoop = function() {
      if (!this.isLoopStart) {
        this.isLoopStart = true;
        event.trigger(FullJS.EVENT_FORCE_LOOP_START);
      }
      if (!this.ticking) {
        this.ticking = true;
        requestAnimationFrame(this.update);
      }
    };

    Manager.prototype.update = function() {
      var dist, section, size, speed, vector, _i, _len, _ref;
      if ((this.force < 0 ? -this.force : this.force) < 0.05) {
        dist = this.force;
        this.force = 0;
        this.position = ((this.position + dist) * 100 + 0.5 >> 0) / 100;
      } else {
        dist = this.force * ((speed = this.speed * Util.animationFrameDelta) > 0.9 ? 0.9 : speed);
        this.force -= dist;
        this.position += dist;
      }
      if (this.position < this.minPosition) {
        this.position = this.minPosition;
      } else if (this.position > this.maxPosition) {
        this.position = this.maxPosition;
      }
      vector = dist < 0 ? -1 : 1;
      size = Util.window.size();
      _ref = this.sections;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        section = _ref[_i];
        section._update(this.position, size.width, size.height, vector, this.useScrollLayout);
      }
      this.ticking = false;
      if (this.force === 0) {
        this.isLoopStart = false;
        event.trigger(FullJS.EVENT_FORCE_LOOP_COMPLETE);
      } else {
        this.forceLoop();
      }
    };

    Manager.prototype.goto = function(target, speed) {
      var saveSpeed,
        _this = this;
      if (speed == null) {
        speed = this.speed;
      }
      saveSpeed = this.speed;
      this.speed = speed;
      this.bind(FullJS.EVENT_FORCE_LOOP_COMPLETE, function() {
        return _this.speed = saveSpeed;
      });
      if (this.useWheel) {
        this.bind(FullJS.EVENT_FORCE_LOOP_COMPLETE, this.addWheelEvent);
        this.removeWheelEvent();
      }
      this.force = target - this.position;
      return this.forceLoop();
    };

    Manager.prototype.skipTo = function(target) {
      this.force = 0;
      this.position = target;
      return this.update();
    };

    Manager.prototype.gotoSection = function(section, vector) {
      if (vector == null) {
        vector = 1;
      }
      if (!this.isScrollLayout) {
        this._moveToWaitingSection(section, vector);
      }
      return this.goto(section.anchor);
    };

    Manager.prototype.gotoSectionByName = function(name, vector) {
      if (vector == null) {
        vector = 1;
      }
      if (this.isScrollLayout) {
        return this.gotoSection(this.getSectionByName(name), vector);
      } else {
        return this.gotoSection(this.getWaitingSectionByName(name), vector);
      }
    };

    Manager.prototype.skipToSection = function(section) {
      if (!this.isScrollLayout) {
        this._moveToWaitingSection(section);
      }
      return this.skipTo(section.anchor);
    };

    Manager.prototype.skipToSectionByName = function(name) {
      if (this.isScrollLayout) {
        return this.skipToSection(this.getSectionByName(name));
      } else {
        return this.skipToSection(this.getWaitingSectionByName(name));
      }
    };

    Manager.prototype._moveToWaitingSection = function(section, vector) {
      var current,
        _this = this;
      if (vector == null) {
        vector = 1;
      }
      if (this.containsWaitingSection(section)) {
        this.removeWaitingSection(section);
      }
      current = this.getCurrentSection();
      this.addSectionAt(section, vector < 0 ? 0 : this.sections.length);
      this.skipTo(current.anchor);
      return this.bind(FullJS.EVENT_FORCE_LOOP_COMPLETE, function() {
        var index, s;
        _this.unbind(FullJS.EVENT_FORCE_LOOP_COMPLETE, arguments.collee);
        index = _this.sections.length;
        while (index--) {
          s = _this.sections[index];
          if (s.layoutType !== FullJS.LAYOUT_TYPE_FIXED && s.name !== section.name) {
            _this.removeSection(s);
          }
        }
        return _this.skipTo(section.anchor);
      });
    };

    Manager.prototype.createSection = function(container, sectionClass, options, isAddSection) {
      var section;
      if (typeof sectionClass === "string") {
        sectionClass = FullJS.Sections[sectionClass];
      }
      if (sectionClass) {
        section = new sectionClass(this, container, options);
        if (isAddSection) {
          this.addSection(section);
        }
      }
      return section;
    };

    Manager.prototype.addSection = function(section) {
      return this.addSectionAt(section, this.sections.length);
    };

    Manager.prototype.addWaitingSection = function(section) {
      return this.addWaitingSectionAt(section, this.waitingSections.length);
    };

    Manager.prototype.removeSection = function(section) {
      return this.removeSectionAt($.inArray(section, this.sections));
    };

    Manager.prototype.removeWaitingSection = function(section) {
      return this.removeWaitingSectionAt($.inArray(section, this.waitingSections));
    };

    Manager.prototype.addSectionAt = function(section, index) {
      var oldIndex;
      if (index >= 0) {
        oldIndex = $.inArray(section, this.sections);
        if (section && index !== oldIndex) {
          this.sections.splice(index, 0, section);
          if (!(this.removeSectionAt(index < oldIndex ? oldIndex + 1 : oldIndex))) {
            this.updateSections();
          }
          return section;
        }
      }
    };

    Manager.prototype.addWaitingSectionAt = function(section, index) {
      var oldIndex;
      if (index >= 0) {
        oldIndex = $.inArray(section, this.waitingSections);
        if (section && index !== oldIndex) {
          this.waitingSections.splice(index, 0, section);
          this.removeWaitingSectionAt(index < oldIndex ? oldIndex + 1 : oldIndex);
          return section;
        }
      }
    };

    Manager.prototype.removeSectionAt = function(index) {
      var section;
      if ((0 <= index && index < this.sections.length)) {
        section = (this.sections.splice(index, 1))[0];
        if (!this.containsSection(section)) {
          section.container.remove();
          this.addWaitingSection(section);
        }
        this.updateSections();
        return section;
      }
    };

    Manager.prototype.removeWaitingSectionAt = function(index) {
      if ((0 <= index && index < this.waitingSections.length)) {
        return this.waitingSections.splice(index, 1);
      }
    };

    Manager.prototype.containsSection = function(section) {
      return ($.inArray(section, this.sections)) !== -1;
    };

    Manager.prototype.containsWaitingSection = function(section) {
      return ($.inArray(section, this.waitingSections)) !== -1;
    };

    Manager.prototype.getCurrentSection = function() {
      var section, _i, _len, _ref;
      _ref = this.sections;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        section = _ref[_i];
        if (section.layoutType !== FullJS.LAYOUT_TYPE_FIXED && section.isCurrent) {
          return section;
        }
      }
    };

    Manager.prototype.getSectionAt = function(index) {
      return this.sections[index];
    };

    Manager.prototype.getSectionByName = function(name) {
      var section, _i, _len, _ref;
      _ref = this.sections;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        section = _ref[_i];
        if (section.name === name) {
          return section;
        }
      }
    };

    Manager.prototype.getWaitingSectionAt = function(index) {
      return this.waitingSections[index];
    };

    Manager.prototype.getWaitingSectionByName = function(name) {
      var section, _i, _len, _ref;
      _ref = this.waitingSections;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        section = _ref[_i];
        if (section.name === name) {
          return section;
        }
      }
    };

    Manager.prototype.updateSections = function() {
      var anchor, offset, section, size, _i, _len, _ref;
      size = Util.window.size();
      anchor = 0;
      offset = 0;
      _ref = this.sections;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        section = _ref[_i];
        this.container.append(section.container);
        if (this.useScrollLayout) {
          offset = 0;
        } else {
          offset = offset === 0 || offset > section.preOffset ? offset : section.preOffset;
        }
        section.anchor = anchor + offset;
        section._update(this.position, size.width, size.height, 1, this.useScrollLayout, true);
        anchor += section.length;
        offset = section.postOffset;
      }
      return this.maxPosition = anchor;
    };

    Manager.prototype.onResize = function() {
      return this.updateSections();
    };

    return Manager;

  })();

  (function() {
    var createManager, defaultOptions, isLock, managers;
    managers = [];
    isLock = false;
    defaultOptions = {
      container: "body",
      minWidth: 1000,
      minHeight: 700,
      speed: 0.01,
      useWheel: false,
      useScrollLayout: false,
      layoutType: "",
      init: function() {
        $("html").css({
          overflow: "hidden",
          width: "100%",
          height: "100%"
        });
        $('body').css({
          position: "relative",
          width: "100%",
          height: "100%"
        });
        return $(window).bind("scroll", function() {
          return false;
        });
      }
    };
    createManager = function(options) {
      var manager;
      options.init();
      manager = new Manager(options.container, options);
      if (options.useWheel) {
        manager.addWheelEvent();
      }
      return manager;
    };
    $.fn.addToFullJS = function(options, managerId) {
      var manager;
      if (managerId == null) {
        managerId = 0;
      }
      manager = managers[managerId];
      if (!manager) {
        options = $.extend(defaultOptions, options);
        manager = managers[managerId] = createManager(options);
      }
      return this.each(function(index) {
        var container, isAddSection, section, sectionClass;
        isAddSection = false;
        if (index === 0 || options.useScrollLayout) {
          isAddSection = true;
        }
        container = $(this);
        sectionClass = container.attr("id");
        section = manager.createSection(container, sectionClass, options, isAddSection);
        if (!isAddSection) {
          manager.addWaitingSection(section);
        }
      });
    };
    FullJS.getManager = function(options, managerId) {
      if (managerId == null) {
        managerId = 0;
      }
      if (isLock) {
        return null;
      }
      if (!managers[managerId]) {
        options = $.extend(defaultOptions, options);
        managers[managerId] = createManager(options);
      }
      return managers[managerId];
    };
    return FullJS.lock = function() {
      return isLock = true;
    };
  })();

}).call(this);
