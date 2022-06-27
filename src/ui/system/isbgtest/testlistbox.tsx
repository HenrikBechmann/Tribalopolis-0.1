// test .controller.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: MIT

import React, {useState, useRef, useEffect} from 'react'

import Scroller from 'react-infinite-grid-scroller'

const styles = {
    container: {
        display:'flex',
        flexDirection:'column',
        justifyContent:'flex-start',
        backgroundColor:'beige',
        height:'100%',
    },
    header:{
        padding:'3px',
        backgroundColor:'silver',
        border:'2p solid darkgray',
    },
    frame:{
        position:'relative',
        width:'100%',
        backgroundColor:'beige',
        flex:'1',
    },
    item:{
        padding:'3px',
        border:'1px solid green',
        backgroundColor:'white',
        height:'100%',
        boxSizing:'border-box',
    }
}

const getListItem = (index) => {

    // let promise = new Promise((resolve, reject) => {
    //     resolve(<div style = { styles.item as React.CSSProperties }> Item {index + 1} of this list </div>)
    // })

    // return promise

    return <div style = { styles.item as React.CSSProperties }> Item {index + 1} of this list </div>

}

const settings = {

    orientation:'vertical',
    gap:2,
    padding:6,
    cellHeight:40,
    cellWidth:230,
    runway:4,
    offset:0,
    listsize:100,
    getListItem: getListItem,

}

const TestListBox = (props) => {

    const [testState, setTestState] = useState('setup')
    const testStateRef = useRef(null)
    testStateRef.current = testState

    const { 
        index, 
        setlistsize, 
        childorientation, 
        scrollerData 
    } = props

    const {
        orientation, 
        gap, 
        padding, 
        cellHeight, 
        cellWidth, 
        runway, 
        offset, 
        listsize, 
        getListItem, 
    } = settings

    const {cradlePassthroughPropertiesRef} = scrollerData

    const dynamicorientationRef = useRef(childorientation)

    useEffect(() =>{
        if (testStateRef.current == 'setup') return
        const orientation = cradlePassthroughPropertiesRef.current.orientation
        if (orientation == 'vertical') {
            dynamicorientationRef.current = 'horizontal'
        } else {
            dynamicorientationRef.current = 'vertical'
        }
        setTestState('revised')

    },[cradlePassthroughPropertiesRef.current.orientation])

    useEffect(()=>{

        switch (testState) {
            case 'setup':
            case 'revised': {
                setTestState('ready')
                break
            }
        }

    },[testState])

    // console.log('TestListBox index, #', index, index + 1)

    return <div data-type = "list-frame" style = {styles.container as React.CSSProperties} >
        <div data-type = "list-header" style = {styles.header as React.CSSProperties} >
            List #{index + 1} of {setlistsize}
        </div>
        <div data-type = "list-content" style = {styles.frame as React.CSSProperties}>

            <Scroller 
                orientation = { dynamicorientationRef.current } 
                gap = {gap}
                padding = {padding}
                cellHeight = {cellHeight}
                cellWidth = {cellWidth}
                runwaySize = {runway}
                listSize = {listsize}
                indexOffset = {offset}
                getItem = {getListItem}
                functions = {null}
                placeholder = {null}
                styles = { null }
                layout = { null }
                scrollerData = { scrollerData }
            />

        </div>

    </div>

}

export default TestListBox