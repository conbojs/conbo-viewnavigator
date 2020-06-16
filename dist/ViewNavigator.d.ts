import { View, Promise } from 'conbo';
/**
 * ViewNavigator for ConboJS
 * @author	Mesmotronic Limited <https://www.mesmotronic.com/>
 */
export declare class ViewNavigator extends View {
    /**
     * Function that controls the pop transition
     * @example		function(startView:View, endView:View):Promise<any> { ... }
     */
    defaultPopTransition: (startView: View, endView: View) => Promise<any>;
    /**
     * Function that controls the push transition
     * @example		function(startView:View, endView:View):Promise<any> { ... }
     */
    defaultPushTransition: (startView: View, endView: View) => Promise<any>;
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
    protected preinitialize(options: any): void;
    /**
     * @private
     */
    private __creationCompleteHandler;
    /**
     * @private
     */
    private __assignTo;
    /**
     * Pops the current view off the navigation stack
     */
    popView(transition?: (startView: View, endView: View) => Promise<any>): void;
    /**
     * Removes all views except the bottom view from the navigation stack
     */
    popToFirstView(transition?: (startView: View, endView: View, transition?: (startView: View, endView: View) => Promise<any>) => Promise<any>): void;
    /**
     * Removes all of the views from the navigator stack
     */
    popAll(transition?: (startView: View, endView: View) => Promise<any>): void;
    /**
     * Pushes a new view onto the top of the navigation stack
     */
    pushView(viewClass: any, options?: any, transition?: (startView: View, endView: View) => Promise<any>): void;
    /**
     * Replaces the top view of the navigation stack with a new view
     */
    replaceView(viewClass: any, options?: any, transition?: (startView: View, endView: View) => Promise<any>): void;
}
export declare function slidePopTransition(startView: View, endView: View): Promise<any>;
export declare function slidePushTransition(startView: View, endView: View): Promise<any>;
export default ViewNavigator;
