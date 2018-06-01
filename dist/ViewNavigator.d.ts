import { View } from 'conbo';
/**
 * ViewNavigator for ConboJS
 * @author	Mesmotronic Limited <https://www.mesmotronic.com/>
 */
export default class ViewNavigator extends View {
    /**
     * CSS class name of the pop transition (not currently implemented)
     */
    defaultPopTransition: string;
    /**
     * CSS class name of the push transition (not currently implemented)
     */
    defaultPushTransition: string;
    /**
     * Class of first view to display
     */
    firstView: any;
    /**
     * Options to pass to first view constructor
     */
    firstViewOptions: any;
    /**
     * @private
     */
    private __viewStack;
    /**
     * @private
     */
    private __construct;
    /**
     * @private
     */
    private __creationCompleteHandler;
    /**
     * Removes all of the views from the navigator stack
     */
    popAll(): void;
    /**
     * Removes all views except the bottom view from the navigation stack
     */
    popToFirstView(): void;
    /**
     * Pops the current view off the navigation stack
     */
    popView(): void;
    /**
     * Pushes a new view onto the top of the navigation stack
     */
    pushView(viewClass: any, options?: any): void;
    /**
     * Replaces the top view of the navigation stack with a new view
     */
    replaceView(viewClass: any, options?: any): void;
}
