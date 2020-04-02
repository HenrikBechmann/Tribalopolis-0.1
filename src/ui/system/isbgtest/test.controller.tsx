// test .controller.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: MIT

import React, {useState, useRef} from 'react'

import Scroller from 'react-infinite-grid-scroller'

import TestOptions from './testoptions'

import NestedBox from './testlistbox'

/*

    BUGS
    - going from large to small leaves blue box in one of the list cells --
        - the one that had generated a cradle displacement bug
        - that bug results in cradle top position setting that is
            out of sync with cradle position. That leaves dead space
            at top or botton, or orphans one of the lead item
        - it all seems related to timing (onScroll?) as it relates to inaccurate setting
            of cradle offset. Solution is explexit calc of cradle position?
    - rapid scroll of nested list (small item size)

    - check nested element structure; one block has a height of 0
    - test promises for items

    - review resize (nested)
    - test https://www.npmjs.com/package/react-virtualized-auto-sizer
        add generator parameter to reset for contextual changes

    - change opacity as content comes into view?

    - create list of backlog candidates

    2 add examples 1, 2 to control page: 
        - generic, scroll, resize and pivot
        - nested lists, rapid reposition

    1 qa

*/

const Placeholder = (props) => {
    return <div>SOMETHING</div>
} 

const getGenericItem = (index) => {
     
     return <GenericItem index = {index} image = {'https://loremflickr.com/200/300?random='+index}/>

}

const getNestedItem = (index) => {

    return <NestedBox index = {index} childorientation = {demos.nested.childorientation} setlistsize = {demos.nested.listsize}/>

}

const GenericItem = (props) => {
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

const genericcomponentstyles = {
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
 
const demos = {
    generic: {
        gap:5,
        padding:5,
        cellHeight:200,
        cellWidth:150,
        runway:3,
        offset:0,
        listsize:10000,
        getItem:getGenericItem,
        placeholder:null,
        styles: genericcomponentstyles,
        component: {
            scrollToItem:null,
            getContentList:null,
            getVisibleList:null,
            reload:null,
            reportReferenceIndex:null,
        }
    },
    nested: {
        childorientation:'horizontal',
        gap:5,
        padding:5,
        cellHeight:400,
        cellWidth:300,
        runway:2,
        offset:0,
        listsize:6000,
        getItem:getNestedItem,
        placeholder:null,
        styles: genericcomponentstyles,
        component: {
            scrollToItem:null,
            getContentList:null,
            getVisibleList:null,
            reload:null,
            reportReferenceIndex:null,
        }
    }
}

const Test = (props) => {
    let [orientation, setOrientation] = useState('vertical')

    let [demo, setDemo] = useState('generic')

    let demoselection = demos[demo]

    // console.log('demo selection',demoselection)

    const handleOrientation = (orientation) => {
        setOrientation(orientation)
        demos.nested.childorientation = (orientation == 'vertical')?'horizontal':'vertical'
    }

    const handleDemo = (demo) => {
        setDemo(demo)
    }
    
    const handleScrollToPos = (pos) => {

    }

    const handleScrollGo = () => {

    }

    const handleAlignment = () => {

    }
    let democallbacks = {
        orientationcallback:handleOrientation,
        democallback:handleDemo,
        scrolltoposcallback:handleScrollToPos,
        scrolltogocallback:handleScrollGo,
        alignmentcallback:handleAlignment,
    }

    let {
        gap,
        padding,
        cellHeight,
        cellWidth,
        runway,
        offset,
        listsize,
        getItem,
        placeholder,
        styles,
        component,
    } = demoselection

    return <>
        <div style = {uistyles.optionswrapper as React.CSSProperties} >
            <TestOptions callbacks = { democallbacks }/>
        </div>
        <div style = {
            uistyles.framewrapper as React.CSSProperties
        }>
            <div style = {
                uistyles.viewportframe as React.CSSProperties
            }>
                <Scroller 
                    orientation = { orientation } 
                    gap = { gap }
                    padding = { padding }
                    cellHeight = { cellHeight }
                    cellWidth = { cellWidth }
                    runway = { runway }
                    offset = { offset }
                    listsize = { listsize }
                    getItem = { getItem }
                    placeholder = { placeholder }
                    styles = { styles }
                    component = { component }
                />
            </div>
        </div>
    </>
}

export default Test

