// draghandle.tsx
import * as React from 'react'
import { styles as globalstyles } from '../utilities/styles'
import FontIcon from 'material-ui/FontIcon'
import { DragSource } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend';
import { ITEM_TYPES } from '../local/constants'

let styles = globalstyles.splitter

let handleSource = {
  beginDrag(props) {
    return {
      dragUpdate:props.dragUpdate,
      text: 'something'
    }
  }
}

const collect = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  };
}

class DragHandle extends React.Component<any,any> {

    componentDidMount() {
        this.props.connectDragPreview(getEmptyImage(),
          {captureDraggingState:true})
    }

    render() {
        let isDragging = this.props.isDragging;
        let connectDragSource = this.props.connectDragSource;
        // styles.draghandle.opacity = isDragging?0.5:1
        const draghandle = Object.assign({},styles.draghandle)
        // var text = this.props.text;

        return connectDragSource(
            <div style = {draghandle}>
                <FontIcon className="material-icons">
                    drag_handle
                </FontIcon>
            </div>
        )
    }
}

export default DragSource(ITEM_TYPES.DRAGHANDLE,handleSource,collect)(DragHandle)
