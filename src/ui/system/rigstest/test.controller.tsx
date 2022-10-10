// test.controller.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: MIT

/*

    create checkbox for display user callbacks to console.

*/

import React, {useState, useEffect, useRef, useCallback} from 'react'

import Scroller from 'react-infinite-grid-scroller'
import TestOptions from './testoptions'
import NestedBox from './testlistbox'

// =============================[ TEST SUPPORT ]================================

// -------------------------[ placeholder ]-------------------

const Placeholder = (props) => {
    return <div>SOMETHING</div>
} 

// ----------------------[ callbacks ]-------------------

let doitemstreaming = false
let doindexstreaming = false
let dopreloadstreaming = false
let dolistsizestreaming = false
let dodeletestreaming = false
let dorepositioningstreaming = false
let dorepositioningflagstreaming = false

const referenceIndexCallback = (index, location, cradleState) => {

    doindexstreaming && console.log('referenceIndexCallback: index, location, cradleState',
        index, location, cradleState)
   
}
const preloadIndexCallback = (index) => {
    
    dopreloadstreaming && console.log('preloadIndexCallback: index', index)

}
const deleteListCallback = (reason, deleteList) => {
    
    dodeletestreaming && console.log('deleteListCallback: reason, deleteList',reason, deleteList)

}
const repositioningIndexCallback = (index) => {
    
    dorepositioningstreaming && console.log('repositioningIndexCallback: index',index)

}

const repositioningFlagCallback = (flag) => {
    
    dorepositioningflagstreaming && console.log('repositioningFlagCallback: index',flag)

}

const changeListsizeCallback = (newlistsize) => {
    
    dolistsizestreaming && console.log('changeListsizeCallback: newlistsize', newlistsize)

}

const itemExceptionCallback = (index, itemID, returnvalue, location, error) => {
    
    doitemstreaming && console.log('itemExceptionCallback: index, itemID, returnvalue, location, error',
        index, itemID, returnvalue, location, error)

}

// -----------------------------[ generic items ]------------------------

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

const getGenericItem = (index) => {

     // return <GenericItem index = {index} image = {'https://loremflickr.com/200/300?random='+index}/>
     // if ((index == 130) || (index == 145)) console.log('getGenericItem returning index', index)
     if (index == 30) return Promise.reject(new Error('not found'))
     if (index == 40) return 5
     // if (index == 45) return null
     return <GenericItem index = {index} />

}

const getGenericItemPromises = (index) => {

     // return <GenericItem index = {index} image = {'https://loremflickr.com/200/300?random='+index}/>
     // if ((index == 130) || (index == 145)) console.log('getGenericItem returning index', index)
     if (index == 30) return Promise.reject(new Error('not found'))
     if (index == 40) return 5
     // if (index == 45) return null
     return <GenericItem index = {index} />

}
const getGenericItemDynamic = (index) => {

     // return <GenericItem index = {index} image = {'https://loremflickr.com/200/300?random='+index}/>
     // if ((index == 130) || (index == 145)) console.log('getGenericItem returning index', index)
     if (index == 30) return Promise.reject(new Error('not found'))
     if (index == 40) return 5
     // if (index == 45) return null
     return <GenericItem index = {index} />

}

// ------------------------------[ nested items ]-----------------------------

const getNestedItem = (index) => {

    return <NestedBox 
        index = {index} 
        childorientation = {demos.nested.childorientation} 
        setlistsize = {demos.nested.estimatedListSize}
        scrollerProperties = {null}
    />

}

const getNestedItemPromises = (index) => {

    return <NestedBox 
        index = {index} 
        childorientation = {demos.nested.childorientation} 
        setlistsize = {demos.nested.estimatedListSize}
        scrollerProperties = {null}
    />

}
const getNestedItemDynamic = (index) => {

    return <NestedBox 
        index = {index} 
        childorientation = {demos.nested.childorientation} 
        setlistsize = {demos.nested.estimatedListSize}
        scrollerProperties = {null}
    />

}

// ------------------------[ variable items ]----------------------------

const teststring = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Urna id volutpat lacus laoreet non curabitur gravida arcu. Arcu odio ut sem nulla pharetra diam. Amet facilisis magna etiam tempor orci eu. Consequat mauris nunc congue nisi vitae suscipit. Est ultricies integer quis auctor elit. Tellus in hac habitasse platea dictumst vestibulum rhoncus est. Purus non enim praesent elementum facilisis leo. At volutpat diam ut venenatis. Porttitor leo a diam sollicitudin tempor id eu nisl nunc. Sed elementum tempus egestas sed sed risus pretium quam. Tristique risus nec feugiat in fermentum. Sem fringilla ut morbi tincidunt. Malesuada nunc vel risus commodo. Nulla pellentesque dignissim enim sit amet venenatis urna cursus. In egestas erat imperdiet sed euismod nisi porta.'

