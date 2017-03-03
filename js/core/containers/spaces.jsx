// spaces.tsx
import * as React from 'react';
import { styles } from '../utilities/styles';
const MainBar = (props) => (<div style={props.style}>Toolbar</div>);
const Spaces = (props) => (<div>
        <MainBar style={styles.toolbar}/>
        <div style={styles.title}>Title</div>
        <div>Nodes: </div>
        <div>Links: </div>
        <div style={styles.graph}>
            <div style={styles.origin}>
                Origin
            </div>
            Graph
        </div>
        <div style={styles.status}>Status</div>
        <div style={styles.list}>List</div>
    </div>);
export default Spaces;
//# sourceMappingURL=spaces.jsx.map