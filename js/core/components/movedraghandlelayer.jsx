// dragmovedraglayer.tsx
import * as React from 'react';
import { DragLayer } from 'react-dnd';
import { ITEM_TYPES } from '../local/constants';
const layerStyles = {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 100,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
};
const getItemStyles = (props) => {
    const { initialOffset, currentOffset } = props;
    if (!initialOffset || !currentOffset) {
        return {
            display: 'none',
        };
    }
    let { x, y } = currentOffset;
    const transform = `translate(${x}px, ${y}px)`;
    return {
        transform,
        WebkitTransform: transform,
    };
};
const collect = monitor => {
    let itemstate = {
        item: monitor.getItem(),
        itemType: monitor.getItemType(),
        initialOffset: monitor.getInitialSourceClientOffset(),
        currentOffset: monitor.getSourceClientOffset(),
        isDragging: monitor.isDragging(),
    };
    // console.log('offsets',itemstate.initialOffset,itemstate.currentOffset)
    return itemstate;
};
class MoveDraghandleLayer extends React.Component {
    componentWillReceiveProps(nextProps) {
        let { initialOffset, currentOffset, isDragging } = nextProps;
        // this.props.dragUpdate({
        //   initialOffset,
        //   currentOffset,
        //   isDragging,
        // })
    }
    renderItem(type, item) {
        switch (type) {
            case ITEM_TYPES.DRAGHANDLE:
                return (<div style={{ height: '36px', width: '36px', backgroundColor: 'red' }}></div>);
            default:
                return null;
        }
    }
    render() {
        const { item, itemType, isDragging } = this.props;
        console.log('movedraghandlelayer.props', this.props);
        if (!isDragging) {
            return null;
        }
        return (<div style={layerStyles}>
        <div style={getItemStyles(this.props)}>
          {this.renderItem(itemType, item)}
        </div>
      </div>);
    }
}
MoveDraghandleLayer.propTypes = {
    item: React.PropTypes.object,
    itemType: React.PropTypes.string,
    isDragging: React.PropTypes.bool,
    children: React.PropTypes.any,
    dragUpdate: React.PropTypes.func,
    x: React.PropTypes.number,
};
export default DragLayer(collect)(MoveDraghandleLayer);
//# sourceMappingURL=movedraghandlelayer.jsx.map