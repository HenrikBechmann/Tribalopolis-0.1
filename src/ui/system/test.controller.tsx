// build.controller.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

import Scroller from '../common/simplescroller'
    
class Home extends React.Component<any,any> {

    render() {
        return (
            <div style = {{position:'relative'}}>
                <div style = {{padding:'8px'}} >
                    TEST
                </div>
                <div style = {
                    {
                        height:'150px',
                        right:0, 
                        left:0,
                        position:'absolute', 
                        margin:'10px', 
                        border:'1px solid black'
                    }
                }>
                    <Scroller direction = 'vertical'/>
                </div>
            </div>
        )
    }
}

export default Home