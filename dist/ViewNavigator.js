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
document.querySelector('head').innerHTML += '<style type="text/css">cb-viewnavigator { width:100%; height:100%; }</style>';
/**
 * ViewNavigator for ConboJS
 * @author	Mesmotronic Limited <https://www.mesmotronic.com/>
 */
var ViewNavigator = /** @class */ (function (_super) {
    __extends(ViewNavigator, _super);
    function ViewNavigator() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * CSS class name of the pop transition (not currently implemented)
         */
        _this.defaultPopTransition = 'cb-pop-transition';
        /**
         * CSS class name of the push transition (not currently implemented)
         */
        _this.defaultPushTransition = 'cb-push-transition';
        return _this;
    }
    /**
     * @private
     */
    ViewNavigator.prototype.__construct = function (options) {
        options.defaultPopTransition && (this.defaultPopTransition = options.defaultPopTransition);
        options.defaultPushTransition && (this.defaultPushTransition = options.defaultPushTransition);
        options.firstView && (this.firstView = options.firstView);
        options.firstViewOptions && (this.firstViewOptions = options.firstViewOptions);
        this.__viewStack = [];
        this.className = 'cb-viewnavigator';
        this.addEventListener(conbo_1.ConboEvent.CREATION_COMPLETE, this.__creationCompleteHandler, this);
        conbo_1.View.prototype.__construct.apply(this, arguments);
    };
    /**
     * @private
     */
    ViewNavigator.prototype.__creationCompleteHandler = function (event) {
        if (this.firstView) {
            var options = this.context.addTo(this.firstViewOptions);
            this.pushView(new this.firstView(options));
        }
        else {
            conbo_1.warn('ViewNavigator.firstView not specified');
        }
    };
    /**
     * Removes all of the views from the navigator stack
     */
    ViewNavigator.prototype.popAll = function () {
        var currentView = this.__viewStack.splice(0).pop();
        // TODO Implement CSS transitions
        currentView.remove();
    };
    /**
     * Removes all views except the bottom view from the navigation stack
     */
    ViewNavigator.prototype.popToFirstView = function () {
        var currentView = this.__viewStack.splice(1).pop();
        var nextView = conbo_1.last(this.__viewStack, 1).pop();
        // TODO Implement CSS transitions
        currentView.remove();
        this.appendView(nextView);
    };
    /**
     * Pops the current view off the navigation stack
     */
    ViewNavigator.prototype.popView = function () {
        var currentView = this.__viewStack.pop();
        var nextView = conbo_1.last(this.__viewStack, 1).pop();
        // TODO Implement CSS transitions
        currentView.remove();
        this.appendView(nextView);
    };
    /**
     * Pushes a new view onto the top of the navigation stack
     */
    ViewNavigator.prototype.pushView = function (viewClass, options) {
        if (options === void 0) { options = null; }
        var currentView = conbo_1.last(this.__viewStack, 1).pop();
        var nextView = new viewClass(options);
        this.__viewStack.push(nextView);
        // TODO Implement CSS transitions
        currentView.detach();
        this.appendView(nextView);
    };
    /**
     * Replaces the top view of the navigation stack with a new view
     */
    ViewNavigator.prototype.replaceView = function (viewClass, options) {
        if (options === void 0) { options = null; }
        var currentView = this.__viewStack.pop();
        var nextView = new viewClass(options);
        this.__viewStack.pop();
        this.__viewStack.push(nextView);
        // TODO Implement CSS transitions
        currentView.remove();
        this.appendView(nextView);
    };
    return ViewNavigator;
}(conbo_1.View));
exports.default = ViewNavigator;
