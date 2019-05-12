// resizetab.view.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

import { DragSource } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'

import { withStyles, createStyles } from '@material-ui/core/styles'
import Icon from '@material-ui/core/Icon'

import DragTypes from '../../dragitemtypes'
import application from '../../services/application'

import ResizeDragLayerBase from './resizedraglayer.view'

const ResizeDragLayer:any = ResizeDragLayerBase

const styles = createStyles({
    tabstyles:{
        position:'absolute',
        right:'-22px',
        bottom:'6px',
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

        return {}

    },
    endDrag: (props,monitor,component) => {

        const diff = monitor.getDifferenceFromInitialOffset().x * 2
        const boxwidth = props.boxwidth
        let newboxwidth = boxwidth + diff
        if ( newboxwidth > 600) {
            newboxwidth = 600
        } else if (newboxwidth < 200) {
            newboxwidth = 200
        }
        props.setBoxWidth(newboxwidth)

    },
}

class ResizeTab extends React.Component<any,any> {

    render() {

        // console.log('ResizeTab props',this.props)

        const subjectelement:HTMLElement = this.props.boxframe.current
        
        if (!subjectelement) return null

        const offsetWidth = subjectelement.offsetWidth
        const offsetHeight = subjectelement.offsetHeight

        const { isDragging, connectDragSource, connectDragPreview } = this.props
        const { classes } = this.props

        !application.properties.ismobile && connectDragPreview(getEmptyImage())

        return (
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
                        /*!application.properties.ismobile && connectDragPreview(getEmptyImage())*/
                    }
                </div>
                {
                    isDragging && <ResizeDragLayer 
                        offsetWidth = { offsetWidth } 
                        offsetHeight = { offsetHeight }
                        resizeTabStyles = {classes}
                    />
                }
            </React.Fragment>
        )
    } 
}

export default withStyles( styles )( DragSource( DragTypes.RESIZETAB, resizeHandlers, resizeProps )(ResizeTab) )

