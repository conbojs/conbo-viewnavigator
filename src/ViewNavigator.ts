import { ConboEvent, last, setDefaults, View, warn, pick, setValues } from 'conbo';

document.querySelector('head').innerHTML +=
	'<style type="text/css">'+
		'.cb-viewnavigator { position:relative; }'+
		'.cb-viewnavigator, .cb-viewnavigator > .cb-view { width:100%; height:100%; }'+
		'.cb-viewnavigator > .cb-view { position:absolute; transition:all 0.4s; left:-100%; }'+
		'.cb-pop-transition { left:-100%; }'+
		'.cb-push-transition { left:0; }'+
	'</style>';

function defaultPopTransition(el:HTMLElement):void
{
	// From 0 to 100%

	let left = 0;
	let end = 100;

	let animate = () =>
	{
		left += (end - left) / 10;
		if (~~left == end) left = end;
		el.style.left = `${left}vw`;
		if (left != end) requestAnimationFrame(animate);
	};

	animate();
}

function defaultPushTransition(el:HTMLElement):void
{
	// From 100% to 0

	let left = 100;
	let end = 0;

	let animate = () =>
	{
		left += (end - left) / 10;
		if (~~left == end) left = end;
		el.style.left = `${left}vw`;
		if (left != end) requestAnimationFrame(animate);
	};

	animate();
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
		setValues(this, setDefaults
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
			this.pushView(this.firstView, options);
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
	 * Removes all of the views from the navigator stack
	 */
	popAll():void
	{
		let currentView:View = this.__viewStack.splice(0).pop();

		// TODO Implement transitions

		if (currentView)
		{
			currentView.remove();
			this.defaultPopTransition(currentView.el);
		}
	}

	/**
	 * Removes all views except the bottom view from the navigation stack
	 */
	popToFirstView():void
	{
		if (this.__viewStack.length > 1)
		{
			let currentView:View = this.__viewStack.splice(1).pop();
			let nextView:View = last(this.__viewStack, 1).pop();

			// TODO Implement transitions

			if (currentView)
			{
				currentView.remove();
			}

			this.appendView(nextView);
			this.defaultPopTransition(nextView.el);
		}
	}

	/**
	 * Pops the current view off the navigation stack
	 */
	public popView():void
	{
		let currentView:View = this.__viewStack.pop();
		let nextView:View = last(this.__viewStack, 1).pop();

		// TODO Implement transitions

		if (currentView)
		{
			currentView.remove();
			this.defaultPopTransition(currentView.el);
		}

		if (nextView)
		{
			this.appendView(nextView);
		}
	}

	/**
	 * Pushes a new view onto the top of the navigation stack
	 */
	public pushView(viewClass:any, options?:any):void
	{
		let currentView:View = last(this.__viewStack, 1).pop();
		let nextView:View = new viewClass(this.__assignTo(options));

		this.__viewStack.push(nextView);

		// TODO Implement transitions

		currentView && currentView.detach();

		this.appendView(nextView);
		this.defaultPushTransition(nextView.el);
	}

	/**
	 * Replaces the top view of the navigation stack with a new view
	 */
	public replaceView(viewClass:any, options?:any):void
	{
		let currentView:View = this.__viewStack.pop();
		let nextView:View = new viewClass(this.__assignTo(options));

		this.__viewStack.pop();
		this.__viewStack.push(nextView);

		// TODO Implement transitions

		currentView && currentView.remove();

		this.appendView(nextView);
		this.defaultPushTransition(nextView.el);
	}
}
