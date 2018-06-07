import { ConboEvent, last, setDefaults, View, warn, pick, assign, Promise } from 'conbo';

document.querySelector('head').innerHTML +=
	'<style type="text/css">'+
		'.cb-viewnavigator { position:relative; }'+
		'.cb-viewnavigator, .cb-viewnavigator > .cb-view { width:100%; height:100%; }'+
		'.cb-viewnavigator > .cb-view { position:absolute; }'+
	'</style>';

function slide(view:View, fromPercent:number, toPercent:number):Promise<void>
{
	return new Promise((resolve, reject) =>
	{
		let el = view.el;
		let left = fromPercent;
		let end = toPercent;

		let animate = () =>
		{
			el.style.left = `${left}%`;

			if (left == end)
			{
				resolve();
			}
			else
			{
				left += (end - left) / 4;
				if (Math.round(left) == Math.round(end)) left = end;
				requestAnimationFrame(animate);
			}
		};

		requestAnimationFrame(animate);
	});
}

function defaultPopTransition(outgoingView:View, incomingView?:View):Promise<void>
{
	// Slide from 0 to 100%

	if (incomingView) slide(incomingView, -100, 0);
	return slide(outgoingView, 0, 100);
}

function defaultPushTransition(incomingView:View, outgoingView?:View):Promise<void>
{
	// Slide from 100% to 0

	if (outgoingView) slide(outgoingView, 0, -100);
	return slide(incomingView, 100, 0);
}

/**
 * ViewNavigator for ConboJS
 * @author	Mesmotronic Limited <https://www.mesmotronic.com/>
 */
export default class ViewNavigator extends View
{
	/**
	 * Function that controls the pop transition (not currently implemented)
	 */
	public defaultPopTransition:Function;

	/**
	 * Function that controls the push transition (not currently implemented)
	 */
	public defaultPushTransition:Function;

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
	private __construct(options:any):void
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
	public popView():void
	{
		if (this.__viewStack.length > 0)
		{
			let currentView:View = this.__viewStack.pop();
			let nextView:View = last(this.__viewStack);

			this.appendView(nextView);

			this.defaultPopTransition(currentView, nextView)
				.then(() => currentView && currentView.remove())
				;
		}
	}

	/**
	 * Removes all views except the bottom view from the navigation stack
	 */
	public popToFirstView():void
	{
		if (this.__viewStack.length > 1)
		{
			let currentView:View = this.__viewStack.splice(1).pop();
			let nextView:View = last(this.__viewStack);

			this.appendView(nextView);

			this.defaultPopTransition(currentView, nextView)
				.then(() => currentView && currentView.remove())
				;
		}
	}

	/**
	 * Removes all of the views from the navigator stack
	 */
	public popAll():void
	{
		let currentView:View = this.__viewStack.splice(0).pop();

		// TODO Implement transitions

		if (currentView)
		{
			this.defaultPopTransition(currentView)
				.then(() => currentView.remove())
				;
		}
	}

	/**
	 * Pushes a new view onto the top of the navigation stack
	 */
	public pushView(viewClass:any, options?:any):void
	{
		let currentView:View = last(this.__viewStack);
		let nextView:View = new viewClass(this.__assignTo(options));

		this.__viewStack.push(nextView);

		this.appendView(nextView);

		this.defaultPushTransition(nextView, currentView)
			.then(() => currentView && currentView.detach())
			;
	}

	/**
	 * Replaces the top view of the navigation stack with a new view
	 */
	public replaceView(viewClass:any, options?:any):void
	{
		let currentView:View = this.__viewStack.pop();
		let nextView:View = new viewClass(this.__assignTo(options));

		this.__viewStack.push(nextView);

		this.appendView(nextView);

		this.defaultPushTransition(nextView, currentView)
			.then(() => currentView && currentView.remove())
			;
	}
}