let variablestyles = {
    // outer:{position:'relative',height:'100%', width:'100%',backgroundColor:'white'},
    outer:{
        backgroundColor:'white',
        overflow:'scroll',
        height: '100%',
        width:'100%',
        maxHeight:null,
        maxWidth: null
    },
    inner:{
        // position:'absolute',
        // top:0,
        // left:0,
        padding:'3px',
        opacity:.5,
        borderRadius:'8px',
        backgroundColor:'white', 
        // minHeight:'0px',
        // maxHeight:'none',
        // minWidth:'0px',
        // maxWidth:'none',
        // margin:'3px'
    }
}

let teststrings = []

let getTestString = (index) => {
    // console.log('getTestString',index)
    if (!teststrings[index]) {
        if ([0,1,51,52,196,197,198,199].includes(index)) {
            teststrings[index] = 'TEST STRING' + index
        } else if (index == 0) {
            teststrings[index] =`${index + 1}: 'test string ' + ${teststring.substr(0,.5 * teststring.length)}`
        } else {
            teststrings[index] =`${index + 1}: 'test string ' + ${teststring.substr(0,Math.random() * teststring.length)}`
        }
    }
    return teststrings[index]
}

const VariableItem = (props) => {

    const {

        orientation,
        cellWidth,
        cellHeight

    } = props.scrollerProperties.scrollerPropertiesRef.current

    const outerstyles = {...variablestyles.outer}

    if (orientation == 'vertical') {
        outerstyles.maxHeight = cellHeight
        outerstyles.height = null
        outerstyles.maxWidth = null
        outerstyles.width = '100%'
    } else {
        outerstyles.maxHeight = null
        outerstyles.height = '100%'
        outerstyles.maxWidth = cellWidth
        outerstyles.width = null
    }

    return <div style = {outerstyles}>
        <div style = {variablestyles.inner as React.CSSProperties}>{getTestString(props.index)}</div>
    </div>
}

const getVariableItem = (index) => {

     return <VariableItem index = {index} scrollerProperties = {null}/>    

}

const getVariableItemPromises = (index) => {

     return <VariableItem index = {index} scrollerProperties = {null}/>    

}
const getVariableItemDynamic = (index) => {

     return <VariableItem index = {index} scrollerProperties = {null}/>    

}

// ---------------------------[ styles ]-----------------------

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
    viewport:{
        backgroundColor:'green',
        overscrollBehavior:'none',
    },
    scrollblock:{
        backgroundColor:'brown',
    },
    cradle:{
        backgroundColor:'black',
    },
    scrolltracker:{
        backgroundColor:'cyan',
    }
}

// ---------------------------------[ test component parameters ]----------------------

