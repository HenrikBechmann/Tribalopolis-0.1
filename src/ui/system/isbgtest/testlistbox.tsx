// test .controller.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: MIT

import React, {useState, useRef} from 'react'

import Scroller from 'react-infinite-grid-scroller'

const styles = {
    container: {
        display:'flex',
        flexDirection:'column',
        justifyContent:'flex-start',
        backgroundColor:'red',
        height:'100%',
    },
    header:{
    },
    frame:{
        position:'relative',
        width:'100%',
        backgroundColor:'beige',
        flex:'1',
    },
}

const getListItem = (index) => {
    return <div> Item {index + 1} of this list </div>
}

const settings = {

    orientation:'vertical',
    gap:2,
    padding:3,
    cellHeight:40,
    cellWidth:300,
    runway:5,
    offset:0,
    listsize:100,
    getListItem: getListItem,

}

const TestListBox = (props) => {

    let { index, setlistsize } = props

    let {orientation, gap, padding, cellHeight, cellWidth, runway, offset, listsize, getListItem} = settings

    return <div style = {styles.container as React.CSSProperties} >
        <div style = {styles.header as React.CSSProperties} >
            List #{index + 1} of {setlistsize}
        </div>
        <div style = {styles.frame as React.CSSProperties}>

            <Scroller 
                orientation = { orientation } 
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