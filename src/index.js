var ultradom = require('ultradom')
var utils = require('./utils')
var h = ultradom.h
var patch = ultradom.patch
var clone = utils.clone

function mergeStateAndPropsDefault(state, ownProps) {
  return clone(ownProps, state)
}

/**
 * Function is using for the same as react-redux connect() function, but with different interface
 * @param {Function} mergeStateAndProps - merge store state and props that came from the top
 * @returns {VNode} - virtual node that represent connected component
 */
function connect(mergeStateAndProps) {
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
          element = patch(
            h(Component, mergeStateAndProps(store.getState(), ownProps)),
            element
          )
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

module.exports = {
  connect: connect
}
