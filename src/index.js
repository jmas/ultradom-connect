import { h, patch } from 'ultradom'
import { clone } from './utils'

function mergeStateAndPropsDefault(state, ownProps) {
  return clone(ownProps, state)
}

/**
 * Function is using for the same as react-redux connect() function, but with different interface
 * @param {Function} mergeStateAndProps - merge store state and props that came from the top
 * @returns {VNode} - virtual node that represent connected component
 */
export function connect(mergeStateAndProps) {
  mergeStateAndProps = mergeStateAndProps
    ? mergeStateAndProps
    : mergeStateAndPropsDefault
  return function(Component) {
    var unsubscribe
    return function ConnectedComponent(ownProps) {
      var store = ownProps.store
      function subscribe(element) {
        if (unsubscribe) {
          unsubscribe()
        }

        function patchComponent() {
          var newElement = patch(
            h(Component, mergeStateAndProps(store.getState(), ownProps)),
            element
          )
          if (element.parentNode && newElement !== element) {
            element.parentNode.replaceChild(newElement, element)
          }
          element = newElement
        }

        var unsubscribeFromStore = store.subscribe(patchComponent)

        unsubscribe = function() {
          unsubscribeFromStore()
          unsubscribe = null
        }

        patchComponent()
      }
      return h('div', {
        oncreate: function(element) {
          subscribe(element)
        },
        onupdate: function(element, oldAttributes) {
          if (oldAttributes.store !== store) {
            subscribe(element)
          }
        },
        ondestroy: function() {
          unsubscribe()
        }
      })
    }
  }
}
