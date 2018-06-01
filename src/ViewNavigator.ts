import { View, last } from 'conbo';

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

		(<any>View.prototype).__construct.apply(this, arguments);
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
		let currentView:View = this.__viewStack.splice(1).pop();
		let nextView:View = last(this.__viewStack, 1).pop();

		// TODO Implement CSS transitions

		currentView.remove();
		this.appendView(nextView);
	}

	/**
	 * Pops the current view off the navigation stack
	 */
	public popView():void
	{
		let currentView:View = this.__viewStack.pop();
		let nextView:View = last(this.__viewStack, 1).pop();

		// TODO Implement CSS transitions

		currentView.remove();
		this.appendView(nextView);
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

		currentView.detach();
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

		currentView.remove();
		this.appendView(nextView);
	}
}