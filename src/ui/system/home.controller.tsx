// build.controller.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

import StandardToolbar from '../common/standardtoolbar.view'

class Home extends React.Component<any,any> {

    render() {
        return (
            <div>
            <StandardToolbar />
            <div style = {{padding:'8px'}} >
                <p>Tribalopolis is a virtual city of tribes. A place to get organized, collaborate, run projects, and keep records.</p>
                <p>Build the future!</p>
                <p>Please note this is just a pre-alpha prototype. In other words, it's not yet functional. But we're working on it.</p>
            </div>
            </div>
        )
    }
}

export default Home