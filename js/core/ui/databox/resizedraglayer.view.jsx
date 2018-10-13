// resizedraglayer.view.tsx
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
import Icon from '@material-ui/core/Icon';
import { DragLayer } from 'react-dnd';
const styles = createStyles({
    frame: {
        border: '5px solid silver',
        position: 'absolute',
        top: -6,
        borderRadius: 12,
    },
});
let ResizeDragLayer = class ResizeDragLayer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            width: this.props.offsetWidth,
            left: -6,
        };
        this.startingwidth = this.props.offsetWidth;
        this.startingleft = -6;
        this.lastoffset = 0;
        this.previewElement = React.createRef();
    }
    render() {
        const { classes } = this.props;
        if (this.previewElement.current) {
            let diff = this.props.currentDifference.x;
            if (Math.abs(this.lastoffset - diff) > 1) { // optimization
                this.lastoffset = diff;
                let widthnumber = this.startingwidth + (diff * 2);
                if (widthnumber < 200) {
                    widthnumber = 200;
                    diff = (200 - this.startingwidth) / 2;
                }
                else if (widthnumber > 600) {
                    widthnumber = 600;
                    diff = (600 - this.startingwidth) / 2;
                }
                let width = (widthnumber) + 'px';
                let left = (this.startingleft - diff) + 'px';
                this.previewElement.current.style.width = width;
                this.previewElement.current.style.left = left;
            }
        }
        const framestyles = {
            height: this.props.offsetHeight,
            zIndex: 100,
        };
        return (<div ref={this.previewElement} className={classes.frame} style={framestyles}>
            <div className={this.props.resizeTabStyles.tabstyles} style={{ backgroundColor: 'silver', opacity: 1 }}>
                <div className={this.props.resizeTabStyles.iconwrapperstyles}>
                    <Icon className={this.props.resizeTabStyles.iconstyles}> drag_handle </Icon>
                </div> 

            </div>

        </div>);
    }
};
ResizeDragLayer = __decorate([
    DragLayer(monitor => ({
        currentDifference: monitor.getDifferenceFromInitialOffset(),
    }))
], ResizeDragLayer);
export default withStyles(styles)(ResizeDragLayer);
//# sourceMappingURL=resizedraglayer.view.jsx.map