const demos = {
    generic: {
        gap:5,
        padding:10,
        cellHeight:150,
        cellWidth:150,
        runwaySize:4,
        startingIndex:0,
        estimatedListSize:200,
        getItem:getGenericItem,
        placeholder:null,
        cache:'cradle',
        cacheMax:200,
        styles: genericcomponentstyles,
        // callbacks: {
        //     functionsCallback:null,
        //     referenceIndexCallback:null,
        // },
        layout: 'uniform',
        scrollerName:'GENERIC',
    },
    genericpromises: {
        gap:5,
        padding:10,
        cellHeight:150,
        cellWidth:150,
        runwaySize:4,
        startingIndex:0,
        estimatedListSize:200,
        getItem:getGenericItemPromises,
        placeholder:null,
        cache:'cradle',
        cacheMax:200,
        styles: genericcomponentstyles,
        // callbacks: {
        //     functionsCallback:null,
        //     referenceIndexCallback:null,
        // },
        layout: 'uniform',
        scrollerName:'GENERICPROMISES',
    },
    genericdynamic: {
        gap:5,
        padding:10,
        cellHeight:150,
        cellWidth:150,
        runwaySize:4,
        startingIndex:0,
        estimatedListSize:200,
        getItem:getGenericItemDynamic,
        placeholder:null,
        cache:'cradle',
        cacheMax:200,
        styles: genericcomponentstyles,
        // callbacks: {
        //     functionsCallback:null,
        //     referenceIndexCallback:null,
        // },
        layout: 'uniform',
        scrollerName:'GENERICDYNAMIC',
    },
    nested: {
        childorientation:'horizontal',
        gap:5,
        padding:5,
        cellHeight:400,
        cellWidth:250,
        runwaySize:2,
        startingIndex:0,
        estimatedListSize:400,
        getItem:getNestedItem,
        placeholder:null,
        cache:'cradle',
        cacheMax:200,
        styles: genericcomponentstyles,
        // callbacks: {
        //     functionsCallback:null,
        //     referenceIndexCallback:null,
        // },
        layout:'uniform',
        scrollerName:'NESTED',
    },
    nestedpromises: {
        childorientation:'horizontal',
        gap:5,
        padding:5,
        cellHeight:400,
        cellWidth:250,
        runwaySize:2,
        startingIndex:0,
        estimatedListSize:400,
        getItem:getNestedItemPromises,
        placeholder:null,
        cache:'cradle',
        cacheMax:200,
        styles: genericcomponentstyles,
        // callbacks: {
        //     functionsCallback:null,
        //     referenceIndexCallback:null,
        // },
        layout:'uniform',
        scrollerName:'NESTEDPROMISES',
    },
    nesteddynamic: {
        childorientation:'horizontal',
        gap:5,
        padding:5,
        cellHeight:400,
        cellWidth:250,
        runwaySize:2,
        startingIndex:0,
        estimatedListSize:400,
        getItem:getNestedItemDynamic,
        placeholder:null,
        cache:'cradle',
        cacheMax:200,
        styles: genericcomponentstyles,
        // callbacks: {
        //     functionsCallback:null,
        //     referenceIndexCallback:null,
        // },
        layout:'uniform',
        scrollerName:'NESTEDDYNAMIC',
    },
    variable: {
        gap:5,
        padding:10,
        cellHeight:320,
        cellWidth:250,
        cellMinHeight:20,
        runwaySize:5,
        startingIndex:0,
        estimatedListSize:10,
        getItem:getVariableItem,
        placeholder:null,
        cache:'cradle',
        cacheMax:200,
        styles: genericcomponentstyles,
        // callbacks: {
        //     functionsCallback:null,
        //     referenceIndexCallback:null,
        // },
        layout:'variable',
        scrollerName: 'VARIABLE',
    },
    variablepromises: {
        gap:5,
        padding:10,
        cellHeight:320,
        cellWidth:250,
        cellMinHeight:20,
        runwaySize:5,
        startingIndex:0,
        estimatedListSize:10,
        getItem:getVariableItemPromises,
        placeholder:null,
        cache:'cradle',
        cacheMax:200,
        styles: genericcomponentstyles,
        // callbacks: {
        //     functionsCallback:null,
        //     referenceIndexCallback:null,
        // },
        layout:'variable',
        scrollerName: 'VARIABLEPROMISES',
    },
    variabledynamic: {
        gap:5,
        padding:10,
        cellHeight:320,
        cellWidth:250,
        cellMinHeight:20,
        runwaySize:5,
        startingIndex:0,
        estimatedListSize:10,
        getItem:getVariableItemDynamic,
        placeholder:null,
        cache:'cradle',
        cacheMax:200,
        styles: genericcomponentstyles,
        // callbacks: {
        //     functionsCallback:null,
        //     referenceIndexCallback:null,
        // },
        layout:'variable',
        scrollerName: 'VARIABLEDYNAMIC',
    },
}

// ================================[ TEST COMPONENT ]===========================

