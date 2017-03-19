// draghandle.tsx
import * as React from 'react'
import { styles as globalstyles } from '../utilities/styles'
import FontIcon from 'material-ui/FontIcon'

let styles = globalstyles.splitter

class DragHandle extends React.Component<any,any> {

    render() {
        const draghandle = Object.assign({},styles.draghandle)
        return <div style = {draghandle}>
            <FontIcon className="material-icons">
                drag_handle
            </FontIcon>
        </div>
    }
}

export default DragHandle