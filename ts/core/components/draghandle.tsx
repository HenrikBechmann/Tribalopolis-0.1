// draghandle.tsx
import * as React from 'react'
import { styles as globalstyles } from '../utilities/styles'
import FontIcon from 'material-ui/FontIcon'
import { DragSource } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend';
import { ITEM_TYPES } from '../local/constants'

/*
  TODO: 
*/

let handleSource = {
  beginDrag(props) { // source props
    if (props.dragStart) props.dragStart()
    let item = {
      frameDimensions:props.getFrameDimensions(),
      dragUpdate:props.dragUpdate,
      isHorizontal:(props.orientation == 'horizontal')
    }
    return item
  },
  endDrag(props, monitor) { // source props
    if (props.dragEnd) props.dragEnd()
    if (props.afterDrag) props.afterDrag(props,monitor)
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
    afterDrag?:Function,
    orientation:string,
}

class DragHandle extends React.Component<DragHandleProps,any> {

    styles = JSON.parse(JSON.stringify(globalstyles.splitter.draghandle))

    componentWillMount() {
        if (this.props.orientation == 'horizontal') {
          this.styles = Object.assign(this.styles,{
            left:'calc(50% - 18px)',
            bottom:'calc(-18px)',
            transform:'none',
            cursor:'row-resize',
          })
        } else {
          this.styles = Object.assign(this.styles,{
            bottom:'calc(50% - 18px)',
            right:'calc(-18px)',
            transform:'rotate(-90deg)',
            cursor:'col-resize',
          })
        }
    }

    componentDidMount() {
        this.props.connectDragPreview(getEmptyImage(),
          {captureDraggingState:true})
    }

    render() {
        let isDragging = this.props.isDragging;
        let connectDragSource = this.props.connectDragSource;
        // styles.draghandle.opacity = isDragging?0.5:1
        const draghandle = Object.assign({},this.styles)
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
