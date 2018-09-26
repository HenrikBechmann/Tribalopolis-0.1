// resizetab.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import React from 'react'

import { DragSource } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'

import { withStyles, createStyles } from '@material-ui/core/styles'
import Icon from '@material-ui/core/Icon'

import DragTypes from '../../dragitemtypes'
import ResizeDragLayer from './resizedraglayer.view'


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
        cursor: 'ew-resize',
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
}

@DragSource( DragTypes.RESIZETAB, resizeHandlers, resizeProps )
class ResizeTab extends React.Component<any,any> {

    render() {

        const boxframeelement:HTMLElement = this.props.boxframe.current
        const offsetWidth = boxframeelement.offsetWidth
        const offsetHeight = boxframeelement.offsetHeight

        const { isDragging, connectDragSource, connectDragPreview } = this.props
        const { classes } = this.props

        // console.log('data',isDragging,connectDragSource,connectDragPreview)

        return ( // connectDragPreview (
            <React.Fragment>
                <div className = { classes.tabstyles } 
                    style = {{visibility:!isDragging?'visible':'hidden'}}
                >
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
                </div>
                {
                    isDragging && <ResizeDragLayer 
                        offsetWidth = { offsetWidth } 
                        offsetHeight = { offsetHeight }
                        resizeTabStyles = { classes }
                    />
                }
            </React.Fragment>
        )
    } 
}

export default withStyles( styles )( ResizeTab )
