// test .controller.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: MIT

import React, {useState, useEffect, useRef, useCallback} from 'react'

import Scroller from 'react-infinite-grid-scroller'

import TestOptions from './testoptions'

import NestedBox from './testlistbox'

import TestScroller from './testscrolling'

const teststring = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Urna id volutpat lacus laoreet non curabitur gravida arcu. Arcu odio ut sem nulla pharetra diam. Amet facilisis magna etiam tempor orci eu. Consequat mauris nunc congue nisi vitae suscipit. Est ultricies integer quis auctor elit. Tellus in hac habitasse platea dictumst vestibulum rhoncus est. Purus non enim praesent elementum facilisis leo. At volutpat diam ut venenatis. Porttitor leo a diam sollicitudin tempor id eu nisl nunc. Sed elementum tempus egestas sed sed risus pretium quam. Tristique risus nec feugiat in fermentum. Sem fringilla ut morbi tincidunt. Malesuada nunc vel risus commodo. Nulla pellentesque dignissim enim sit amet venenatis urna cursus. In egestas erat imperdiet sed euismod nisi porta.'

/*
    Add scrollblockview as strategy to deal with variable cells.
    possibly scrollblockreference as scrollbase with even dimension values per list item reference
    add pausescrollresponses control variable
    layout:'uniform' and 'dynamic'

    create displayblock and displaycradle as the ui 
        - maps to scrollblock and cradle through referenceIndex

*/

const Placeholder = (props) => {
    return <div>SOMETHING</div>
} 

const getGenericItem = (index) => {

     // return <GenericItem index = {index} image = {'https://loremflickr.com/200/300?random='+index}/>
     return <GenericItem index = {index} />

}

const getNestedItem = (index) => {

    return <NestedBox 
        index = {index} 
        childorientation = {demos.nested.childorientation} 
        setlistsize = {demos.nested.listSize}
        scrollerData = {null}
    />

}

const getVariableItem = (index) => {

     return <VariableItem index = {index} />    

}

const genericstyle = {
                position:'absolute',
                top:0,
                left:0,
                padding:'3px',
                opacity:.5,
                borderRadius:'8px',
                backgroundColor:'white', 
                margin:'3px'
            } as React.CSSProperties

const GenericItem = (props) => {

    return <div style = {{position:'relative',height:'100%', width:'100%',backgroundColor:'white'}}>
        <div style = {genericstyle}>
            {props.index + 1}{false && <img style= {{height:'100%'}} src={props.image}/>}
        </div>
    </div>

}

const variablestyles = {
    outer:{position:'relative',height:'100%', width:'100%',backgroundColor:'white'},
    inner:{
                position:'absolute',
                top:0,
                left:0,
                padding:'3px',
                opacity:.5,
                borderRadius:'8px',
                backgroundColor:'white', 
                margin:'3px'
            }
}

let teststrings = []

let getTestString = (index) => {
    // console.log('getTestString',index)
    if (!teststrings[index]) {
        teststrings[index] =`${index + 1}: 'test string ' + ${teststring.substr(0,Math.random() * teststring.length)}`
    }
    return teststrings[index]
}

