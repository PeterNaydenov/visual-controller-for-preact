import { h } from 'preact'



/**
 * Demo App component for testing VisualController
 * @param {Object} props - Component props
 * @param {Object} props.data - Data passed via publish
 * @param {Function} props.setupUpdates - Function to register update methods
 * @param {Object} props.dependencies - External dependencies
 * @returns {import('preact').VNode}
 */
export default function App (props) {
  const { data, setupUpdates } = props
  const message = data?.greeting || 'Hello World'
  let count = 0

  if ( setupUpdates ) {
    setupUpdates({
      changeMessage: () => {},
      increment: () => { count += 1 },
      getMessage: () => message,
      getCount: () => count
    })
  }

  return (
    h('div', { class: 'app' },
      h('h1', null, message),
      h('p', null, `Count: ${count}`),
      h('button', { 
        onClick: () => { count += 1 },
        'data-testid': 'increment-btn'
      }, 'Increment')
    )
  )
}