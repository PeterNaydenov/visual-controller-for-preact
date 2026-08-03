import VisualController from '/src/main.js'
import { Header, Sidebar } from '/demo/app.jsx'

const
      html               = new VisualController ( {})
    , main               = document.getElementById ( 'main' )
    , updateHeaderBtn    = document.getElementById ( 'updateHeader' )
    , incrementBtn       = document.getElementById ( 'incrementHeader' )
    , swapBtn            = document.getElementById ( 'swapApps' )
    , destroyHeaderBtn   = document.getElementById ( 'destroyHeader' )
    , destroySidebarBtn  = document.getElementById ( 'destroySidebar' )
    , resetBtn           = document.getElementById ( 'resetAll' )
    , resultText         = document.getElementById ( 'resultText' )
    , aliasesList        = document.getElementById ( 'aliasesList' )
    ;


function refreshAliases () {
        aliasesList.textContent = html.list ().join ( ', ' ) || '-'
    }


function publishApps ( headerApp, sidebarApp ) {
        return Promise.all ([
                html.publish ( 'header', headerApp, headerApp === Sidebar ? { title: 'Items' } : {} )
              , html.publish ( 'sidebar', sidebarApp, sidebarApp === Sidebar ? { title: 'Items' } : {} )
            ])
            .then ( () => refreshAliases () )
    }


html.set ( ({ start, end }) => {
        main.append ( start, end )
        return 'header'
    })

html.set ( ({ start, end }) => {
        main.append ( start, end )
        return 'sidebar'
    })

refreshAliases ()

publishApps ( Header, Sidebar )
    .then ( () => {
            resultText.textContent = 'Header and sidebar published'
        })


updateHeaderBtn.addEventListener ( 'click', () => {
        const app = html.getApp ( 'header' )
        if ( app && app.changeMessage ) {
                app.changeMessage ( `Header updated at ${new Date().toLocaleTimeString()}` )
            }
    })


incrementBtn.addEventListener ( 'click', () => {
        const app = html.getApp ( 'header' )
        if ( app && app.increment )   app.increment ()
    })


let swapped = false
swapBtn.addEventListener ( 'click', () => {
        swapped = !swapped
        const [ headerApp, sidebarApp ] = swapped
                ? [ Sidebar, Header ]
                : [ Header, Sidebar ]
        publishApps ( headerApp, sidebarApp )
        resultText.textContent = swapped
                ? 'Swapped: header and sidebar exchanged apps'
                : 'Restored: header and sidebar back to initial apps'
    })


destroyHeaderBtn.addEventListener ( 'click', () => {
        const ok = html.destroy ( 'header' )
        resultText.textContent = 'Destroy header: ' + ok
        refreshAliases ()
    })


destroySidebarBtn.addEventListener ( 'click', () => {
        const ok = html.destroy ( 'sidebar' )
        resultText.textContent = 'Destroy sidebar: ' + ok
        refreshAliases ()
    })


resetBtn.addEventListener ( 'click', () => {
        html.reset ()
        resultText.textContent = 'Reset all'
        refreshAliases ()
    })
