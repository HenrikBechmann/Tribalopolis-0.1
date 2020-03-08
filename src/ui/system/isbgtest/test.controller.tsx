// build.controller.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: MIT

import React, {useState, useRef} from 'react'

import InfiniteScroller from '../../common/infinitescrollbygrid/infinitescrollbygrid'
import TestOptions from './testoptions'

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
        <img src = {props.image} style = {{objectFit:'cover'}}/>
    </div>
}

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

    let componentRef = useRef({
        scrollToItem:null,
        elements:{
            viewportRef:null,
            scrollblockRef:null,
            cradleRef:null,
        },
        items:{
            contentRef:null,
            visibleRef:null,
        }
    })

    // console.log('componentRef',componentRef)

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
                    offset = {1000}
                    listsize = {10000}
                    getItem = {getItem}
                    placeholder = {null}
                    styles = {{
                        viewport:null,
                        scrollblock:null,
                        cradle:null,
                    }}
                    component = {componentRef.current}
                />
            </div>
        </div>
        </>
}

export default Home

