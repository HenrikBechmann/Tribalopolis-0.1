var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// draghandle.tsx
import * as React from 'react';
import { styles as globalstyles } from '../utilities/styles';
import FontIcon from 'material-ui/FontIcon';
import { DragSource } from 'react-dnd';
let styles = globalstyles.splitter;
let handleSource = {
    beginDrag(props) {
        return {
            text: 'something'
        };
    }
};
const collect = (connect, monitor) => {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
};
let DragHandle = class DragHandle extends React.Component {
    render() {
        let isDragging = this.props.isDragging;
        let connectDragSource = this.props.connectDragSource;
        styles.draghandle.opacity = isDragging ? 0.5 : 1;
        const draghandle = Object.assign({}, styles.draghandle);
        // var text = this.props.text;
        return connectDragSource(<div style={draghandle}>
                <FontIcon className="material-icons">
                    drag_handle
                </FontIcon>
            </div>);
    }
};
DragHandle = __decorate([
    DragSource('draghandle', handleSource, collect)
], DragHandle);
export default DragHandle;
//# sourceMappingURL=draghandle.jsx.map