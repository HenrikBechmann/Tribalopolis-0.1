// build.controller.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: MIT

import React, {useState} from 'react'

import InfiniteScroller from '../../common/infinitescrollbygrid/infinitescrollbygrid'
import TestOptions from './testoptions'

const styles = {
    viewportframe: {
        top:0,
        bottom:0,
        right:0, 
        left:0,
        position:'absolute', 
        margin:'10px', 
        border:'1px solid black'
    },
    framewrapper: {
        position:'relative',
        height:'500px',
    },
    optionswrapper: {
        padding:'8px',
    },
}
    
const Home = (props) => {
    let [orientation, setOrientation] = useState('vertical')

    const handleOrientationCallback = (orientation) => {
        setOrientation(orientation)
    }

    return <>
        <div style = {styles.optionswrapper as React.CSSProperties} >
            <TestOptions orientationCallback = { handleOrientationCallback }/>
        </div>
        <div style = {
            styles.framewrapper as React.CSSProperties
        }>
            <div style = {
                styles.viewportframe as React.CSSProperties
            }>
                <InfiniteScroller 
                    orientation = { orientation } 
                    gap = {5}
                    padding = {5}
                    cellHeight = {200}
                    cellWidth = {150}
                    runway = {3}
                    offset = {50}
                    listsize = {10000}
                />
            </div>
        </div>
        </>
}

export default Home

