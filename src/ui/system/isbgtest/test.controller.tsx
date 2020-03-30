// build.controller.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: MIT

import React, {useState, useRef} from 'react'

import InfiniteScroller from 'react-infinite-grid-scroller'
// import InfiniteScroller from '../../common/infinitegridscroller/infinitegridscroller'
import TestOptions from './testoptions'

/*

    3 add examples 1, 2, 3 to control page: 
        - images, scroll and pivot
        - nested lists, scroll and pivot

    2 qa

    1 npm module

*/

const getItem = (index) => {
     
     return <ImageItem index = {index} image = {'https://loremflickr.com/200/300?random='+index}/>

}

const Placeholder = (props) => {
    return <div>SOMETHING</div>
} 

const ImageItem = (props) => {
    return <div style = {{position:'relative',height:'100%', width:'100%',backgroundColor:'white'}}>
        <div style = {
            {
                position:'absolute',
                top:0,
                left:0,
                padding:'3px',
                opacity:.5,
                borderRadius:'8px',
                backgroundColor:'white', 
                margin:'3px'
            }
        }>{props.index + 1}</div>
        {/*<img src = {props.image} style = {{objectFit:'cover'}}/>*/}
    </div>
}

const uistyles = {
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

const componentstyles = {
    viewport:null,
    scrollblock:{
        backgroundColor:'brown',
    },
    cradle:{
        backgroundColor:'black',
    },
    scrolltracker:{
        backgroundColor:'cyan'
    }
}
    
const Test = (props) => {
    let [orientation, setOrientation] = useState('vertical')

    let [demo, setDemo] = useState('images')

    let componentRef = useRef({
        scrollToItem:null,
        getContentList:null,
        getVisibleList:null,
        reload:null,
        reportReferenceIndex:null,
    })

    const handleOrientationCallback = (orientation) => {
        setOrientation(orientation)
    }

    const handleDemoCallback = (demo) => {
        setDemo(demo)
    }

    return <>
        <div style = {uistyles.optionswrapper as React.CSSProperties} >
            <TestOptions orientationCallback = { handleOrientationCallback }/>
        </div>
        <div style = {
            uistyles.framewrapper as React.CSSProperties
        }>
            <div style = {
                uistyles.viewportframe as React.CSSProperties
            }>
                <InfiniteScroller 
                    orientation = { orientation } 
                    gap = {5}
                    padding = {5}
                    cellHeight = {200}
                    cellWidth = {150}
                    runway = {3}
                    offset = {0}
                    listsize = {10000}
                    getItem = {getItem}
                    placeholder = {null}
                    styles = { componentstyles }
                    component = { componentRef.current }
                />
            </div>
        </div>
    </>
}

export default Test

