import { describe, it, expect, beforeEach, vi } from 'vitest'
import { h, render, hydrate } from 'preact'
import { JSDOM } from 'jsdom'
import VisualController from '../src/main.js'
import App from './App.jsx'



const dom = new JSDOM('<!DOCTYPE html><html><body><div id="root"></div></body></html>')
global.document = dom.window.document
global.window = dom.window
global.navigator = dom.window.navigator



describe ( 'VisualController for Preact', () => {

  let containerId = 'test-container'

  beforeEach (() => {
    document.body.innerHTML = `<div id="${containerId}"></div>`
  })


  it ( 'Method "publish" returns a promise', () => { 
    const vc = new VisualController()
    const result = vc.publish (App, {}, containerId)
    expect (result.constructor.name).toBe ('Promise')
    vc.destroy (containerId)
  })


  it ( 'Publish component to a container', async () => {
    const vc = new VisualController()
    const promise = vc.publish (App, { greeting: 'test message' }, containerId)
    const updates = await promise
    expect (updates).toBeDefined ()
    expect (typeof updates).toBe ('object')
    const node = document.getElementById (containerId)
    expect (node.innerHTML).not.toBe ('')
    vc.destroy (containerId)
  })


  it ( 'Replaces existing component without calling destroy', async () => {
    const vc = new VisualController()

    await vc.publish (App, {}, containerId)
    const node = document.getElementById (containerId)
    const firstContent = node.innerHTML

    await vc.publish (App, {}, containerId)
    expect (node.innerHTML).not.toBe ('')
    vc.destroy (containerId)
  })


  it ( 'Destroy', async () => {
    const vc = new VisualController()
    const node = document.getElementById (containerId)
    await vc.publish (App, {}, containerId)
    expect (node.innerHTML).not.toBe ('')

    const destroyed = vc.destroy (containerId)
    expect (destroyed).toBe (true)
    expect (node.innerHTML).toBe ('')
  })


  it ( 'Fail to destroy non-existent app', () => {
    const vc = new VisualController()

    const result = vc.destroy ('non-existent-app')
    expect (result).toBe (false)
  })


  it ( 'Method "has"', async () => {
    const vc = new VisualController()
    await vc.publish (App, {}, containerId)
    const exists = vc.has (containerId)
    vc.destroy (containerId)
    const missing = vc.has (containerId)
    expect (exists).toBe (true)
    expect (missing).toBe (false)
  })


  it ( 'Test for non-existent app', () => {
    const vc = new VisualController()

    expect (vc.has ('non-existent')).toBe (false)
  })


  it ( 'Updates a published app', async () => {
    const vc = new VisualController()
    await vc.publish (App, {}, containerId)

    const updates = vc.getApp (containerId)
    expect (updates).toBeDefined ()
    expect (typeof updates).toBe ('object')
    expect (typeof updates.changeMessage).toBe ('function')
    expect (typeof updates.increment).toBe ('function')
    vc.destroy (containerId)
  })


  it ( 'Fail to get non-existent app', () => {
    const consoleSpy = vi.spyOn (console, 'error').mockImplementation (() => {})
    const vc = new VisualController ()

    const result = vc.getApp ('non-existent-app')

    expect (consoleSpy).toHaveBeenCalledWith ('App with id: "non-existent-app" was not found.')
    expect (result).toBe (false)
  })


  it ( 'Fails when Component is undefined', async () => {
    const consoleSpy = vi.spyOn (console, 'error').mockImplementation (() => {})
    const vc = new VisualController ()

    const result = vc.publish (undefined, {}, containerId)

    expect (consoleSpy).toHaveBeenCalledWith ('Error: Component is undefined')
    expect (result).toBe (false)
  })


  it ( 'Fails when container does not exist', async () => {
    const consoleSpy = vi.spyOn (console, 'error').mockImplementation (() => {})
    const vc = new VisualController ()

    const result = vc.publish (App, {}, 'non-existent-container')

    expect (consoleSpy).toHaveBeenCalledWith ('Can\'t find node with id: "non-existent-container"')
    expect (result).toBe (false)
  })


  it ( 'Dependencies', async () => {
    const testDep = { value: 42 }
    const vc = new VisualController ({ testDep })

    function TestComponent (props) {
      if (props.setupUpdates) {
        props.setupUpdates ({ getTestDep: () => props.dependencies.testDep })
      }
      return h('div', null, 'Test')
    }

    await vc.publish (TestComponent, {}, containerId)
    const result = vc.getApp (containerId).getTestDep ()
    expect (result).toEqual ({ value: 42 })
    vc.destroy (containerId)
  })


  it ( 'Supports SSR/hydrate', async () => {
    const node = document.getElementById (containerId)
    node.innerHTML = '<div><h1>Server Rendered</h1></div>'

    const vc = new VisualController ()
    await vc.publish (App, {}, containerId)

    const button = node.querySelector ('button')
    expect(button).not.toBeNull ()
    vc.destroy (containerId)
  })

})