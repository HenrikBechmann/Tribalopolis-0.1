// generalresizetab.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
/*
    react components are used to support decorator notation
*/
'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import React from 'react';
import { DragSource, DragLayer } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { withStyles, createStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import DragTypes from '../../dragitemtypes';
import application from '../../services/application';
// ====================[ DRAG LAYER ]=========================
const draglayerstyles = createStyles({
    frame: {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '25px',
        height: '32px',
        opacity: .2,
        backgroundColor: 'green',
    },
});
let ResizeDragLayerBase = class ResizeDragLayerBase extends React.Component {
    render() {
        const { classes, currentwidth, minwidth, maxwidth, hostelement, currentDifference, orientation, } = this.props;
        if (hostelement.current) {
            let diff = currentDifference.x;
            let newwidth = currentwidth + -diff;
            if (newwidth > maxwidth) {
                newwidth = maxwidth;
            }
            else if (newwidth < minwidth) {
                newwidth = minwidth;
            }
            let width = (newwidth) + 'px';
            hostelement.current.style.width = width;
        }
        return (<div className={classes.frame} style={{ borderRadius: (orientation == 'left') ? '8px 0 0 8px' : '0 8px 8px 0' }}></div>);
    }
};
ResizeDragLayerBase = __decorate([
    DragLayer(monitor => ({
        currentDifference: monitor.getDifferenceFromInitialOffset(),
    }))
], ResizeDragLayerBase);
const ResizeDragLayer = withStyles(draglayerstyles)(ResizeDragLayerBase);
// =============================[ DRAG SOURCE ]===========================
const styles = createStyles({
    tabstyles: {
        position: 'absolute',
        width: '24px',
        height: '32px',
        border: '1px solid silver',
        backgroundColor: 'white',
        cursor: 'ew-resize',
        bottom: '6px',
    },
    iconwrapperstyles: {
        margin: '4px 0 0 0',
    },
    iconstyles: {
        transform: 'rotate(90deg)', opacity: .54
    },
});
const resizeProps = (connect, monitor) => {
    return {
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging(),
    };
};
const resizeHandlers = {
    beginDrag: () => {
        return {};
    },
    endDrag: (props, monitor) => {
        const diff = monitor.getDifferenceFromInitialOffset().x;
        const { currentwidth, maxwidth, minwidth, setNewWidth } = props;
        let newwidth = currentwidth + -diff;
        if (newwidth > maxwidth) {
            newwidth = maxwidth;
        }
        else if (newwidth < minwidth) {
            newwidth = minwidth;
        }
        setNewWidth(newwidth);
    },
};
let GeneralResizeTab = class GeneralResizeTab extends React.Component {
    render() {
        let { orientation } = this.props;
        let styles;
        if (orientation == 'right') {
            styles = {
                right: '-26px',
                borderLeft: '1px solid white',
                borderRadius: '0 8px 8px 0',
            };
        }
        else { // orientation == 'left'
            styles = {
                left: '-26px',
                borderRight: '1px solid white',
                borderRadius: '8px 0 0 8px',
            };
        }
        styles.top = 'calc(50% - 16px)';
        const { isDragging, connectDragSource, connectDragPreview, classes, minwidth, maxwidth, currentwidth, hostelement, } = this.props;
        return (<div className={classes.tabstyles} style={styles} data-name='General Resize Tab'>
                {connectDragSource(<div className={classes.iconwrapperstyles}>
                            <Icon className={classes.iconstyles}> drag_handle </Icon>
                        </div>)}
                {!application.properties.ismobile && connectDragPreview(getEmptyImage())}
                {isDragging &&
            <ResizeDragLayer orientation={orientation} minwidth={minwidth} maxwidth={maxwidth} currentwidth={currentwidth} hostelement={hostelement}/>}
            </div>);
    }
};
GeneralResizeTab = __decorate([
    DragSource(DragTypes.RESIZETAB, resizeHandlers, resizeProps)
], GeneralResizeTab);
export default withStyles(styles)(GeneralResizeTab);
//# sourceMappingURL=generalresizetab.view.jsx.map