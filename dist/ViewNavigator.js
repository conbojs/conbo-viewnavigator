"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var conbo_1 = require("conbo");
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
    ViewNavigator.prototype.preinitialize = function (options) {
        _super.prototype.preinitialize.call(this, options);
        conbo_1.assign(this, conbo_1.setDefaults({}, conbo_1.pick(options, 'defaultPopTransition', 'defaultPushTransition', 'firstView', 'firstViewOptions'), conbo_1.pick(this, 'defaultPopTransition', 'defaultPushTransition', 'firstView', 'firstViewOptions'), { 'defaultPopTransition': slidePopTransition, 'defaultPushTransition': slidePushTransition }));
        this.__viewStack = [];
        this.className = conbo_1.compact([this.className, 'cb-viewnavigator']).join(' ');
        this.addEventListener(conbo_1.ConboEvent.CREATION_COMPLETE, this.__creationCompleteHandler, { scope: this });
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
    /**
     * @private
     */
    ViewNavigator.prototype.__assignTo = function (obj) {
        return conbo_1.setDefaults(obj || {}, {
            context: this.context,
            navigator: this,
        });
    };
    /**
     * Pops the current view off the navigation stack
     */
    ViewNavigator.prototype.popView = function (transition) {
        if (this.__viewStack.length > 0) {
            transition || (transition = this.defaultPopTransition);
            var currentView_1 = this.__viewStack.pop();
            var nextView = conbo_1.last(this.__viewStack);
            this.appendView(nextView);
            transition(currentView_1, nextView)
                .then(function () { return currentView_1 && currentView_1.remove(); });
        }
    };
    /**
     * Removes all views except the bottom view from the navigation stack
     */
    ViewNavigator.prototype.popToFirstView = function (transition) {
        if (this.__viewStack.length > 1) {
            transition || (transition = this.defaultPopTransition);
            var currentView_2 = this.__viewStack.splice(1).pop();
            var nextView = conbo_1.last(this.__viewStack);
            this.appendView(nextView);
            transition(currentView_2, nextView)
                .then(function () { return currentView_2 && currentView_2.remove(); });
        }
    };
    /**
     * Removes all of the views from the navigator stack
     */
    ViewNavigator.prototype.popAll = function (transition) {
        transition || (transition = this.defaultPopTransition);
        var currentView = this.__viewStack.splice(0).pop();
        // TODO Implement transitions
        if (currentView) {
            transition(currentView, undefined)
                .then(function () { return currentView.remove(); });
        }
    };
    /**
     * Pushes a new view onto the top of the navigation stack
     */
    ViewNavigator.prototype.pushView = function (viewClass, options, transition) {
        transition || (transition = this.defaultPushTransition);
        var currentView = conbo_1.last(this.__viewStack);
        var nextView = new viewClass(this.__assignTo(options));
        this.__viewStack.push(nextView);
        this.appendView(nextView);
        transition(currentView, nextView)
            .then(function () { return currentView && currentView.detach(); });
    };
    /**
     * Replaces the top view of the navigation stack with a new view
     */
    ViewNavigator.prototype.replaceView = function (viewClass, options, transition) {
        transition || (transition = this.defaultPushTransition);
        var currentView = this.__viewStack.pop();
        var nextView = new viewClass(this.__assignTo(options));
        this.__viewStack.push(nextView);
        this.appendView(nextView);
        transition(currentView, nextView)
            .then(function () { return currentView && currentView.remove(); });
    };
    return ViewNavigator;
}(conbo_1.View));
exports.ViewNavigator = ViewNavigator;
// Related CSS styles
document.querySelector('head').innerHTML +=
    '<style type="text/css">' +
        '.cb-viewnavigator { position:relative; overflow:hidden; }' +
        '.cb-viewnavigator, .cb-viewnavigator > .cb-view { box-sizing:border-box; width:100%; height:100%; }' +
        '.cb-viewnavigator > .cb-view { position:absolute; }' +
        '</style>';
// Default easing functions
function easeOutCubic(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * (Math.pow(currentIteration / totalIterations - 1, 3) + 1) + startValue;
}
function slide(view, fromPercent, toPercent) {
    return new conbo_1.Promise(function (resolve, reject) {
        var el = view.el;
        var totalIterations = 12;
        var currentIteration = 0;
        var currentPercent = fromPercent;
        var changeInValue = toPercent - fromPercent;
        el.style.pointerEvents = 'none';
        var animate = function () {
            el.style.left = currentPercent + "%";
            if (currentIteration == totalIterations) {
                el.style.left = toPercent + "%";
                el.style.pointerEvents = null;
                resolve();
            }
            else {
                currentPercent = easeOutCubic(currentIteration++, fromPercent, changeInValue, totalIterations);
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    });
}
function slidePopTransition(startView, endView) {
    if (endView)
        slide(endView, -100, 0);
    return slide(startView, 0, 100);
}
exports.slidePopTransition = slidePopTransition;
function slidePushTransition(startView, endView) {
    if (startView)
        slide(startView, 0, -100);
    return slide(endView, 100, 0);
}
exports.slidePushTransition = slidePushTransition;
exports.default = ViewNavigator;
