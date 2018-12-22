// generalresizetab.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

/*
    react components are used to support decorator notation
*/

'use strict'

import React from 'react'

import { DragSource, DragLayer } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'

import { withStyles, createStyles } from '@material-ui/core/styles'
import Icon from '@material-ui/core/Icon'

import DragTypes from '../../dragitemtypes'

import application from '../../services/application'

// ====================[ DRAG LAYER ]=========================

const draglayerstyles = createStyles({
    frame:{
        position:'absolute',
        top:'0',
        left:'0',
        width:'25px',
        height:'32px',
        opacity:.2,
        backgroundColor:'green',
    },
})

class ResizeDragLayerBase extends React.Component<any,any> {

    render() {

        const { 
            classes,
            currentwidth,
            minwidth,
            maxwidth,
            hostelement,
            currentDifference,
            orientation,
        } = this.props

        if (hostelement.current) {

            let diff = currentDifference.x
            let newwidth = currentwidth + -diff
            if ( newwidth > maxwidth) {
                newwidth = maxwidth
            } else if (newwidth < minwidth) {
                newwidth = minwidth
            }
            let width = (newwidth) + 'px'
            hostelement.current.style.width = width
        }

        return (
            <div 
                className = { classes.frame } 
                style = {{borderRadius:(orientation == 'left')?'8px 0 0 8px':'0 8px 8px 0'}}
            ></div> 
        )
    }

}

const ResizeDragLayer:any = withStyles(draglayerstyles)(
    DragLayer(monitor => ({
        currentDifference: monitor.getDifferenceFromInitialOffset(),
    })
)(ResizeDragLayerBase))

// =============================[ DRAG SOURCE ]===========================

const styles = createStyles({
    tabstyles:{
        position:'absolute',
        width:'24px',
        height:'32px',
        border:'1px solid silver',
        backgroundColor:'white',
        cursor: 'ew-resize',
        bottom:'6px',
    },
    iconwrapperstyles:{
        margin:'4px 0 0 0',
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

    beginDrag: () => {

        return {}

    },
    endDrag: (props,monitor) => {

        const diff = monitor.getDifferenceFromInitialOffset().x
        const { currentwidth, maxwidth, minwidth, setNewWidth } = props
        let newwidth = currentwidth + -diff

        if ( newwidth > maxwidth) {
            newwidth = maxwidth
        } else if (newwidth < minwidth) {
            newwidth = minwidth
        }

        setNewWidth(newwidth)

    },
}

class GeneralResizeTab extends React.Component<any,any> {

    render() {

        let { orientation } = this.props

        let styles 
        if (orientation == 'right') {
            styles = {
                right:'-26px',
                borderLeft:'1px solid white',
                borderRadius:'0 8px 8px 0',
            }
        } else { // orientation == 'left'
            styles = {
                left:'-26px',
                borderRight:'1px solid white',
                borderRadius:'8px 0 0 8px',
            }
        }
        styles.top = 'calc(50% - 16px)'

        const { 
            isDragging, 
            connectDragSource, 
            connectDragPreview,
            classes, 
            minwidth,
            maxwidth,
            currentwidth,
            hostelement,
        } = this.props

        return (
            <div className = { classes.tabstyles } 
                style = {styles}
                data-name = 'General Resize Tab'
            >
                { 
                    connectDragSource (
                        <div className = { classes.iconwrapperstyles } >
                            <Icon className = { classes.iconstyles } > drag_handle </Icon>
                        </div> 
                    )
                }
                {
                    !application.properties.ismobile && connectDragPreview(getEmptyImage())
                }
                {isDragging && 
                    <ResizeDragLayer 
                        orientation = {orientation}
                        minwidth = {minwidth}
                        maxwidth = {maxwidth}
                        currentwidth = {currentwidth}
                        hostelement = {hostelement}
                    />
                }
            </div>
        )
    } 
}

export default withStyles( styles )( 
    DragSource( DragTypes.RESIZETAB, resizeHandlers, resizeProps )(GeneralResizeTab) 
)

