// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
// main.controller.tsx

/*
    bootstrap:
    1. index.html
    2. index.tsx
    3. main.controller
    4. main.view
    5. approuter
    6. routes
*/

'use strict'

import * as React from 'react'

// TODO: temporary -- replace with application service
import coredata from  '../../data/coredata'

let fontFamily = coredata.theme.typography.fontFamily

import { DragDropContext } from 'react-dnd'
// import DnDHTMLBackend from 'react-dnd-html5-backend'
import DnDTouchBackend from 'react-dnd-touch-backend'

let DnDBackend = DnDTouchBackend({ enableMouseEvents: true })

import MainView from './main.view'

class Main extends React.Component<any,any> { 

    mainviewstyle:React.CSSProperties = {
        fontFamily,
    }

    render() {
        let { globalmessage, version } = this.props

        return (
            <MainView globalmessage={globalmessage}
                style = {this.mainviewstyle} 
            />
        )
    }
}

export default DragDropContext(DnDBackend)(Main)
