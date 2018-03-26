var assert = require('assert')
var connect = require('../dist/index').connect
var JSDOM = require('jsdom').JSDOM
var patch = require('ultradom').patch
var h = require('ultradom').h

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>')
global.document = dom.window.document

function clone(target, source) {
  var out = {}
  for (var i in target) out[i] = target[i]
  for (var j in source) out[j] = source[j]
  return out
}

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
      return function() {
        this.listener = null
      }
    },

    changeState: function(newState) {
      this.state = newState
      if (this.listener) {
        this.listener()
      }
    }
  }
}

describe('connect()', function() {
  var store
  var rootElement

  beforeEach(function() {
    document.body.innerHTML = '<div id="app"></div>'
    rootElement = document.getElementById('app')
    store = createStore()
  })

  it('props are merged correctly', function(done) {
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
    function Cmp(props) {
      return h('div', { 'data-hook': 'count' }, [String(props.count || null)])
    }
    var CmpConnected = connect()(Cmp)
    patch(h(CmpConnected, { store: store }), rootElement)
    store.changeState({ count: 2 })
    assert.deepEqual(
      document.body.querySelector('[data-hook="count"]').innerHTML,
      2
    )
  })

  it('when we have different mount root and component root', function() {
    function Cmp(props) {
      return h('main', { 'data-hook': 'count' }, [String(props.count || null)])
    }
    var CmpConnected = connect()(Cmp)
    patch(h(CmpConnected, { store: store }), rootElement)
    store.changeState({ count: 2 })
    assert.deepEqual(
      document.body.querySelector('[data-hook="count"]').innerHTML,
      2
    )
  })
})
