// spaces.tsx
import * as React from 'react';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import { styles } from '../utilities/styles';
// TODO: make show/hide card panel tab; make show/hide graph panel tab
const Spaces = (props) => (<div style={styles.frame}>
        <div style={styles.topframe}>
            <Toolbar style={styles.toolbar}>
                <ToolbarGroup>
                    <ToolbarTitle text="Toolbar"/>
                </ToolbarGroup>
            </Toolbar>
            <div style={styles.title}>Title</div>
            <div style={styles.filterbox}>
            <div>Nodes:  </div>
            <div>Links: </div>
            </div>
            <div style={styles.graph}>
                <div style={styles.origin}>
                    Origin
                </div>
                <div style={styles.origin}>
                    Origin
                </div>
                Graph
                <div style={styles.status}>Status</div>
            </div>
        </div>
        <div style={styles.bottomframe}>
            <div style={styles.list}>Card</div>
        </div>
    </div>);
export default Spaces;
//# sourceMappingURL=spaces.jsx.map