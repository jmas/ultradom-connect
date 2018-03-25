var assert = require('assert')
var connect = require('../src/index').connect
var clone = require('../src/utils').clone
var JSDOM = require('jsdom').JSDOM
var patch = require('ultradom').patch
var h = require('ultradom').h

const dom = new JSDOM(
  '<!DOCTYPE html><html><body><div id="app"></div></body></html>'
)
global.document = dom.window.document
var rootElement = document.getElementById('app')

function createStore() {
  return {
    listener: null,
    state: {
      count: 1
    },

    getState: function() {
      return this.state
    },

    subscribe: function(listener) {
      this.listener = listener
    },

    changeState: function(newState) {
      this.state = newState
      this.listener()
    }
  }
}

describe('connect()', function() {
  it('props are merged correctly', function(done) {
    var store = createStore()
    function Cmp(props) {
      assert.deepEqual(props, {
        outProp: 'outProp',
        count: 1,
        store: store,
        mergeStateAndPropsProp: 'mergeStateAndPropsProp'
      })
      done()
    }
    var CmpConnected = connect(function(state, ownProps) {
      return clone(
        { mergeStateAndPropsProp: 'mergeStateAndPropsProp' },
        clone(state, ownProps)
      )
    })(Cmp)
    patch(h(CmpConnected, { store: store, outProp: 'outProp' }), rootElement)
  })

  it('when store is chenges it should change DOM', function() {
    var store = createStore()
    function Cmp(props) {
      return h('div', {}, [
        h('div', { 'data-hook': 'count' }, [String(props.count)])
      ])
    }
    var CmpConnected = connect()(Cmp)
    patch(h(CmpConnected, { store: store }, []), rootElement)
    store.changeState({ count: 2 })
    assert.deepEqual(
      rootElement.querySelector('[data-hook="count"]').innerHTML,
      2
    )
  })
})
