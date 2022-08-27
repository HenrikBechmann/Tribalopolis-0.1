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

let doitemstreaming = false
let doindexstreaming = false
let dopreloadstreaming = false
let dolistsizestreaming = false
let dodeletestreaming = false
let dorepositioningstreaming = false
let dorepositioningflagstreaming = false

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

const itemExceptionsCallback = (index, itemID, returnvalue, location, error) => {
    
    doitemstreaming && console.log('itemExceptionsCallback: index, itemID, returnvalue, location, error',
        index, itemID, returnvalue, location, error)

}

const getGenericItem = (index) => {

     // return <GenericItem index = {index} image = {'https://loremflickr.com/200/300?random='+index}/>
     // if ((index == 130) || (index == 145)) console.log('getGenericItem returning index', index)
     if (index == 30) return Promise.reject(new Error('not found'))
     if (index == 40) return 5
     // if (index == 45) return null
     return <GenericItem index = {index} />

}

const getNestedItem = (index) => {

    return <NestedBox 
        index = {index} 
        childorientation = {demos.nested.childorientation} 
        setlistsize = {demos.nested.estimatedListSize}
        scrollerProperties = {null}
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
        // callbacks: {
        //     getFunctions:null,
        //     referenceIndexCallback:null,
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
        startingIndex:0,
        estimatedListSize:400,
        getItem:getNestedItem,
        placeholder:null,
        cache:'cradle',
        cacheMax:200,
        styles: genericcomponentstyles,
        // callbacks: {
        //     getFunctions:null,
        //     referenceIndexCallback:null,
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
        startingIndex:0,
        estimatedListSize:300,
        getItem:getVariableItem,
        placeholder:null,
        cache:'cradle',
        cacheMax:200,
        styles: genericcomponentstyles,
        // callbacks: {
        //     getFunctions:null,
        //     referenceIndexCallback:null,
        // },
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

    const scrollerFunctionsRef = useRef(null)

    const getFunctions = useCallback(callbacks => {
        scrollerFunctionsRef.current = callbacks
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

    // const callbacks = Object.assign({},inheritedcallbacks)

    const callbacks = {
        getFunctions,
        referenceIndexCallback,
        preloadIndexCallback,
        deleteListCallback,
        repositioningIndexCallback,
        repositioningFlagCallback,
        changeListsizeCallback,
        itemExceptionsCallback,
    }

    const handleOrientation = (orientation) => {
        setOrientation(orientation)
        demos.nested.childorientation = (orientation == 'vertical')?'horizontal':'vertical'
    }

    useEffect (()=>{

        switch (testState) {
            case 'setborders':
            case 'setcellsizes':
            case 'setrunwaysize':
            case 'setlayout':
            case 'setcache': {
                setTestState('ready')
                break
            }
        }
    },[testState])

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

    const handleListsizeStreamFeedback = (streaming) => {
        dolistsizestreaming = streaming
    }

    const handleItemStreamFeedback = (streaming) => {
        doitemstreaming = streaming
    }

    const handleIndexStreamFeedback = (streaming) => {
        doindexstreaming = streaming
    }
    const handlePreloadStreamFeedback = (streaming) => {
        dopreloadstreaming = streaming
    }
    const handleDeleteStreamFeedback = (streaming) => {
        dodeletestreaming = streaming
    }

    const handleRepositioningStreamFeedback = (streaming) => {
        dorepositioningstreaming = streaming
    }
    const handleRepositioningFlagFeedback = (streaming) => {
        dorepositioningflagstreaming = streaming
    }
    const handleGetTestData = () => {
        console.log('test data', demos, demoselection)
    }

    const handleMoveIndex = (toindex, fromindex, fromhighrange) => {
        
        scrollerFunctionsRef.current?.moveIndex && 
            console.log('moveIndex:',scrollerFunctionsRef.current.moveIndex(toindex, fromindex, fromhighrange))

    }

    const handleInsertIndex = (indexnumber, highrangenumber) => {

        scrollerFunctionsRef.current?.insertIndex && 
            console.log('insertIndex: [changelist, replaceList]',scrollerFunctionsRef.current.insertIndex(indexnumber, highrangenumber))

    }

    const handleRemoveIndex = (indexnumber, highrangenumber) => {
        
        scrollerFunctionsRef.current?.removeIndex && 
            console.log('removeIndex: [changeList, replaceList]',scrollerFunctionsRef.current.removeIndex(indexnumber, highrangenumber))

    }

    const handleGridConfigCells = (cellwidth, cellheight) => {

        const demo = demoRef.current
        demos[demo].cellWidth = cellwidth
        demos[demo].cellHeight = cellheight
        setTestState('setcellsizes')
        
    }
    const handleGridConfigBorders = (padding, gap) => {

        const demo = demoRef.current
        demos[demo].padding = padding
        demos[demo].gap = gap
        setTestState('setborders')

    }

    const handleScrollerConfigRunwaySize = (runwaysize) => {
        
        const demo = demoRef.current
        demos[demo].runwaySize = runwaysize
        setTestState('setrunwaysize')

    }

    const handleApplyLayout = (layout, triggerlineOffset) => {

        const demo = demoRef.current
        demos[demo].layout = layout
        demos[demo].triggerlineOffset = triggerlineOffset
        setTestState('setlayout')

    }

    const handleDemo = (demo) => {
        setDemo(demo)
    }

    const handleClearCache = () => {

        scrollerFunctionsRef.current?.clearCache()        
    }
    
    const handleScrollToPos = (pos) => {
        scrollerFunctionsRef.current?.scrollToItem(pos)
    }

    const handleReload = () => {
        // console.log('calling reload callback from test controller', scrollerFunctionsRef)
        scrollerFunctionsRef.current?.reload()
    }

    const handleSetListsize = (listsize) => {
        scrollerFunctionsRef.current?.setListsize(listsize)
    }

    const handleGetCacheIndexMap = () => {
        console.log(scrollerFunctionsRef.current?.getCacheIndexMap())
    }

    const handleGetCacheItemMap = () => {
        console.log(scrollerFunctionsRef.current?.getCacheItemMap())
    }

    const handleGetCradleIndexMap = () => {
        console.log(scrollerFunctionsRef.current?.getCradleIndexMap())
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
        remapindexescallback:handleRemapIndexes,
        insertindexcallback:handleInsertIndex,
        removeindexcallback:handleRemoveIndex,
        applylayoutcallback:handleApplyLayout,
        applycachecallback:handleApplyCache,
        gridconfigcellscallback:handleGridConfigCells,
        gridconfigborderscallback:handleGridConfigBorders,
        scrollerconfigrunwaysizecallback:handleScrollerConfigRunwaySize,
        moveindexcallback:handleMoveIndex,
        gettestdatacallback:handleGetTestData,
        listsizestreamcallback:handleListsizeStreamFeedback,
        itemstreamcallback:handleItemStreamFeedback,
        indexstreamcallback:handleIndexStreamFeedback,
        preloadstreamcallback:handlePreloadStreamFeedback,
        deletestreamcallback:handleDeleteStreamFeedback,
        repositioningstreamcallback:handleRepositioningStreamFeedback,
        repositioningflagcallback: handleRepositioningFlagFeedback
    }

    const advancedRef = useRef({showAxis:true})

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
                    advanced = { advancedRef.current }
                    scrollerName = { scrollerName }

                />
            </div>
        </div>
    </>
}

export default Test

