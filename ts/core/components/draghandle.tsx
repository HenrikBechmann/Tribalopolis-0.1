// draghandle.tsx
import * as React from 'react'
import { styles as globalstyles } from '../utilities/styles'
import FontIcon from 'material-ui/FontIcon'
import { DragSource } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend';
import { ITEM_TYPES } from '../local/constants'

/*
  TODO: - onDragStart set svg overflow to hidden
  onDragEnd set svg overflow back to scroll
  - set collapse when splitter below threshold (on dragend)
  - vertical splitter
*/

let styles = globalstyles.splitter

let handleSource = {
  beginDrag(props) { // source props
    if (props.dragStart) props.dragStart()
    let item = {
      frameDimensions:props.getFrameDimensions(),
      dragUpdate:props.dragUpdate,
    }
    // console.log('beginDrag item',item)
    return item
  },
  endDrag(props) { // source props
    if (props.dragEnd) props.dragEnd()
    // console.log('endDrag props',props)
  }
}

const collect = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  };
}

interface DragHandleProps {
    dragUpdate:Function,
    connectDragPreview:any,
    isDragging:boolean,
    connectDragSource:any,
    children:React.ReactNode,
    dragStart?:Function,
    dragEnd?:Function,
}

class DragHandle extends React.Component<DragHandleProps,any> {

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
