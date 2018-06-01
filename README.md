ConboJS ViewStack
=================

The ViewNavigator component is a container that consists of a collection of View objects, where only the top most view is visible and active. Use the ViewNavigator container to control the navigation between views in your application.

Navigation in an application is controlled by a stack of View objects. The top View object on the stack defines the currently visible view. The ViewNavigator container maintains the stack. To change views, push a new View object onto the stack, or pop the current View object off of the stack. Popping the currently visible View object from the stack destroys the View object, and returns the user to the previous view on the stack.

When a view is pushed on top of the stack, the old view is detached and can be restored when the view is reactived as a result of the current view being popped off the stack.