const VariableItem = (props) => {
    return <div style = {variablestyles.outer as React.CSSProperties}>
        <div style = {variablestyles.inner as React.CSSProperties}>{getTestString(props.index)}</div>
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
        height:'160px',
        overflow:'auto',
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

const reportReferenceIndex = (index, reason, cradlestate) => {

    console.log('reporting reference index', index, reason, cradlestate)

}
 
const demos = {
    generic: {
        gap:5,
        padding:10,
        cellHeight:150,
        cellWidth:150,
        runwaySize:4,
        indexOffset:0,
        listSize:400,
        getItem:getGenericItem,
        placeholder:null,
        styles: genericcomponentstyles,
        functions: {
            getCallbacks:null,
            reportReferenceIndex:null,
        },
        // layout: {
        //     name:'uniform'
        // },
        layout: 'uniform',
        scrollerName:'GENERIC',
    },
    nested: {
        childorientation:'horizontal',
        gap:5,
        padding:5,
        cellHeight:400,
        cellWidth:250,
        runwaySize:3,
        indexOffset:0,
        listSize:6000,
        getItem:getNestedItem,
        placeholder:null,
        styles: genericcomponentstyles,
        functions: {
            getCallbacks:null,
            reportReferenceIndex:null,
        },
        // layout:{
        //     name:'uniform'
        // },
        layout:'uniform',
        scrollerName:'OUTER',
    },
    variable: {
        gap:10,
        padding:10,
        cellHeight:100,
        cellWidth:250,
        runwaySize:6,
        indexOffset:0,
        listSize:300,
        getItem:getVariableItem,
        placeholder:null,
        styles: genericcomponentstyles,
        functions: {
            getCallbacks:null,
            referenceIndexCallback:null,
        },
        // layout:{
        //     name:'variable'
        // },
        layout:'uniform',
        scrollerName: 'VARIABLE',
    },
}

const Test = (props) => {

    // console.log('running Test Component', props)

    let [orientation, setOrientation] = useState('vertical')

    let [demo, setDemo] = useState('generic')

    let demoselection = demos[demo]

    const callbacksRef = useRef(null)

    const getCallbacks = useCallback(callbacks => {
        callbacksRef.current = callbacks
    },[])

    let {
        gap,
        padding,
        cellHeight,
        cellWidth,
        runwaySize,
        indexOffset,
        listSize,
        getItem,
        placeholder,
        styles,
        functions:inheritedfunctions,
        layout,
        scrollerName,
        
    } = demoselection

    const functions = Object.assign({},inheritedfunctions)

    functions.getCallbacks = getCallbacks

    const handleOrientation = (orientation) => {
        setOrientation(orientation)
        demos.nested.childorientation = (orientation == 'vertical')?'horizontal':'vertical'
    }

    const handleDemo = (demo) => {
        setDemo(demo)
    }

    const handleClearCache = () => {

        callbacksRef.current?.clearCache()        
    }
    
    const handleScrollToPos = (pos) => {
        callbacksRef.current?.scrollToItem(pos)
    }

    // const handleGetVisible = () => {
    //     console.log('VISIBLE',callbacksRef.current,callbacksRef.current?.getVisibleList())
    // }

    // const handleGetContent = () => {
    //     console.log('CONTENT',callbacksRef.current?.getContentList())
    // }

    const handleReload = () => {
        // console.log('calling reload callback from test controller', callbacksRef)
        callbacksRef.current?.reload()
    }

    let democallbacks = {
        orientationcallback:handleOrientation,
        democallback:handleDemo,
        scrolltoposcallback:handleScrollToPos,
        clearcachecallback:handleClearCache,
        // scrolltogocallback:handleScrollGo,
        // alignmentcallback:handleAlignment,
        // getvisiblecallback:handleGetVisible,
        // getcontentcallback:handleGetContent,
        reloadcallback:handleReload
    }

    return <>
        <div style = {uistyles.optionswrapper as React.CSSProperties} >
            <TestOptions callbacks = { democallbacks }/>
        </div>
        <div style = {
            uistyles.framewrapper as React.CSSProperties
        }>
            <div style = {
                uistyles.viewportframe as React.CSSProperties
            }                     
                data-type = 'viewportframe'
>
                <Scroller 
                    orientation = { orientation } 
                    gap = { gap }
                    padding = { padding }
                    cellHeight = { cellHeight }
                    cellWidth = { cellWidth }
                    runwaySize = { runwaySize }
                    indexOffset = { indexOffset }
                    listSize = { listSize }
                    getItem = { getItem }
                    placeholder = { placeholder }
                    styles = { styles }
                    functions = { functions }
                    layout = { layout }
                    scrollerName = { scrollerName }

                />
            </div>
        </div>
    </>
}

export default Test

