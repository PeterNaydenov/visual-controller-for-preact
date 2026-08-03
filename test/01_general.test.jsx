import { describe, it, expect, beforeEach, vi } from 'vitest'
import { h } from 'preact'
import { JSDOM } from 'jsdom'
import VisualController from '../src/main.js'
import App from './App.jsx'

const dom = new JSDOM('<!DOCTYPE html><html><body><main id="main"></main></body></html>')
global.document = dom.window.document
global.window = dom.window
global.navigator = dom.window.navigator


const tick = () => new Promise(resolve => setTimeout(resolve, 0))
const resetAll = () => {
    document.body.innerHTML = '<main id="main"></main>'
    let main = document.querySelector('#main')
    if (!main) {
        main = document.createElement('main')
        main.id = 'main'
        document.body.appendChild(main)
    }
    main.innerHTML = ''
}


describe('Visual Controller for Preact — v3 region API', () => {

    let html

    beforeEach(() => {
        resetAll()
        html = new VisualController({})
    })

    it('set registers a region and adds the alias to list()', () => {
        html.set(({ start, end }) => {
            document.querySelector('#main').append(start, end)
            return 'header'
        })
        expect(html.list()).toContain('header')
    })

    it('publish mounts an app into a declared alias', async () => {
        html.set(({ start, end }) => {
            document.querySelector('#main').append(start, end)
            return 'header'
        })
        await html.publish('header', App)
        expect(html.has('header')).toBe(true)
    })

    it('publish into undeclared alias resolves to false and logs', async () => {
        const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        const result = await html.publish('nope', App)
        expect(result).toBe(false)
        expect(errSpy).toHaveBeenCalled()
        errSpy.mockRestore()
    })

    it('publish with no component resolves to false and logs', async () => {
        html.set(({ start, end }) => {
            document.querySelector('#main').append(start, end)
            return 'header'
        })
        const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        const result = await html.publish('header', undefined)
        expect(result).toBe(false)
        errSpy.mockRestore()
    })

    it('republish destroys the first app and mounts the second', async () => {
        html.set(({ start, end }) => {
            document.querySelector('#main').append(start, end)
            return 'header'
        })
        await html.publish('header', App)
        const app1 = html.getApp('header')
        await html.publish('header', App)
        const app2 = html.getApp('header')
        expect(app1).not.toBe(app2)
        expect(html.has('header')).toBe(true)
    })

    it('destroy empties the range, has() becomes false, alias stays in list()', async () => {
        html.set(({ start, end }) => {
            document.querySelector('#main').append(start, end)
            return 'header'
        })
        await html.publish('header', App)
        expect(html.has('header')).toBe(true)
        expect(html.destroy('header')).toBe(true)
        expect(html.has('header')).toBe(false)
        expect(html.list()).toContain('header')
    })

    it('destroy on an unknown alias returns false', () => {
        expect(html.destroy('never-published')).toBe(false)
    })

    it('getApp returns the setupUpdates interface', async () => {
        html.set(({ start, end }) => {
            document.querySelector('#main').append(start, end)
            return 'header'
        })
        await html.publish('header', App)
        const app = html.getApp('header')
        expect(typeof app).toBe('object')
    })

    it('getApp on missing alias returns false and logs', () => {
        const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        expect(html.getApp('never')).toBe(false)
        expect(errSpy).toHaveBeenCalled()
        errSpy.mockRestore()
    })

    it('supports multiple regions in the same parent', async () => {
        const main = document.querySelector('#main')
        html.set(({ start, end }) => { main.append(start, end); return 'header' })
        html.set(({ start, end }) => { main.append(start, end); return 'sidebar' })
        expect(html.list()).toEqual(expect.arrayContaining(['header', 'sidebar']))
        await html.publish('header', App)
        await html.publish('sidebar', App)
        expect(html.has('header')).toBe(true)
        expect(html.has('sidebar')).toBe(true)
        const spans = Array.from(main.querySelectorAll('span')).filter(s => s.style.display === 'contents')
        expect(spans.length).toBe(2)
    })

    it('orphaned markers (parent removed) make publish resolve to false', async () => {
        html.set(({ start, end }) => {
            document.querySelector('#main').append(start, end)
            return 'header'
        })
        document.querySelector('#main').remove()
        const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        const result = await html.publish('header', App)
        expect(result).toBe(false)
        errSpy.mockRestore()
    })

    it('reset unmounts all apps and clears list()', async () => {
        const main = document.querySelector('#main')
        html.set(({ start, end }) => { main.append(start, end); return 'header' })
        html.set(({ start, end }) => { main.append(start, end); return 'sidebar' })
        await html.publish('header', App)
        await html.publish('sidebar', App)
        expect(html.list().length).toBe(2)

        html.reset()
        expect(html.list().length).toBe(0)
        expect(html.has('header')).toBe(false)
        expect(html.has('sidebar')).toBe(false)
        const remaining = Array.from(main.querySelectorAll('span')).filter(s => s.style.display === 'contents')
        expect(remaining.length).toBe(0)
    })

    it('destroy() with no args destroys every published app and returns the count', async () => {
        const main = document.querySelector('#main')
        html.set(({ start, end }) => { main.append(start, end); return 'header' })
        html.set(({ start, end }) => { main.append(start, end); return 'sidebar' })
        await html.publish('header', App)
        await html.publish('sidebar', App)
        const count = html.destroy()
        expect(count).toBe(2)
        expect(html.has('header')).toBe(false)
        expect(html.has('sidebar')).toBe(false)
    })

    it('isEmpty returns true for an empty region and false after publish', async () => {
        html.set(({ start, end }) => {
            document.querySelector('#main').append(start, end)
            return 'header'
        })
        expect(html.isEmpty('header')).toBe(true)
        await html.publish('header', App)
        expect(html.isEmpty('header')).toBe(false)
    })

    it('isEmpty returns undefined and logs for an unknown alias', () => {
        const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        expect(html.isEmpty('nope')).toBe(undefined)
        expect(errSpy).toHaveBeenCalled()
        errSpy.mockRestore()
    })
})
