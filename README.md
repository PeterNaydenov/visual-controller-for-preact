# Visual Controller for Preact (@peter.naydenov/visual-controller-for-preact)

![version](https://img.shields.io/github/package-json/v/peterNaydenov/visual-controller-for-preact)
![license](https://img.shields.io/github/license/peterNaydenov/visual-controller-for-preact)



Tool for building a micro-frontends(MFE) based on Preact components - Start multiple Preact applications in the same HTML page and control them.

Install visual controller:
```
npm i @peter.naydenov/visual-controller-for-preact
```

Initialization process:
```js
// for es6 module projects:
import notice from '@peter.naydenov/notice' // event emitter by your personal choice.
import VisualController from '@peter.naydenov/visual-controller-for-preact'


let 
      eBus = notice ()
    , dependencies = { eBus }  // Provide everything that should be exposed to components 
    , html = new VisualController ( dependencies ) 
    ;
// Ready for use...
```

Let's show something on the screen:
```js
// Let's have Preact component 'Hello' with prop 'greeting'

html.publish ( Hello, {greeting:'Hi'}, 'app' )
//arguments are: ( component, props, containerID )
```

## Inside of the Components

*Note: If your component should be displayed only, that section can be skipped.*

All provided libraries during visualController initialization are available through `props.dependencies`. Use `props.setupUpdates` if you need to manipulate component from outside.

```js
import { h } from 'preact'
import { useState } from 'preact/hooks'

function Hello (props) {
  const { dependencies, data, setupUpdates } = props
  const { eBus } = dependencies
  const [message, setMessage] = useState(data.greeting || 'Hello')

  setupUpdates ({   // Provides to visualContoller method 'changeMessage' 
        changeMessage (update) {
              setMessage(update)
          }
    })

  return h('div', null, message)
}
```

The external call will look like this:

```js
html.getApp ( 'app' ).changeMessage ( 'New message content' )
```




## Visual Controller Methods
```js
  publish : 'Render Preact app in container. Associate app instance with the container.'
, getApp  : 'Returns app instance by container name'
, destroy : 'Destroy app by using container name '
, has     : 'Checks if app with specific "id" was published'
```



### VisualController.publish ()
Publish a Preact app.
```js
html.publish ( component, props, containerID )
```
- **component**: *function*. Preact component function
- **props**: *object*. Preact components props
- **containerID**: *string*. Id of the container where Preact-app will live.
- **returns**: *Promise<Object>*. Update methods library if defined. Else will return an empty object;

Example:
```js
 let html = new VisualController ();
 html.publish ( Hi, { greeting: 'hi'}, 'app' )
```

Render component 'Hi' with prop 'greeting' and render it in html element with id "app".





### VisualController.getApp ()
Returns the library of functions provided from method `setupUpdates`. If Preact-app never called `setupUpdates`, result will be an empty object.

```js
 let controls = html.getApp ( containerID )
```
- **containerID**: *string*. Id of the container.

Example:
```js
let 
      id = 'videoControls'
    , controls = html.getApp ( id )
    ;
    // if app with 'id' doesn't exist -> returns false, 
    // if app exists and 'setupUpdates' was not used -> returns {}
    // in our case -> returns { changeMessage:f }
if ( !controls )   console.error ( `App with id:"${id}" is not available` )
else {
        if ( controls.changeMessage )   controls.changeMessage ('new title') 
   }
```
If visual controller(html) has a Preact app associated with this name will return it. Otherwise will return **false**.





### VisualController.has ()
Checks if app with specific "id" was published.

```js
 const has = html.has ( containerID )
```
- **containerID**: *string*. Id of the container.
- **returns**: *boolean*. Returns true if app with specific id exists, false otherwise





### VisualController.destroy ()
Will destroy Preact app associated with this container name and container will become empty. Function will return 'true' on success and 'false' on failure. 
Function will not delete content of provided container if there is no Preact app associated with it.

```js
html.destroy ( containerID )
```
- **containerID**: *string*. Id name.





### Extra

Visual Controller has versions for few other front-end frameworks:
- [Vue 3](https://github.com/PeterNaydenov/visual-controller-for-vue3)
- [React](https://github.com/PeterNaydenov/visual-controller-for-react)
- [Svelte 5](https://github.com/PeterNaydenov/visual-controller-for-svelte5)
- [Solid](https://github.com/PeterNaydenov/visual-controller-for-solid)
- [Lit](https://github.com/PeterNaydenov/visual-controller-for-lit)
- [Vue 2](https://github.com/PeterNaydenov/visual-controller-for-vue)
- [Svelte 3 and 4](https://github.com/PeterNaydenov/visual-controller-for-svelte3)





## Links

- [History of changes](https://github.com/PeterNaydenov/visual-controller-for-preact/blob/master/Changelog.md)
- [License](https://github.com/PeterNaydenov/visual-controller-for-preact/blob/master/LICENSE)



## Credits
'visual-controller-for-preact' is created and supported by Peter Naydenov



## License

'visual-controller-for-preact' is released under the [MIT license](https://github.com/PeterNaydenov/visual-controller-for-preact/blob/master/LICENSE)