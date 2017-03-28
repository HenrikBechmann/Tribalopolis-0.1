// spacelist.tsx
import * as React from 'react'

// import FloatingActionButton from 'material-ui/FloatingActionButton';
// import ContentAdd from 'material-ui/svg-icons/content/add';

import { styles as globalstyles } from '../utilities/styles'

let styles = globalstyles.list

interface SpaceListProps {
    // data:Object,
    paneid?:string,
    triggers?:string[],
    getTriggers?:Function,
}

class SpaceList extends React.Component<SpaceListProps,any> {

    render() {
        return <div style={styles} >List</div>
    }
}

export default SpaceList
