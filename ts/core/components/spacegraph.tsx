// spacegraph.tsx
import * as React from 'react'

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

interface SpaceGraphProps {
    data:Object
}

import { styles as globalstyles } from '../utilities/styles'
class SpaceGraph extends React.Component<SpaceGraphProps,any> {

    state = {
    }
    render() {
        let styles = globalstyles.spacegraph
        return <div style={styles.fixedframe} >
            <FloatingActionButton mini={true} secondary={true} style={styles.addbutton}>
                  <ContentAdd />
            </FloatingActionButton>
            <div style={styles.originframe}>
                <div style={styles.origin}
                >
                    Origin
                </div>
            </div>
            <div style = {styles.frame}>
                <div style={styles.platform}>
                    Graph
                </div>
            </div>
        </div>        
    }
}

export default SpaceGraph