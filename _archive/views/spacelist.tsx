// spacelist.tsx
import * as React from 'react'

// import FloatingActionButton from 'material-ui/FloatingActionButton';
// import ContentAdd from 'material-ui/svg-icons/content/add';

import { styles as globalstyles } from '../../utilities/styles'

interface SpaceListProps {
    // data:Object,
    paneid?:string,
    triggers?:string[],
    getTriggers?:Function,
}

class SpaceList extends React.Component<SpaceListProps,any> {

    styles = JSON.parse(JSON.stringify(globalstyles.list))

    render() {
        let styles = this.styles
        return <div style = {styles.frame}>
            <div style={styles.content} >List</div>
        </div>
    }
}

export default SpaceList
