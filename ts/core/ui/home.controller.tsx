// build.controller.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

import StandardToolbar from './common/standardtoolbar.view'

class Home extends React.Component<any,any> {

    render() {
        return (
            <div>
            <StandardToolbar />
            <p>Build the future!</p>
            <p>Please note this is just a pre-alpha prototype. In other words, it's not yet functional. But we're working on it.</p>
            </div>
        )
    }
}

export default Home