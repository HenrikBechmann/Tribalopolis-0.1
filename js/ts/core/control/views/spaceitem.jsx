// spacelist.tsx
import * as React from 'react';
// import FloatingActionButton from 'material-ui/FloatingActionButton';
// import ContentAdd from 'material-ui/svg-icons/content/add';
import { styles as globalstyles } from '../../utilities/styles';
class SpaceItem extends React.Component {
    constructor() {
        super(...arguments);
        this.styles = JSON.parse(JSON.stringify(globalstyles.item));
    }
    render() {
        let styles = this.styles;
        return <div style={styles.frame}>
            <div style={styles.content}>Item</div>
        </div>;
    }
}
export default SpaceItem;
//# sourceMappingURL=spaceitem.jsx.map