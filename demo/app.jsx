import { h } from 'preact'
import { useState } from 'preact/hooks'


function Header ( props ) {
        const
              { data = {}, setupUpdates } = props
            , [ message, setMessage ] = useState ( data.greeting || 'Hello from Header!' )
            , [ count, setCount ] = useState ( 0 )
            ;

        function changeMessage ( newMsg ) {
                setMessage ( newMsg )
            }

        function increment () {
                setCount ( current => current + 1 )
            }

        function getCount () {
                return count
            }

        setupUpdates ({ changeMessage, increment, getCount })

        return h ( 'div', { class: 'header' },
                  h ( 'h3', null, message )
                , h ( 'p', null, `Count: ${count}` )
                , h ( 'button', { onClick: increment }, 'Increment' )
            )
    }


function Sidebar ( props ) {
        const
              { data = {}, setupUpdates } = props
            , [ items, setItems ] = useState ([ 'Apples', 'Oranges', 'Pears' ])
            , [ filter, setFilter ] = useState ( '' )
            ;

        function addItem ( name ) {
                if ( name )   setItems ( current => [ ...current, name ] )
            }

        function removeItem ( idx ) {
                setItems ( current => current.filter ( ( _, index ) => index !== idx ) )
            }

        function setFilterText ( text ) {
                setFilter ( text )
            }

        setupUpdates ({
              addItem
            , removeItem
            , setFilter: setFilterText
        })

        const visible = items
                .map ( ( item, index ) => ({ item, index }) )
                .filter ( ({ item }) => item.toLowerCase ().includes ( filter.toLowerCase () ) )

        return h ( 'div', { class: 'sidebar' },
                  h ( 'h3', null, data.title || 'Sidebar' )
                , h ( 'input', {
                          value: filter
                        , onInput: event => setFilterText ( event.currentTarget.value )
                        , placeholder: 'filter...'
                    })
                , h ( 'ul', null,
                          visible.map ( ({ item, index }) => h ( 'li', { key: item },
                                  item
                                , h ( 'button', { onClick: () => removeItem ( index ) }, 'x' )
                            ))
                    )
            )
    }


export { Header, Sidebar }
