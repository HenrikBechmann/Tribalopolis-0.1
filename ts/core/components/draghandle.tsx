// draghandle.tsx
import * as React from 'react'
import { styles as globalstyles } from '../utilities/styles'
import FontIcon from 'material-ui/FontIcon'
import { DragSource } from 'react-dnd'

let styles = globalstyles.splitter

var handleSource = {
  beginDrag: function (props) {
    return {
      text: 'something'
    };
  }
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

class DragHandle extends React.Component<any,any> {

    render() {
        var isDragging = this.props.isDragging;
        var connectDragSource = this.props.connectDragSource;
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

export default DragSource("something",handleSource,collect)(DragHandle)
