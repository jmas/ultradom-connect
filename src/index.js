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
 * @param {Object} options - options object
 * @param {String} options.connectRootTag - tag name of element outside of connected component
 * @param {String} options.componentRootTag - tag name of root element inside connected component
 */
function connect(mergeStateAndProps, options) {
  mergeStateAndProps = mergeStateAndProps
    ? mergeStateAndProps
    : mergeStateAndPropsDefault
  options = clone(
    {
      connectRootTag: 'div',
      componentRootTag: 'div'
    },
    options || {}
  )
  return function(Component) {
    var unsubscribe
    var rootElement
    return function ConnectedComponent(ownProps) {
      var store = ownProps.store
      function patchRootElement() {
        patch(
          h(Component, mergeStateAndProps(store.getState(), ownProps)),
          rootElement
        )
      }
      function createRootElement(element) {
        rootElement = document.createElement(options.componentRootTag)
        unsubscribe = store.subscribe(patchRootElement)
        element.appendChild(rootElement)
        patchRootElement()
      }
      return h(options.connectRootTag, {
        oncreate: function(element) {
          createRootElement(element)
        },
        onupdate: function(element, oldAttributes) {
          if (oldAttributes.store !== store) {
            createRootElement(element)
          }
        },
        ondestroy: function(element) {
          element.removeChild(rootElement)
          unsubscribe()
          rootElement = null
          unsubscribe = null
        }
      })
    }
  }
}

module.exports = {
  connect
}
