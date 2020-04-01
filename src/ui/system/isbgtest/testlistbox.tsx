// test .controller.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: MIT

import React, {useState, useRef} from 'react'

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

    return <div style = { styles.item as React.CSSProperties }> Item {index + 1} of this list </div>

}

const settings = {

    orientation:'vertical',
    gap:2,
    padding:6,
    cellHeight:40,
    cellWidth:288,
    runway:2,
    offset:0,
    listsize:100,
    getListItem: getListItem,

}

const TestListBox = (props) => {

    let { index, setlistsize, childorientation } = props

    let {orientation, gap, padding, cellHeight, cellWidth, runway, offset, listsize, getListItem} = settings

    return <div style = {styles.container as React.CSSProperties} >
        <div style = {styles.header as React.CSSProperties} >
            List #{index + 1} of {setlistsize}
        </div>
        <div style = {styles.frame as React.CSSProperties}>

            <Scroller 
                orientation = { childorientation } 
                gap = {gap}
                padding = {padding}
                cellHeight = {cellHeight}
                cellWidth = {cellWidth}
                runway = {runway}
                offset = {offset}
                listsize = {listsize}
                getItem = {getListItem}
                placeholder = {null}
                styles = { null }
                component = { null }
            />

        </div>

    </div>

}

export default TestListBox