'use strict'

import * as React from 'react'

// import configureStore from '../utilities/configurestore'

// import Base from './base'

import {store, history} from './globaldataconfig.utility'

let state:any = store.getState() // get font-family for non material-ui components
// let fontFamily = state.resources.theme.fontFamily

import { Provider } from 'react-redux'

import { DragDropContext } from 'react-dnd'
import DnDHTMLBackend from 'react-dnd-html5-backend'
import DnDTouchBackend from 'react-dnd-touch-backend'

let DnDBackend = DnDTouchBackend({ enableMouseEvents: true })

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

const muiTheme = getMuiTheme()

import MainView from './main.view'

class Main extends React.Component<any,any> { 

    render() {
        let { globalmessage, version } = this.props

        return (
            <Provider store={ store }>
                <MuiThemeProvider muiTheme = {muiTheme}>
                    <MainView history = {history} globalmessage={globalmessage} />
                </MuiThemeProvider>
            </Provider>
        )
    }
}

export default DragDropContext(DnDBackend)(Main)
// export default Main

