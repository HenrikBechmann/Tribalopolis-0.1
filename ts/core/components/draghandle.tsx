// draghandle.tsx
import * as React from 'react'
import { styles as globalstyles } from '../utilities/styles'
import FontIcon from 'material-ui/FontIcon'
import { DragSource } from 'react-dnd'

let styles = globalstyles.splitter

let handleSource = {
  beginDrag(props) {
    return {
      text: 'something'
    }
  }
}

const collect = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

@DragSource('draghandle',handleSource,collect)
class DragHandle extends React.Component<any,any> {

    render() {
        let isDragging = this.props.isDragging;
        let connectDragSource = this.props.connectDragSource;
        styles.draghandle.opacity = isDragging?0.5:1
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

export default DragHandle