const Test = (props) => {

    // console.log('running Test Component', props)

    const [orientation, setOrientation] = useState('vertical')
    const [demo, setDemo] = useState('generic')
    const [testState, setTestState] = useState('ready')

    const demoRef = useRef(null)
    demoRef.current = demo

    const demoselection = demos[demo]

    const scrollerFunctionsRef = useRef(null)

    const functionsCallback = useCallback(callbacks => {
        scrollerFunctionsRef.current = callbacks
    },[])

    let {
        gap,
        padding,
        cellHeight,
        cellWidth,
        cellMinHeight,
        cellMinWidth,
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
        triggerlineOffset
        
    } = demoselection

    // const callbacks = Object.assign({},inheritedcallbacks)

    const callbacks = {
        functionsCallback,
        referenceIndexCallback,
        preloadIndexCallback,
        deleteListCallback,
        repositioningIndexCallback,
        repositioningFlagCallback,
        changeListsizeCallback,
        itemExceptionCallback,
    }

    useEffect (()=>{

        switch (testState) {
            case 'setborders':
            case 'setcellsizes':
            case 'setminmaxcellsizes':
            case 'setrunwaysize':
            case 'setcache': {
                setTestState('ready')
                break
            }
        }
    },[testState])

    // -----------------------------[ define option callbacks ]------------------------

    // 1.
    const handleOrientation = (orientation) => {
        demos.nested.childorientation = (orientation == 'vertical')?'horizontal':'vertical'
        setOrientation(orientation)
    }

    // 2.
    const handleDemo = (demo) => {
        handleOrientation(orientation)
        setDemo(demo)
    }

    // 3.
    const handleApplyCache = (cache, cacheMax) => {
        // console.log('inside handleApplyCache:cache, cacheMax',cache, cacheMax)
        const demo = demoRef.current
        demos[demo].cache = cache
        demos[demo].cacheMax = cacheMax
        // console.log('setting cache of demo', cache, demo, demos[demo])
        setTestState('setcache')
    }

    // 4.
    const handleGridConfigBorders = (padding, gap) => {

        const demo = demoRef.current
        demos[demo].padding = padding
        demos[demo].gap = gap
        setTestState('setborders')

    }

    // 5.
    const handleGridConfigCells = (cellwidth, cellheight) => {

        const demo = demoRef.current
        demos[demo].cellWidth = cellwidth
        demos[demo].cellHeight = cellheight
        setTestState('setcellsizes')
        
    }

    // 6.
    const handleGridConfigMinMaxCells = (cellminwidth, cellminheight) => {

        const demo = demoRef.current
        demos[demo].cellMinWidth = cellminwidth
        demos[demo].cellMinHeight = cellminheight
        setTestState('setminmaxcellsizes')
        
    }

    // 7.
    const handleScrollerConfigRunwaySize = (runwaysize) => {
        
        const demo = demoRef.current
        demos[demo].runwaySize = runwaysize
        setTestState('setrunwaysize')

    }

    // 8. 
    const handleScrollToPos = (pos) => {
        scrollerFunctionsRef.current?.scrollToIndex(pos)
    }

    // 9.
    const handleSetListsize = (listsize) => {
        scrollerFunctionsRef.current?.setListsize(listsize)
    }

    // 10. a
    const handleGetCacheIndexMap = () => {
        console.log(scrollerFunctionsRef.current?.getCacheIndexMap())
    }

    // 10. b
    const handleGetCacheItemMap = () => {
        console.log(scrollerFunctionsRef.current?.getCacheItemMap())
    }

    // 10. c
    const handleGetCradleIndexMap = () => {
        console.log(scrollerFunctionsRef.current?.getCradleIndexMap())
    }

    // 11. a
    const handleReload = () => {
        // console.log('calling reload callback from test controller', scrollerFunctionsRef)
        scrollerFunctionsRef.current?.reload()
    }

    // 11. b
    const handleClearCache = () => {

        scrollerFunctionsRef.current?.clearCache()        
    }
    
    // 12. a
    const handleInsertIndex = (indexnumber, highrangenumber) => {

        scrollerFunctionsRef.current?.insertIndex && 
            console.log('insertIndex: [changelist, replaceList]',scrollerFunctionsRef.current.insertIndex(indexnumber, highrangenumber))

    }

    // 12. b
    const handleRemoveIndex = (indexnumber, highrangenumber) => {
        
        scrollerFunctionsRef.current?.removeIndex && 
            console.log('removeIndex: [changeList, replaceList]',scrollerFunctionsRef.current.removeIndex(indexnumber, highrangenumber))

    }

    // 13
    const handleMoveIndex = (toindex, fromindex, fromhighrange) => {
        
        scrollerFunctionsRef.current?.moveIndex && 
            console.log('moveIndex:',scrollerFunctionsRef.current.moveIndex(toindex, fromindex, fromhighrange))

    }

    // 14
    const handleRemapIndexes = () => {
        const cradleindexmap = scrollerFunctionsRef.current?.getCradleIndexMap()
        if (!cradleindexmap) return

        const cradleindexarray = Array.from(cradleindexmap)
        cradleindexarray.sort((a,b) => {
            const aval = a[0], bval = b[0]
            return aval - bval
        })

        const indexarray = cradleindexarray.map(item => item[0])
        const cacheItemIDarray = cradleindexarray.map(item => item[1])
        // console.log('test.controller indexarray, cacheItemIDarray',indexarray, cacheItemIDarray)
        cacheItemIDarray.reverse()

        const changeMap = new Map()

        // changeMap.set(3,10)
        // changeMap.set(5, undefined)
        // changeMap.set(6,2)
        // changeMap.set(11,2)
        // changeMap.set(20,15)
        // changeMap.set(300,8)
        // changeMap.set(20,400)
        // changeMap.set(22,"text")

        for (const i in indexarray) {
            // if (cacheItemIDarray[i]) {
                changeMap.set(indexarray[i],cacheItemIDarray[i])
            // }
        }
        // console.log('testcontroller.changeMap', changeMap)
        if (scrollerFunctionsRef.current?.remapIndexes) {
            const returnarray = scrollerFunctionsRef.current.remapIndexes(changeMap)

            console.log('remapIndexes: \
[modifiedIndexesList, \
remappedIndexesList, \
deletedIndexesList, \
orphanedItemsIDList, \
orphanedIndexesList\
errorEntriesMap, \
changeMap]', 
returnarray)

        }

    }

    // Stream feedback to console
    const handleIndexStreamFeedback = (streaming) => {
        doindexstreaming = streaming
    }
    const handlePreloadStreamFeedback = (streaming) => {
        dopreloadstreaming = streaming
    }
    const handleItemStreamFeedback = (streaming) => {
        doitemstreaming = streaming
    }
    const handleRepositioningFlagFeedback = (streaming) => {
        dorepositioningflagstreaming = streaming
    }
    const handleRepositioningStreamFeedback = (streaming) => {
        dorepositioningstreaming = streaming
    }
    const handleListsizeStreamFeedback = (streaming) => {
        dolistsizestreaming = streaming
    }
    const handleDeleteStreamFeedback = (streaming) => {
        dodeletestreaming = streaming
    }
    // Get test data
    const handleGetTestData = () => {
        console.log('test data', demos, demoselection)
    }

    // -----------------[ package option callbacks for testoptions ]--------------

    const optioncallbacks = {
        
        orientationcallback:handleOrientation, // 1.
        democallback:handleDemo, // 2.
        applycachecallback:handleApplyCache, // 3.
        gridconfigborderscallback:handleGridConfigBorders, // 4.
        gridconfigcellscallback:handleGridConfigCells, // 5.
        gridconfigminmaxcellscallback:handleGridConfigMinMaxCells, // 6.
        scrollerconfigrunwaysizecallback:handleScrollerConfigRunwaySize, // 7.
        scrolltoposcallback:handleScrollToPos, // 8.
        setlistsizecallback:handleSetListsize, // 9.
        getc1achemapcallback:handleGetCacheIndexMap, // 10.a
        getcachelistcallback:handleGetCacheItemMap, // 10. b
        getcradlemapcallback:handleGetCradleIndexMap, // 10.c 
        reloadcallback:handleReload, // 11. a
        clearcachecallback:handleClearCache, // 11. b
        insertindexcallback:handleInsertIndex, // 12. a
        removeindexcallback:handleRemoveIndex, // 12. b
        moveindexcallback:handleMoveIndex, // 13
        remapindexescallback:handleRemapIndexes, // 14

        // Stream feedback to console
        indexstreamcallback:handleIndexStreamFeedback,
        preloadstreamcallback:handlePreloadStreamFeedback,
        itemstreamcallback:handleItemStreamFeedback,
        repositioningflagcallback: handleRepositioningFlagFeedback,
        repositioningstreamcallback:handleRepositioningStreamFeedback,
        listsizestreamcallback:handleListsizeStreamFeedback,
        deletestreamcallback:handleDeleteStreamFeedback,
        
        // Get test data
        gettestdatacallback:handleGetTestData,
    }

    // console.log('testcontroller demo',demo, demos[demo], demoselection)

    const advancedRef = useRef({showAxis:false})

    return <>
        <div style = {uistyles.optionswrapper as React.CSSProperties} >
            <TestOptions callbacks = { optioncallbacks }/>
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
                    cellMinHeight = { cellMinHeight }
                    cellMinWidth = { cellMinWidth }
                    runwaySize = { runwaySize }
                    startingIndex = { startingIndex }
                    estimatedListSize = { estimatedListSize }
                    triggerlineOffset = { triggerlineOffset }
                    getItem = { getItem }
                    placeholder = { placeholder }
                    cache = { cache }
                    cacheMax = { cacheMax }
                    styles = { styles }
                    callbacks = { callbacks }
                    layout = { layout }
                    advanced = { advancedRef.current }
                />
            </div>
        </div>
    </>
}

export default Test

