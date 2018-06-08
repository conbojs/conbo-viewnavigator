import { ConboEvent, last, setDefaults, View, warn, pick, assign, Promise } from 'conbo';

/**
 * ViewNavigator for ConboJS
 * @author	Mesmotronic Limited <https://www.mesmotronic.com/>
 */
export default class ViewNavigator extends View
{
	/**
	 * Function that controls the pop transition
	 * @example		function(startView:View, endView:View):Promise<any> { ... }
	 */
	public defaultPopTransition:(startView:View, endView:View)=>Promise<any>;

	/**
	 * Function that controls the push transition
	 * @example		function(startView:View, endView:View):Promise<any> { ... }
	 */
	public defaultPushTransition:(startView:View, endView:View)=>Promise<any>;

	/**
	 * Class of first view to display
	 */
	public firstView:any;

	/**
	 * Options to pass to first view constructor
	 */
	public firstViewOptions:any;

	/**
	 * @private
	 */
	private __viewStack:View[];

	/**
	 * @private
	 */
	protected __construct(options:any):void
	{
		assign(this, setDefaults
		(
			{},
			pick(options, 'defaultPopTransition', 'defaultPushTransition', 'firstView', 'firstViewOptions'),
			pick(this, 'defaultPopTransition', 'defaultPushTransition', 'firstView', 'firstViewOptions'),
			{defaultPopTransition, defaultPushTransition}
		));

		this.__viewStack = [];
		this.className += ' cb-viewnavigator';

		this.addEventListener(ConboEvent.CREATION_COMPLETE, this.__creationCompleteHandler, this);

		(<any>View.prototype).__construct.apply(this, arguments);
	}

	/**
	 * @private
	 */
	private __creationCompleteHandler(event:ConboEvent):void
	{
		if (this.firstView)
		{
			let options = this.__assignTo(this.firstViewOptions);
			let firstView = new this.firstView(options);

			this.__viewStack.push(firstView);
			this.appendView(firstView);
		}
		else
		{
			warn('ViewNavigator.firstView not specified');
		}
	}

	/**
     * @private
     */
	private __assignTo(obj:any):any
	{
		return setDefaults(obj || {},
		{
			context: this.context,
			navigator: this,
		});
	}

	/**
	 * Pops the current view off the navigation stack
	 */
	public popView(transition?:(startView:View, endView:View)=>Promise<any>):void
	{
		if (this.__viewStack.length > 0)
		{
			transition || (transition = this.defaultPopTransition);

			let currentView:View = this.__viewStack.pop();
			let nextView:View = last(this.__viewStack);

			this.appendView(nextView);

			transition(currentView, nextView)
				.then(() => currentView && currentView.remove())
				;
		}
	}

	/**
	 * Removes all views except the bottom view from the navigation stack
	 */
	public popToFirstView(transition?:(startView:View, endView:View, transition?:(startView:View, endView:View)=>Promise<any>)=>Promise<any>):void
	{
		if (this.__viewStack.length > 1)
		{
			transition || (transition = this.defaultPopTransition);

			let currentView:View = this.__viewStack.splice(1).pop();
			let nextView:View = last(this.__viewStack);

			this.appendView(nextView);

			transition(currentView, nextView)
				.then(() => currentView && currentView.remove())
				;
		}
	}

	/**
	 * Removes all of the views from the navigator stack
	 */
	public popAll(transition?:(startView:View, endView:View)=>Promise<any>):void
	{
		transition || (transition = this.defaultPopTransition);

		let currentView:View = this.__viewStack.splice(0).pop();

		// TODO Implement transitions

		if (currentView)
		{
			transition(currentView, undefined)
				.then(() => currentView.remove())
				;
		}
	}

	/**
	 * Pushes a new view onto the top of the navigation stack
	 */
	public pushView(viewClass:any, options?:any, transition?:(startView:View, endView:View)=>Promise<any>):void
	{
		transition || (transition = this.defaultPushTransition);

		let currentView:View = last(this.__viewStack);
		let nextView:View = new viewClass(this.__assignTo(options));

		this.__viewStack.push(nextView);

		this.appendView(nextView);

		transition(currentView, nextView)
			.then(() => currentView && currentView.detach())
			;
	}

	/**
	 * Replaces the top view of the navigation stack with a new view
	 */
	public replaceView(viewClass:any, options?:any, transition?:(startView:View, endView:View)=>Promise<any>):void
	{
		transition || (transition = this.defaultPushTransition);

		let currentView:View = this.__viewStack.pop();
		let nextView:View = new viewClass(this.__assignTo(options));

		this.__viewStack.push(nextView);

		this.appendView(nextView);

		transition(currentView, nextView)
			.then(() => currentView && currentView.remove())
			;
	}
}

// Related CSS styles

document.querySelector('head').innerHTML +=
	'<style type="text/css">'+
		'.cb-viewnavigator { position:relative; }'+
		'.cb-viewnavigator, .cb-viewnavigator > .cb-view { width:100%; height:100%; }'+
		'.cb-viewnavigator > .cb-view { position:absolute; }'+
	'</style>';

// Default easing functions

function easeOutCubic(currentIteration:number, startValue:number, changeInValue:number, totalIterations:number):number
{
	return changeInValue * (Math.pow(currentIteration / totalIterations - 1, 3) + 1) + startValue;
}

function slide(view:View, fromPercent:number, toPercent:number):Promise<any>
{
	return new Promise((resolve, reject) =>
	{
		let el = view.el;
		let totalIterations = 12;
		let currentIteration = 0;
		let currentPercent = fromPercent;
		let changeInValue = toPercent-fromPercent;

		el.style.pointerEvents = 'none';

		let animate = () =>
		{
			el.style.left = `${currentPercent}%`;

			if (currentIteration == totalIterations)
			{
				el.style.left = `${toPercent}%`;
				el.style.pointerEvents = null;

				resolve();
			}
			else
			{
				currentPercent = easeOutCubic(currentIteration++, fromPercent, changeInValue, totalIterations);
				requestAnimationFrame(animate);
			}
		};

		requestAnimationFrame(animate);
	});
}

function defaultPopTransition(startView:View, endView:View):Promise<any>
{
	if (endView) slide(endView, -100, 0);
	return slide(startView, 0, 100);
}

function defaultPushTransition(startView:View, endView:View):Promise<any>
{
	if (startView) slide(startView, 0, -100);
	return slide(endView, 100, 0);
}
