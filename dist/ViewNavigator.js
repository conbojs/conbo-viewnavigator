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
        '.cb-viewnavigator > .cb-view { position:absolute; }' +
        '</style>';
function slide(view, fromPercent, toPercent) {
    return new conbo_1.Promise(function (resolve, reject) {
        var el = view.el;
        var left = fromPercent;
        var end = toPercent;
        var animate = function () {
            el.style.left = left + "%";
            if (left == end) {
                resolve();
            }
            else {
                left += (end - left) / 4;
                if (Math.round(left) == Math.round(end))
                    left = end;
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    });
}
function defaultPopTransition(outgoingView, incomingView) {
    // Slide from 0 to 100%
    if (incomingView)
        slide(incomingView, -100, 0);
    return slide(outgoingView, 0, 100);
}
function defaultPushTransition(incomingView, outgoingView) {
    // Slide from 100% to 0
    if (outgoingView)
        slide(outgoingView, 0, -100);
    return slide(incomingView, 100, 0);
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
        conbo_1.assign(this, conbo_1.setDefaults({}, conbo_1.pick(options, 'defaultPopTransition', 'defaultPushTransition', 'firstView', 'firstViewOptions'), conbo_1.pick(this, 'defaultPopTransition', 'defaultPushTransition', 'firstView', 'firstViewOptions'), { defaultPopTransition: defaultPopTransition, defaultPushTransition: defaultPushTransition }));
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
            var firstView = new this.firstView(options);
            this.__viewStack.push(firstView);
            this.appendView(firstView);
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
     * Pops the current view off the navigation stack
     */
    ViewNavigator.prototype.popView = function () {
        if (this.__viewStack.length > 0) {
            var currentView_1 = this.__viewStack.pop();
            var nextView = conbo_1.last(this.__viewStack);
            this.appendView(nextView);
            this.defaultPopTransition(currentView_1, nextView)
                .then(function () { return currentView_1 && currentView_1.remove(); });
        }
    };
    /**
     * Removes all views except the bottom view from the navigation stack
     */
    ViewNavigator.prototype.popToFirstView = function () {
        if (this.__viewStack.length > 1) {
            var currentView_2 = this.__viewStack.splice(1).pop();
            var nextView = conbo_1.last(this.__viewStack);
            this.appendView(nextView);
            this.defaultPopTransition(currentView_2, nextView)
                .then(function () { return currentView_2 && currentView_2.remove(); });
        }
    };
    /**
     * Removes all of the views from the navigator stack
     */
    ViewNavigator.prototype.popAll = function () {
        var currentView = this.__viewStack.splice(0).pop();
        // TODO Implement transitions
        if (currentView) {
            this.defaultPopTransition(currentView)
                .then(function () { return currentView.remove(); });
        }
    };
    /**
     * Pushes a new view onto the top of the navigation stack
     */
    ViewNavigator.prototype.pushView = function (viewClass, options) {
        var currentView = conbo_1.last(this.__viewStack);
        var nextView = new viewClass(this.__assignTo(options));
        this.__viewStack.push(nextView);
        this.appendView(nextView);
        this.defaultPushTransition(nextView, currentView)
            .then(function () { return currentView && currentView.detach(); });
    };
    /**
     * Replaces the top view of the navigation stack with a new view
     */
    ViewNavigator.prototype.replaceView = function (viewClass, options) {
        var currentView = this.__viewStack.pop();
        var nextView = new viewClass(this.__assignTo(options));
        this.__viewStack.push(nextView);
        this.appendView(nextView);
        this.defaultPushTransition(nextView, currentView)
            .then(function () { return currentView && currentView.remove(); });
    };
    return ViewNavigator;
}(conbo_1.View));
exports.default = ViewNavigator;
