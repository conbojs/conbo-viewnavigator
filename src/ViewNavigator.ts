import { View, last, ConboEvent, warn } from 'conbo';

document.querySelector('head').innerHTML += '<style type="text/css">.cb-viewnavigator { width:100%; height:100%; }</style>';

/**
 * ViewNavigator for ConboJS
 * @author	Mesmotronic Limited <https://www.mesmotronic.com/>
 */
export default class ViewNavigator extends View
{
	/**
	 * CSS class name of the pop transition (not currently implemented)
	 */
	public defaultPopTransition:string = 'cb-pop-transition';

	/**
	 * CSS class name of the push transition (not currently implemented)
	 */
	public defaultPushTransition:string = 'cb-push-transition';

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
		options.defaultPopTransition && (this.defaultPopTransition = options.defaultPopTransition);
		options.defaultPushTransition && (this.defaultPushTransition = options.defaultPushTransition);
		options.firstView && (this.firstView = options.firstView);
		options.firstViewOptions && (this.firstViewOptions = options.firstViewOptions);

		this.__viewStack = [];
		this.className = 'cb-viewnavigator';

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
			let options = this.context.addTo(this.firstViewOptions);
			this.pushView(this.firstView, options);
		}
		else
		{
			warn('ViewNavigator.firstView not specified');
		}
	}

	/**
	 * Removes all of the views from the navigator stack
	 */
	popAll():void
	{
		let currentView:View = this.__viewStack.splice(0).pop();

		// TODO Implement CSS transitions

		currentView.remove();
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

			// TODO Implement CSS transitions

			currentView && currentView.remove();
			this.appendView(nextView);
		}
	}

	/**
	 * Pops the current view off the navigation stack
	 */
	public popView():void
	{
		let currentView:View = this.__viewStack.pop();
		let nextView:View = last(this.__viewStack, 1).pop();

		// TODO Implement CSS transitions

		currentView && currentView.remove();
		nextView && this.appendView(nextView);
	}

	/**
	 * Pushes a new view onto the top of the navigation stack
	 */
	public pushView(viewClass:any, options:any=null):void
	{
		let currentView:View = last(this.__viewStack, 1).pop();
		let nextView:View = new viewClass(options);

		this.__viewStack.push(nextView);

		// TODO Implement CSS transitions

		currentView && currentView.detach();
		this.appendView(nextView);
	}

	/**
	 * Replaces the top view of the navigation stack with a new view
	 */
	public replaceView(viewClass:any, options:any=null):void
	{
		let currentView:View = this.__viewStack.pop();
		let nextView:View = new viewClass(options);

		this.__viewStack.pop();
		this.__viewStack.push(nextView);

		// TODO Implement CSS transitions

		currentView && currentView.remove();
		this.appendView(nextView);
	}
}
