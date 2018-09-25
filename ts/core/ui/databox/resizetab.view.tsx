// resizetab.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import React from 'react'

import { withStyles, createStyles } from '@material-ui/core/styles'
import { DragSource, ConnectDragPreview, ConnectDragSource } from 'react-dnd'
import Icon from '@material-ui/core/Icon'
import DragItemTypes from '../../dragitemtypes'

const styles = createStyles({
    tabstyles:{
        position:'absolute',
        right:'-22px',
        top:'calc(50% - 16px)',
        width:'20px',
        height:'32px',
        border:'1px solid gray',
        borderLeft:'1px solid transparent',
        backgroundColor:'white',
        borderRadius:'0 8px 8px 0',
        opacity:.54,
    },
    wrapperstyles:{margin:'4px 0 0 -3px'},
    iconstyles: {transform:'rotate(90deg)',opacity:.54},
})

const resizeSource = {
    beginDrag() {
        return {}
    },
}

const dndcallback = (connect, monitor) => {

    console.log('connect,monitor',connect,monitor)

    return {
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging(),
    }

}

@DragSource(DragItemTypes.RESIZETAB, resizeSource, dndcallback)
class ResizeTab extends React.Component<any,any> {

    render() {

        const { isDragging, connectDragSource, connectDragPreview } = this.props
        const opacity = isDragging ? 0.4 : 1

        console.log('data',isDragging,connectDragSource,connectDragPreview)

        let { classes } = this.props
        return connectDragPreview &&
            connectDragSource &&
            connectDragPreview(<div className = {classes.tabstyles}>
            {connectDragSource(<div className = {classes.wrapperstyles} >
                <Icon className = {classes.iconstyles}>drag_handle</Icon>
            </div>)}
        </div>)
    } 
}

export default withStyles(styles)(ResizeTab)
