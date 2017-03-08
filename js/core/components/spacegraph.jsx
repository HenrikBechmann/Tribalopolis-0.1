// spacegraph.tsx
import * as React from 'react';
import { styles as globalstyles } from '../utilities/styles';
class SpaceGraph extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {};
    }
    render() {
        let styles = globalstyles.spacegraph;
        return <div style={styles.fixedframe}>
            <div style={styles.originframe}>
                <div style={styles.origin}>
                    Origin
                </div>
            </div>
            <div style={styles.frame}>
                <div style={styles.platform}>
                    Graph
                </div>
            </div>
        </div>;
    }
}
export default SpaceGraph;
//# sourceMappingURL=spacegraph.jsx.map