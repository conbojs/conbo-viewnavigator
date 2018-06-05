"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var conbo_1 = require("conbo");
document.querySelector('head').innerHTML +=
    '<style type="text/css">' +
        '.cb-viewnavigator { position:relative; }' +
        '.cb-viewnavigator, .cb-viewnavigator > .cb-view { width:100%; height:100%; }' +
        '.cb-viewnavigator > .cb-view { position:absolute; transition:all 0.4s; left:-100%; }' +
        '.cb-pop-transition { left:-100%; }' +
        '.cb-push-transition { left:0; }' +
        '</style>';
function defaultPopTransition(el) {
    // From 0 to 100%
    var left = 0;
    var end = 100;
    var animate = function () {
        left += (end - left) / 10;
        if (~~left == end)
            left = end;
        el.style.left = left + "vw";
        if (left != end)
            requestAnimationFrame(animate);
    };
    animate();
}
function defaultPushTransition(el) {
    // From 100% to 0
    var left = 100;
    var end = 0;
    var animate = function () {
        left += (end - left) / 10;
        if (~~left == end)
            left = end;
        el.style.left = left + "vw";
        if (left != end)
            requestAnimationFrame(animate);
    };
    animate();
}
/**
 * ViewNavigator for ConboJS
 * @author	Mesmotronic Limited <https://www.mesmotronic.com/>
 */
var ViewNavigator = /** @class */ (function (_super) {
    __extends(ViewNavigator, _super);
    function ViewNavigator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @private
     */
    ViewNavigator.prototype.__construct = function (options) {
        conbo_1.setValues(this, conbo_1.setDefaults({}, conbo_1.pick(options, 'defaultPopTransition', 'defaultPushTransition', 'firstView', 'firstViewOptions'), conbo_1.pick(this, 'defaultPopTransition', 'defaultPushTransition', 'firstView', 'firstViewOptions'), { defaultPopTransition: defaultPopTransition, defaultPushTransition: defaultPushTransition }));
        this.__viewStack = [];
        this.className += ' cb-viewnavigator';
        this.addEventListener(conbo_1.ConboEvent.CREATION_COMPLETE, this.__creationCompleteHandler, this);
        conbo_1.View.prototype.__construct.apply(this, arguments);
    };
    /**
     * @private
     */
    ViewNavigator.prototype.__creationCompleteHandler = function (event) {
        if (this.firstView) {
            var options = this.__assignTo(this.firstViewOptions);
            this.pushView(this.firstView, options);
        }
        else {
            conbo_1.warn('ViewNavigator.firstView not specified');
        }
    };
    ViewNavigator.prototype.__assignTo = function (obj) {
        return conbo_1.setDefaults(obj || {}, {
            context: this.context,
            navigator: this,
        });
    };
    /**
     * Removes all of the views from the navigator stack
     */
    ViewNavigator.prototype.popAll = function () {
        var currentView = this.__viewStack.splice(0).pop();
        // TODO Implement transitions
        if (currentView) {
            currentView.remove();
            this.defaultPopTransition(currentView.el);
        }
    };
    /**
     * Removes all views except the bottom view from the navigation stack
     */
    ViewNavigator.prototype.popToFirstView = function () {
        if (this.__viewStack.length > 1) {
            var currentView = this.__viewStack.splice(1).pop();
            var nextView = conbo_1.last(this.__viewStack, 1).pop();
            // TODO Implement transitions
            if (currentView) {
                currentView.remove();
            }
            this.appendView(nextView);
            this.defaultPopTransition(nextView.el);
        }
    };
    /**
     * Pops the current view off the navigation stack
     */
    ViewNavigator.prototype.popView = function () {
        var currentView = this.__viewStack.pop();
        var nextView = conbo_1.last(this.__viewStack, 1).pop();
        // TODO Implement transitions
        if (currentView) {
            currentView.remove();
            this.defaultPopTransition(currentView.el);
        }
        if (nextView) {
            this.appendView(nextView);
        }
    };
    /**
     * Pushes a new view onto the top of the navigation stack
     */
    ViewNavigator.prototype.pushView = function (viewClass, options) {
        var currentView = conbo_1.last(this.__viewStack, 1).pop();
        var nextView = new viewClass(this.__assignTo(options));
        this.__viewStack.push(nextView);
        // TODO Implement transitions
        currentView && currentView.detach();
        this.appendView(nextView);
        this.defaultPushTransition(nextView.el);
    };
    /**
     * Replaces the top view of the navigation stack with a new view
     */
    ViewNavigator.prototype.replaceView = function (viewClass, options) {
        var currentView = this.__viewStack.pop();
        var nextView = new viewClass(this.__assignTo(options));
        this.__viewStack.pop();
        this.__viewStack.push(nextView);
        // TODO Implement transitions
        currentView && currentView.remove();
        this.appendView(nextView);
        this.defaultPushTransition(nextView.el);
    };
    return ViewNavigator;
}(conbo_1.View));
exports.default = ViewNavigator;
