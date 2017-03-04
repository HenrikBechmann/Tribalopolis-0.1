// spaces.tsx
import * as React from 'react'

import { styles } from '../utilities/styles'

const MainBar = (props) => (<div style= {props.style}>Toolbar</div>)

// TODO: make show/hide card panel tab; make show/hide graph panel tab
const Spaces = (props) =>(
    <div style={styles.frame}>
        <div style={styles.topframe}>
            <MainBar style={styles.toolbar} />
            <div style={styles.title} >Title</div>
            <div style={styles.filter}>
            <div>Nodes:  </div>
            <div>Links: </div>
            </div>
            <div style={styles.graph} >
                <div style={styles.origin}
                >
                    Origin
                </div>
                Graph
                <div style={styles.status} >Status</div>
            </div>
        </div>
        <div style={styles.bottomframe}>
            <div style={styles.list} >Card</div>
        </div>
    </div>
)

export default Spaces
