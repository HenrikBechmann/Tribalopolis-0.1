// resizetab.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import React from 'react';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { DragSource } from 'react-dnd';
import Icon from '@material-ui/core/Icon';
import DragItemTypes from '../../dragitemtypes';
const styles = createStyles({
    tabstyles: {
        position: 'absolute',
        right: '-22px',
        top: 'calc(50% - 16px)',
        width: '20px',
        height: '32px',
        border: '1px solid gray',
        borderLeft: '1px solid transparent',
        backgroundColor: 'white',
        borderRadius: '0 8px 8px 0',
        opacity: .54,
    },
    wrapperstyles: { margin: '4px 0 0 -3px' },
    iconstyles: { transform: 'rotate(90deg)', opacity: .54 },
});
const boxSource = {
    beginDrag() {
        return {};
    },
};
let ResizeTab = class ResizeTab extends React.Component {
    render() {
        const { isDragging, connectDragSource, connectDragPreview } = this.props;
        const opacity = isDragging ? 0.4 : 1;
        console.log('data', isDragging, connectDragSource, connectDragPreview);
        let { classes } = this.props;
        return connectDragPreview &&
            connectDragSource &&
            connectDragPreview(<div className={classes.tabstyles}>
            {connectDragSource(<div className={classes.wrapperstyles}>
                <Icon className={classes.iconstyles}>drag_handle</Icon>
            </div>)}
        </div>);
    }
};
ResizeTab = __decorate([
    DragSource(DragItemTypes.RESIZETAB, boxSource, (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging(),
    }))
], ResizeTab);
export default withStyles(styles)(ResizeTab);
//# sourceMappingURL=resizetab.view.jsx.map