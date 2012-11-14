// Generated by CoffeeScript 1.4.0
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.FullJS.Sections.Section1 = (function(_super) {

    __extends(Section1, _super);

    function Section1() {
      this.update = __bind(this.update, this);

      this.init = __bind(this.init, this);
      return Section1.__super__.constructor.apply(this, arguments);
    }

    Section1.prototype.init = function() {
      var size;
      this.container.css({
        overflow: "hidden"
      });
      size = FullJS.Util.window.size();
      this.item1 = this.createItem({
        width: 100,
        height: 100,
        backgroundColor: "#FFFFFF",
        position: "absolute",
        top: 0,
        left: size.width * 0.5
      });
      return this.item2 = this.createItem({
        width: 200,
        height: 100,
        backgroundColor: "#FFFFFF",
        position: "absolute",
        top: size.height * 0.5,
        left: 0
      });
    };

    Section1.prototype.update = function(absolute, relative, ratio, width, height) {
      var anchor;
      this.item1.css({
        top: relative * 0.4 + 200
      });
      this.item2.css({
        left: relative * 1.2
      });
      if (absolute === 0 && this.manager.getSectionAt(3)) {
        anchor = this.manager.getSectionAt(3).anchor;
        if (anchor !== 0) {
          return this.manager.skipTo(anchor);
        }
      }
    };

    return Section1;

  })(this.FullJS.Sections.Base);

}).call(this);
