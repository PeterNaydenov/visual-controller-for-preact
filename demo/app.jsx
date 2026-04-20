import { h } from 'preact'
import { useState } from 'preact/hooks'



function Hello ( props ) {
  const { data, setupUpdates } = props
  const [message, setMessage] = useState(data.greeting || 'Hello')
  const [count, setCount] = useState(0)

  
  function changeMessage ( newMsg ) {
        setMessage(newMsg)
    }

  function increment() {
        setCount(c => c + 1)
    }

  function getCount () {
      return count
    }

  setupUpdates ({
          changeMessage,
          increment,
          getCount
    })


  return (
    h('div', { class: 'hello' },
      h('h2', null, message),
      h('p', null, `Count: ${count}`),
      h('button', { onClick: increment }, 'Increment')
    )
  )
} // Hello



export default Hello