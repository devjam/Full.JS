// Generated by CoffeeScript 1.4.0
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.FullJS.Sections.Section3 = (function(_super) {

    __extends(Section3, _super);

    function Section3() {
      this.init = __bind(this.init, this);
      return Section3.__super__.constructor.apply(this, arguments);
    }

    Section3.prototype.init = function() {
      this.container.css({
        overflow: "hidden"
      });
      this.item1 = this.createItem({
        width: 10,
        height: 500,
        backgroundColor: "#FFFFFF",
        position: "absolute",
        top: 0,
        left: 300
      });
      return this.item2 = this.createItem({
        width: 500,
        height: 10,
        backgroundColor: "#FFFFFF",
        position: "absolute",
        top: 700,
        left: 0
      });
    };

    Section3.prototype.update = function(absolute, relative, ratio, width, height) {
      this.container.css({
        opacity: 1 - relative / (this.inVector === 1 ? -this.preOffset : this.postOffset)
      });
      this.item1.css({
        top: relative + 200
      });
      return this.item2.css({
        left: relative * 1.2
      });
    };

    return Section3;

  })(this.FullJS.Sections.Base);

}).call(this);