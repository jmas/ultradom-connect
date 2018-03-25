export as namespace ultradomConnect

/** @namespace [VDOM] */

/** The VDOM representation of an Element.
 *
 * @memberOf [VDOM]
 */
export interface VNode<Attributes = {}> {
  nodeName: string
  attributes?: Attributes
  children: Array<VNode | string>
  key: string
}

/**
 * Function to remove listener added by `Store.subscribe()`
 * @memberOf [Store].
 */
export interface Unsubscribe {
  (): void;
}

/**
 * A store is an object that holds the application's state tree.
 * There should only be a single store in a Redux app, as the composition
 * happens on the reducer level.
 *
 * @template S The type of state held by this store.
 * @memberOf [Store]
 */
export interface Store<S = any> {
  /**
   * Reads the state tree managed by the store.
   *
   * @returns The current state tree of your application.
   */
  getState(): S;

  /**
   * Adds a change listener. It will be called any time an action is
   * dispatched, and some part of the state tree may potentially have changed.
   * You may then call `getState()` to read the current state tree inside the
   * callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked,
   * this will not have any effect on the `dispatch()` that is currently in
   * progress. However, the next `dispatch()` call, whether nested or not,
   * will use a more recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all states changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param listener A callback to be invoked on every dispatch.
   * @returns A function to remove this change listener.
   * @memberOf [Store]
   */
  subscribe(listener: () => void): Unsubscribe;
}

/** A Component is a function that returns a custom VNode or View.
 *
 * @memberOf [VDOM]
 */
export interface ConnectedComponent<Attributes = {}> {
  (attributes: Attributes, children: Array<VNode | string>, store: Store): VNode<Attributes>
}

/** The connect() create new store.
 *
 * @param mergeStateAndProps The merge state and props function.
 * @param options The actions object implementation.
 * @returns The new store.
 * @memberOf [App]
 */
export function connect<ConnectOptions>(
  mergeStateAndProps: (state: {}, ownProps: {}) => {},
  options: {
    connectRootTag: String,
    componentRootTag: String
  },
): ConnectedComponent
