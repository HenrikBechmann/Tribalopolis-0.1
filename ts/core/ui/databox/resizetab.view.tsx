// resizetab.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import React from 'react'

import { withStyles, createStyles } from '@material-ui/core/styles'
import { DragSource, DragLayer } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import Icon from '@material-ui/core/Icon'
import DragTypes from '../../dragitemtypes'

@DragLayer(monitor => ({
  item: monitor.getItem(),
  itemType: monitor.getItemType(),
  currentOffset: monitor.getSourceClientOffset(),
  isDragging: monitor.isDragging()
}))
class CustomDragLayer extends React.Component<any,any> {

    render() {
        console.log('custom drag layer',this.props)
        return <div>Custom Drag Layer</div>
    }
}


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
    iconwrapperstyles:{
        margin:'4px 0 0 -3px',
    },
    iconstyles: {
        transform:'rotate(90deg)',opacity:.54
    },
})

const resizeProps = (connect, monitor) => {

    return {

        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging(),

    }

}

const resizeHandlers = {

    beginDrag: (props,monitor,component) => {
        // console.log('props,monitor,component in resizeHandlers beginDrag',props,monitor,component)
        return {}

    },
    isDragging: (props,monitor) => {
        console.log('isDragging')
        return true
    }
}

@DragSource( DragTypes.RESIZETAB, resizeHandlers, resizeProps )
class ResizeTab extends React.Component<any,any> {

    render() {

        const { isDragging, connectDragSource, connectDragPreview } = this.props
        const { classes } = this.props

        const opacity = isDragging ? 0.4 : 1

        // console.log('data',isDragging,connectDragSource,connectDragPreview)

        return ( // connectDragPreview (
            <div className = { classes.tabstyles } >
                { 
                    connectDragSource (
                        <div className = { classes.iconwrapperstyles } >
                            <Icon className = { classes.iconstyles } > drag_handle </Icon>
                        </div> 
                    )
                }
                {
                    connectDragPreview(getEmptyImage())
                }
                {isDragging && <CustomDragLayer />}
            </div>
        )
    } 
}

export default withStyles( styles )( ResizeTab )
