# ultradom-connect

Connect store with redux-like interface to ultradom.

## Interface

`connect(mergeStateAndProps, options)`

* @param {Function} `mergeStateAndProps` -  merge store state and props that came from the top
* @param {Object} `options` - options object
* @param {String} `options.connectRootTag` - tag name of element outside of connected component
* @param {String} `options.componentRootTag` - tag name of root element inside connected component

## Example

```js
import { connect } from 'ultradom-connect'
import chat from './chat'
import chatActions from './chat_actions'

// chat.store - redux store
// chat.actions - chat action creators

function ChatApp({ messages=[], newMessage='', onSendMessage }) {
  return (
    <div class="chat__container">
      <div class="chat__messages">
        {messages.map((message, index) => <div key={index}>{message}</div>)}
      </div>
      <form class="chat__new_message" onsubmit={event => { event.preventDefault(); onSendMessage(event.target.elements.message.value) }}>
        <input type="text" name="message" value={newMessage} />
        <button>Add message</button>
      </form>
    </div>
  )
}

const ChatAppConnected = connect(
  (state, { store }) => ({
    ...state,
    onSendMessage: newMessage => store.dispatch(chat.actions.sendMessage(newMessage))
  })
)(ChatApp)

patch(<ChatAppConnected store={chat.store} />, document.getElementById('app'))
```
