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
}

const collect = monitor => ({
  item: monitor.getItem(),
  itemType: monitor.getItemType(),
  initialOffset: monitor.getInitialSourceClientOffset(),
  currentOffset: monitor.getSourceClientOffset(),
  isDragging: monitor.isDragging(),
})

interface MoveDraghandleLayerProps {
    item?:any,
    itemType?:any,
    isDragging?:any,
    children?:any,
}

class MoveDraghandleLayer extends React.Component<MoveDraghandleLayerProps,any> {

  renderItem(type, item) {
    switch (type) {
      case ITEM_TYPES.DRAGHANDLE:
        return (<div style={{height:'36px',width:'36px',backgroundColor:'red'}}></div>);
      default:
        return null;
    }
  }

  render() {
    const { item, itemType, isDragging } = this.props;

    if (!isDragging) {
      return null;
    }

    return (
      <div style={layerStyles}>
        <div style={getItemStyles(this.props)}>
          {this.renderItem(itemType, item)}
        </div>
      </div>
    );
  }
}

export default DragLayer(collect)(MoveDraghandleLayer)
