// draghandle.tsx
import * as React from 'react';
import { styles as globalstyles } from '../utilities/styles';
import FontIcon from 'material-ui/FontIcon';
import { DragSource } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { ITEM_TYPES } from '../local/constants';
/*
  TODO:
*/
let handleSource = {
    beginDrag(props) {
        if (props.dragStart)
            props.dragStart();
        let item = {
            frameDimensions: props.getFrameDimensions(),
            dragUpdate: props.dragUpdate,
        };
        // console.log('beginDrag item',item)
        return item;
    },
    endDrag(props, monitor) {
        if (props.dragEnd)
            props.dragEnd();
        if (props.afterDrag)
            props.afterDrag(props, monitor);
    }
};
const collect = (connect, monitor) => {
    return {
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging()
    };
};
class DragHandle extends React.Component {
    constructor() {
        super(...arguments);
        this.styles = JSON.parse(JSON.stringify(globalstyles.splitter.draghandle));
    }
    componentDidMount() {
        this.props.connectDragPreview(getEmptyImage(), { captureDraggingState: true });
    }
    render() {
        let isDragging = this.props.isDragging;
        let connectDragSource = this.props.connectDragSource;
        // styles.draghandle.opacity = isDragging?0.5:1
        const draghandle = Object.assign({}, this.styles);
        // var text = this.props.text;
        return connectDragSource(<div style={draghandle}>
                <FontIcon className="material-icons">
                    drag_handle
                </FontIcon>
            </div>);
    }
}
export default DragSource(ITEM_TYPES.DRAGHANDLE, handleSource, collect)(DragHandle);
//# sourceMappingURL=draghandle.jsx.map