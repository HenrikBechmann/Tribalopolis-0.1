// spacelist.tsx
import * as React from 'react'

// import FloatingActionButton from 'material-ui/FloatingActionButton';
// import ContentAdd from 'material-ui/svg-icons/content/add';

import { styles as globalstyles } from '../utilities/styles'

let styles = globalstyles.item

interface SpaceItemProps {
    // data:Object,
    paneid?:string,
    triggers?:string[],
    getTriggers?:Function,
}

class SpaceItem extends React.Component<SpaceItemProps,any> {

    render() {
        return <div style = {styles.frame}>
            <div style={styles.content} >Item</div>
        </div>
    }
}

export default SpaceItem
