// test.controller.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: MIT

/*

    create checkbox for display user callbacks to console.

*/

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
     // if ((index == 130) || (index == 145)) console.log('getGenericItem returning index', index)
     // if (index == 130) return Promise.reject(new Error('not found'))
     // if (index == 145) return null
     return <GenericItem index = {index} />

}

const getNestedItem = (index) => {

    return <NestedBox 
        index = {index} 
        childorientation = {demos.nested.childorientation} 
        setlistsize = {demos.nested.estimatedListSize}
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

    const originalindexRef = useRef(props.index)

    return <div style = {{position:'relative',height:'100%', width:'100%',backgroundColor:'white'}}>
        <div style = {genericstyle}>
            {originalindexRef.current + 1}{false && <img style= {{height:'100%'}} src={props.image}/>}
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
        startingIndex:0,
        estimatedListSize:60,
        getItem:getGenericItem,
        placeholder:null,
        cache:'cradle',
        cacheMax:200,
        styles: genericcomponentstyles,
        callbacks: {
            getFunctions:null,
            referenceIndexCallback:null,
            // preloadIndexCallback:null,
        },
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
        startingIndex:0,
        estimatedListSize:400,
        getItem:getNestedItem,
        placeholder:null,
        cache:'cradle',
        cacheMax:200,
        styles: genericcomponentstyles,
        callbacks: {
            getFunctions:null,
            referenceIndexCallback:null,
            // preloadIndexCallback:null,
        },
        layout:'uniform',
        scrollerName:'OUTER',
    },
    variable: {
        gap:10,
        padding:10,
        cellHeight:100,
        cellWidth:250,
        runwaySize:6,
        startingIndex:0,
        estimatedListSize:300,
        getItem:getVariableItem,
        placeholder:null,
        cache:'cradle',
        cacheMax:200,
        styles: genericcomponentstyles,
        callbacks: {
            getFunctions:null,
            referenceIndexCallback:null,
        },
        layout:'uniform',
        scrollerName: 'VARIABLE',
    },
}

const Test = (props) => {

    // console.log('running Test Component', props)

    const [orientation, setOrientation] = useState('vertical')

    const [demo, setDemo] = useState('generic')
    const demoRef = useRef(null)
    demoRef.current = demo

    const [testState, setTestState] = useState('ready')

    const demoselection = demos[demo]

    // console.log('inside Test: demo, demoselection',demo,demoselection)

    const callbacksRef = useRef(null)

    const getFunctions = useCallback(callbacks => {
        callbacksRef.current = callbacks
    },[])

    let {
        gap,
        padding,
        cellHeight,
        cellWidth,
        runwaySize,
        startingIndex,
        estimatedListSize,
        getItem,
        placeholder,
        cache,
        cacheMax,
        styles,
        callbacks:inheritedcallbacks,
        layout,
        scrollerName,
        
    } = demoselection

    const callbacks = Object.assign({},inheritedcallbacks)

    callbacks.getFunctions = getFunctions

    const handleOrientation = (orientation) => {
        setOrientation(orientation)
        demos.nested.childorientation = (orientation == 'vertical')?'horizontal':'vertical'
    }

    useEffect (()=>{

        switch (testState) {
            case 'setcache': {
                setTestState('ready')
                break
            }
        }
    },[testState])

    const handleReverseCradle = () => {
        const cradlemap = callbacksRef.current?.getCradleIndexMap()
        if (!cradlemap) return
        const cradlearray = Array.from(cradlemap)
        cradlearray.sort((a,b) => {
            const aval = a[0], bval = b[0]
            return aval - bval
        })
        const indexarray = cradlearray.map(item => item[0])
        const cacheItemIDarray = cradlearray.map(item => item[1])
        cacheItemIDarray.reverse()

        const changemap = new Map()

        for (const i in indexarray) {
            changemap.set(indexarray[i],cacheItemIDarray[i])
        }

        callbacksRef.current?.changeIndexMap(changemap)

        // console.log(indexarray, cacheItemIDarray, changemap)

    }

    const handleGetTestData = () => {
        console.log('test data', demos, demoselection)
    }

    const handleMoveIndex = (toindex, fromindex, fromhighrange) => {
        
        callbacksRef.current?.moveIndex(toindex, fromindex, fromhighrange)

    }

    const handleInsertIndex = (indexnumber, highrangenumber) => {

        callbacksRef.current?.insertIndex(indexnumber, highrangenumber)

    }

    const handleRemoveIndex = (indexnumber, highrangenumber) => {
        
        callbacksRef.current?.removeIndex(indexnumber, highrangenumber)

    }

    const handleGridConfigCells = () => {
        
    }
    const handleGridConfigBorders = () => {
        
    }

    const handleScrollerConfigRunwaySize = () => {
        
    }

    const handleApplyLayout = () => {

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

    const handleReload = () => {
        // console.log('calling reload callback from test controller', callbacksRef)
        callbacksRef.current?.reload()
    }

    const handleSetListsize = (listsize) => {
        callbacksRef.current?.setListsize(listsize)
    }

    const handleGetCacheIndexMap = () => {
        console.log(callbacksRef.current?.getCacheIndexMap())
    }

    const handleGetCacheItemMap = () => {
        console.log(callbacksRef.current?.getCacheItemMap())
    }

    const handleGetCradleIndexMap = () => {
        console.log(callbacksRef.current?.getCradleIndexMap())
    }

    const handleApplyCache = (cache, cacheMax) => {
        // console.log('inside handleApplyCache:cache, cacheMax',cache, cacheMax)
        const demo = demoRef.current
        demos[demo].cache = cache
        demos[demo].cacheMax = cacheMax
        // console.log('setting cache of demo', cache, demo, demos[demo])
        setTestState('setcache')
    }
    const democallbacks = {
        
        orientationcallback:handleOrientation,
        democallback:handleDemo,
        scrolltoposcallback:handleScrollToPos,
        clearcachecallback:handleClearCache,
        reloadcallback:handleReload,
        setlistsizecallback:handleSetListsize,
        getcachemapcallback:handleGetCacheIndexMap,
        getcachelistcallback:handleGetCacheItemMap,
        getcradlemapcallback:handleGetCradleIndexMap,
        reversecradlecallback:handleReverseCradle,
        insertindexcallback:handleInsertIndex,
        removeindexcallback:handleRemoveIndex,
        applylayoutcallback:handleApplyLayout,
        applycachecallback:handleApplyCache,
        gridconfigcellscallback:handleGridConfigCells,
        gridconfigborderscallback:handleGridConfigBorders,
        scrollerconfigrunwaysizecallback:handleScrollerConfigRunwaySize,
        moveindexcallback:handleMoveIndex,
        gettestdatacallback:handleGetTestData,

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
                    startingIndex = { startingIndex }
                    estimatedListSize = { estimatedListSize }
                    getItem = { getItem }
                    placeholder = { placeholder }
                    cache = { cache }
                    cacheMax = { cacheMax }
                    styles = { styles }
                    callbacks = { callbacks }
                    layout = { layout }
                    scrollerName = { scrollerName }

                />
            </div>
        </div>
    </>
}

export default Test

