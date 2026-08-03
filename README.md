# Visual Controller for Preact

![version](https://img.shields.io/github/package-json/v/PeterNaydenov/visual-controller-for-preact)
![license](https://img.shields.io/github/license/PeterNaydenov/visual-controller-for-preact)
![npm downloads](https://img.shields.io/npm/dw/@peter.naydenov/visual-controller-for-preact)
![bundle size](https://img.shields.io/bundlephobia/minzip/@peter.naydenov/visual-controller-for-preact)

Run multiple Preact apps on the same page from a single controller. Each app gets its own region defined by invisible markers — no app container ids, no authored wrapper elements, and no collisions between regions.

```js
import VisualController from '@peter.naydenov/visual-controller-for-preact'
import HeaderApp from './apps/header.jsx'
import SidebarApp from './apps/sidebar.jsx'
import CartApp from './apps/cart.jsx'

const html = new VisualController({})

html.set(({ start, end }) => {
    document.querySelector('header').append(start, end)
    return 'header'
})

html.set(({ start, end }) => {
    document.querySelector('aside').append(start, end)
    return 'sidebar'
})

html.set(({ start, end }) => {
    document.querySelector('main').append(start, end)
    return 'cart'
})

html.publish('header', HeaderApp)
html.publish('sidebar', SidebarApp)
html.publish('cart', CartApp)
```

Each `publish` is independent. Apps can be added, removed, swapped, or destroyed at runtime. Each Preact app receives the same shared dependencies through its props.

> **Region-based API.** The id-based API from older releases is replaced by `set` regions and alias-first `publish` calls. See [Migration from the id-based API](#migration-from-the-id-based-api) when upgrading.


## Why use this

Most pages need more than one Preact app — a header from one team, a sidebar from another, and a checkout widget from a third. The challenge is coordinating them without coupling the applications to DOM ids or to one another.

The marker model keeps the integration simple. Instead of authoring `<div id="app">` and passing its id to the controller, place invisible markers directly in the DOM and give the region an alias:

```js
html.set(({ start, end }) => {
    document.querySelector('#main').append(start, end)
    return 'app'
})

html.publish('app', MyComponent, { greeting: 'Hi!' })
```

The controller owns the mount location. Regions can share a parent, aliases remain stable while apps are swapped, and the mount container is an internal implementation detail.

The dynamic lifecycle is the other half:

```js
html.publish('header', HeaderApp)
html.publish('header', PromoBannerApp)
html.destroy('header')
html.publish('header', HeaderApp)
```

Destroying an app removes its rendered content but keeps the region markers, so the same alias can host another app later.


## Quick start

```bash
npm install
```

```js
import VisualController from '@peter.naydenov/visual-controller-for-preact'
import HeaderApp from './header.jsx'
import SidebarApp from './sidebar.jsx'

const html = new VisualController({})

html.set(({ start, end }) => {
    document.querySelector('#main').append(start, end)
    return 'header'
})

html.set(({ start, end }) => {
    document.querySelector('#main').append(start, end)
    return 'sidebar'
})

html.publish('header', HeaderApp, { greeting: 'Hi!' })
html.publish('sidebar', SidebarApp)
```

```html
<main id="main">
    <h2>Static page heading</h2>
</main>
```

The same parent hosts two regions without app-container ids. The controller selects each region by the alias returned from `set`.

The marker model is a slim inlined subset of [`@peter.naydenov/dim`](https://github.com/PeterNaydenov/dim), stored in `src/dim.js`. The dim package is not required at runtime.


## API

```js
  set     : 'Define a region by placing markers in the DOM'
, publish : 'Mount a Preact app into a region by alias'
, destroy : 'Unmount the app or apps and keep the markers'
, has     : 'Check whether an app is published in a region'
, getApp  : 'Return the setupUpdates interface for a published app'
, isEmpty : 'Check whether a region has no content'
, list    : 'Return every alias registered via set'
, reset   : 'Unmount all apps, clear state, and remove markers'
```


### `html.set(fn, ...args)`

Define a region. The callback receives `{ start, end }` text-node markers and must attach both markers to the DOM. Whatever string the callback returns becomes the alias used by the other methods.

```js
html.set(({ start, end }) => {
    document.querySelector('#main').append(start, end)
    return 'header'
})
```

Additional arguments are forwarded to the callback:

```js
html.set(({ start, end }, locale) => {
    document.querySelector('#main').append(start, end)
    return `header-${locale}`
}, 'en')
```

The markers can be placed anywhere they can be inserted into the DOM. Multiple regions can live inside the same parent. They remain in place until `reset()` or until their parent is removed.


### `html.publish(alias, component, data?, extraParams?)`

Mount a Preact app into a region. The controller inserts a `<span style="display:contents">` between the markers and mounts the component into it.

| Arg | Required | Default | Description |
| --- | --- | --- | --- |
| `alias` | yes | — | Region alias returned from `set`. |
| `component` | yes | — | A Preact component. |
| `data` | no | `{}` | Data passed to the component as `props.data`. |
| `extraParams` | no | `{}` | Reserved for future use. Accepted and ignored. |

Returns a `Promise` resolving to the object registered with `setupUpdates`, or `false` on error.

```js
html.publish('header', HeaderApp)
html.publish('header', HeaderApp, { greeting: 'Hi!' })
html.publish('header', HeaderApp, { greeting: 'Hi!' }, {})
```

Calling `publish` for an alias that already has an app destroys the old app first, then mounts the new component in the same region.


### `html.destroy(target?)`

Unmount the app published in a region and empty the range. The markers stay in the DOM, so the alias can be published again later.

```js
html.destroy('header')
html.destroy()
html.destroy(['header', 'sidebar'])
```

The return values are:

- `destroy(alias)` returns `true` when an app was destroyed and `false` when no app was published for that alias.
- `destroy()` destroys every published app and returns the number destroyed.
- `destroy(aliases)` destroys the listed apps, skips missing aliases, and returns the number destroyed.

**What `destroy()` touches:** the Preact app, its internal mount span, and the controller cache entry.

**What `destroy()` does not touch:** the region markers, the alias in `list()`, or the internal region registry.

Use `reset()` for a full cleanup that also removes the markers.


### `html.has(alias)`

Return `true` when an app is currently published in the region and `false` otherwise. A declared but empty region returns `false`.

```js
html.has('header')
```


### `html.getApp(alias)`

Return the object provided to `setupUpdates` by the published component, or `false` when no app is published for the alias.

```js
const app = html.getApp('header')

if (app && app.changeMessage) {
    app.changeMessage('New value')
}
```


### `html.isEmpty(alias)`

Check whether a region has no content between its markers. Returns `true` for an empty or orphaned region, `false` after an app has been published, and `undefined` for an unknown alias. Unknown aliases also log an error.

```js
html.isEmpty('header')
```

After `destroy`, the markers remain and the region is empty again.


### `html.list()`

Return every alias registered via `set`, regardless of whether an app is currently published. The list is cleared by `reset()`.

```js
html.list()
```


### `html.reset()`

Unmount every published app, clear the controller state, and remove every marker from the DOM. After `reset()`, the aliases are gone and the regions must be created again with `set()` before publishing.

```js
html.reset()
```


## Inside a component

A component receives three controller props:

- `dependencies` contains the object passed to `new VisualController(dependencies)`.
- `data` contains the optional data object passed to `publish`.
- `setupUpdates` registers methods that can later be called through `getApp`.

```js
import { h } from 'preact'
import { useState } from 'preact/hooks'

function HeaderApp ( props ) {
    const
          { dependencies, data = {}, setupUpdates } = props
        , [ message, setMessage ] = useState ( data.greeting || 'Hello from Preact!' )
        , [ count, setCount ] = useState ( 0 )
        ;

    function changeMessage ( newMessage ) {
        setMessage ( newMessage )
    }

    function increment () {
        setCount ( current => current + 1 )
    }

    function getCount () {
        return count
    }

    setupUpdates ({ changeMessage, increment, getCount })

    return h ( 'div', null,
              h ( 'h2', null, message )
            , h ( 'p', null, `Count: ${count}` )
            , h ( 'button', { onClick: increment }, 'Increment' )
        )
}
```

`dependencies` is available to the component when shared services are needed:

```js
const dependencies = { store, api, eventBus }
const html = new VisualController ( dependencies )
```

External access goes through the region alias:

```js
const updates = html.getApp('header')

if (updates) {
    updates.changeMessage('New message content')
    updates.increment()
    updates.getCount()
}
```


## Other details

### SSR hydration

When a region already contains HTML, `publish` detects the existing content and uses Preact's `hydrate` API. No additional controller configuration is needed.

The controller handles three cases:

- **Empty range** — inserts a `<span style="display:contents">` and mounts with `render`.
- **Single element between markers** — mounts directly to that element with `hydrate`.
- **Multiple sibling nodes between markers** — wraps them in a mount span and hydrates the wrapper.

If the server-rendered markup does not match the component output, Preact reports the normal hydration mismatch behavior.


### Custom elements

Preact renders custom elements without a controller-specific flag. Use the custom element tag in a component as usual:

```js
h('profile-card', { userId: '42' })
```


## Development

Setup and common commands:

```bash
npm install
npm test         # run the test suite once
npm run cover    # run coverage once
npm run types    # regenerate dist/main.d.ts from JSDoc
npm run build    # build and regenerate types
npm run dev      # run the demo at http://localhost:5173/
```

Source layout:

| Path | Purpose |
| --- | --- |
| `src/main.js` | The Preact controller and public API. |
| `src/dim.js` | Slim inlined subset of the dim marker model. |
| `test/01_general.test.jsx` | Controller test suite. |
| `demo/app.jsx` | Header and Sidebar Preact demo apps. |
| `demo/main.jsx` | Demo regions, publishing, swapping, and controls. |
| `index.html` | Entry point for `npm run dev`. |
| `dist/` | Build artifacts used for package publishing. |

#### Adding a new method

1. Add the function to `src/main.js` with JSDoc.
2. Export it from the return object at the bottom of `src/main.js`.
3. Add it to the `VisualControllerInstance` typedef near the top of the file.
4. Add tests in `test/01_general.test.jsx`.
5. Update the README API table and method section.
6. Add a bullet to `Changelog.md` under the current version.

#### Keeping the inlined dim subset in sync

The dim marker model is owned by the official [`@peter.naydenov/dim`](https://github.com/PeterNaydenov/dim) package. If its API changes, compare `src/dim.js` with the upstream implementation and update the subset used by this controller. The controller uses `set`, `get`, `reset`, `aliases`, and the range's `isEmpty` method.


## Migration from the id-based API

Older releases mounted an app by looking up a DOM id:

```js
html.publish(Hello, { greeting: 'Hi!' }, 'app')
html.destroy('app')
html.has('app')
html.getApp('app')
```

The region-based API declares the location first and passes the alias first to `publish`:

```js
html.set(({ start, end }) => {
    document.querySelector('#main').append(start, end)
    return 'app'
})

html.publish('app', Hello, { greeting: 'Hi!' })
html.destroy('app')
html.has('app')
html.getApp('app')
```

The migration changes are:

- Add one `set` call for every mount location.
- Attach both markers in the `set` callback.
- Return a string alias from the callback.
- Change `publish(component, data, id)` to `publish(alias, component, data?, extraParams?)`.
- Use aliases instead of container ids with `destroy`, `has`, and `getApp`.
- Use `isEmpty`, `list`, and `reset` for region inspection and cleanup.
- Remember that `destroy` keeps markers and `reset` removes them.


## Extra

Visual Controller has versions for other front-end frameworks:

- [Vue 3](https://github.com/PeterNaydenov/visual-controller-for-vue3)
- [React](https://github.com/PeterNaydenov/visual-controller-for-react)
- [Svelte 5](https://github.com/PeterNaydenov/visual-controller-for-svelte5)
- [Solid](https://github.com/PeterNaydenov/visual-controller-for-solid)
- [Lit](https://github.com/PeterNaydenov/visual-controller-for-lit)
- [Vue 2](https://github.com/PeterNaydenov/visual-controller-for-vue)
- [Svelte 3 and 4](https://github.com/PeterNaydenov/visual-controller-for-svelte3)


## Credits

Visual Controller for Preact is created and supported by Peter Naydenov.


## License

Released under the [MIT License](https://github.com/PeterNaydenov/visual-controller-for-preact/blob/master/LICENSE).
