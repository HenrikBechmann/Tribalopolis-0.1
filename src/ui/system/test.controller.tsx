// build.controller.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React, {useState} from 'react'

import InfiniteScroll from '../common/iscrollbygrid'
import OrientationOptions from './test/testorientationoptions'
    
const Home = (props) => {
    let [orientation, setOrientation] = useState('vertical')

    const handleCallback = (orientation) => {
        setOrientation(orientation)
    }

    return <>
        <div style = {{padding:'8px'}} >
            <OrientationOptions callback = { handleCallback }/>
        </div>
        <div style = {{position:'relative',height:'300px'}}>
            <div style = {
                {
                    top:0,
                    bottom:0,
                    right:0, 
                    left:0,
                    position:'absolute', 
                    margin:'10px', 
                    border:'1px solid black'
                }
            }>
                <InfiniteScroll orientation = {orientation} />
            </div>
        </div>
        </>
}

export default Home

