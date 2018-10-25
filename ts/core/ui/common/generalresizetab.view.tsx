// generalresizetab.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence

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
        top:-6,
    },
})

@DragLayer(monitor => ({
  currentDifference: monitor.getDifferenceFromInitialOffset(),
}))
class ResizeDragLayerBase extends React.Component<any,any> {

    constructor(props) {
        super(props)
        this.previewElement = React.createRef()
    }

    startingwidth
    mindiff
    maxdiff

    previewElement

    lastoffset = 0

    render() {
        const { classes } = this.props

        if (this.previewElement.current) {

            let diff = this.props.currentDifference.x
            if (Math.abs(this.lastoffset - diff) > 1) { // optimization
                this.lastoffset = diff

                let widthnumber = this.startingwidth + diff

                if (widthnumber < (this.startingwidth + this.mindiff)) {
                    widthnumber = (this.startingwidth + this.mindiff)
                    diff = this.mindiff
                }
                else if (widthnumber > this.startingwidth + this.maxdiff) {
                    widthnumber = (this.startingwidth + this.maxdiff)
                    diff = this.maxdiff
                }

                let width = (widthnumber) + 'px'
            }
        }

        const framestyles:React.CSSProperties = {
            height:this.props.offsetHeight,
            zIndex:100,
        }

        return (
        <div 
            ref = { this.previewElement }
            className = { classes.frame } 
            style = { framestyles }
        >
            <div 
                className = { this.props.resizeTabStyles.tabstyles } 
                style = {{ backgroundColor:'silver',opacity:1 }}
            >
                <div className = { this.props.resizeTabStyles.iconwrapperstyles } >
                    <Icon className = { this.props.resizeTabStyles.iconstyles } > drag_handle </Icon>
                </div> 

            </div>

        </div>
        )
    }

}

const ResizeDragLayer = withStyles(draglayerstyles)(ResizeDragLayerBase)

// =============================[ DRAG SOURCE ]===========================

const styles = createStyles({
    tabstyles:{
        position:'absolute',
        width:'20px',
        height:'32px',
        border:'1px solid gray',
        backgroundColor:'white',
        opacity:.54,
        cursor: 'ew-resize',
        bottom:'6px',
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

        if (props.beginDrag) {
            return props.beginDrag(props,monitor,component)
        } else {
            return {}
        }

    },
    endDrag: (props,monitor,component) => {

        props.endDrag && props.endDrag(props,monitor,component)

    },
}

@DragSource( DragTypes.RESIZETAB, resizeHandlers, resizeProps )
class GeneralResizeTab extends React.Component<any,any> {

    render() {


        let { orientation } = this.props

        let styles 
        if (orientation == 'right') {
            styles = {
                right:'-22px',
                borderLeft:'1px solid transparent',
                borderRadius:'0 8px 8px 0',
            }
        } else { // orientation == 'left'
            styles = {
                left:'-22px',
                borderRight:'1px solid transparent',
                borderRadius:'8px 0 0 8px',
            }
        }

        const { isDragging, connectDragSource, connectDragPreview } = this.props
        const { classes } = this.props

        return (
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
                    !application.properties.ismobile && connectDragPreview(getEmptyImage())
                }
                {isDragging && <ResizeDragLayer />}
            </div>
        )
    } 
}

export default withStyles( styles )( GeneralResizeTab )
