// splitter.tsx
import * as React from 'react';
import { styles as globalstyles } from '../utilities/styles';
import FontIcon from 'material-ui/FontIcon';
let styles = globalstyles.splitter;
class Splitter extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            orientation: 'horizontal',
            collapse: 0,
            division: 50,
        };
        this.onCollapseCall = (selection) => {
            let collapse = this.state.collapse;
            let newcollapse = null;
            if (!collapse) {
                if (selection == 'primary') {
                    styles.topframe.bottom = '2px';
                    styles.bottomframe.top = '100%';
                    styles.splitter.bottom = '0px';
                    newcollapse = -1;
                }
                else {
                    styles.topframe.bottom = '100%';
                    styles.bottomframe.top = '2px';
                    styles.splitter.bottom = 'calc(100% - 2px)';
                    newcollapse = 1;
                }
            }
            else {
                styles.topframe.bottom = 'calc(50% + 1px)';
                styles.bottomframe.top = 'calc(50% + 1px)';
                styles.splitter.bottom = 'calc(50% - 1px)';
                newcollapse = 0;
            }
            this.setState({
                collapse: newcollapse
            });
        };
    }
    render() {
        let collapse = this.state.collapse;
        styles.collapsetabtop.display = (collapse == 1) ? 'none' : 'flex';
        styles.collapsetabbottom.display = (collapse == -1) ? 'none' : 'flex';
        // mutated values not allowed (deprectated by React); make fresh clones
        const topframe = Object.assign({}, styles.topframe);
        const splitter = Object.assign({}, styles.splitter);
        const collapsetabtop = Object.assign({}, styles.collapsetabtop);
        const collapsetabbottom = Object.assign({}, styles.collapsetabbottom);
        const bottomframe = Object.assign({}, styles.bottomframe);
        return <div style={styles.splitterframe}>
            <div style={topframe}>
                {this.props.primaryPane}
            </div>
            <div style={splitter}>
                <div onClick={e => {
            this.onCollapseCall('primary');
        }} style={collapsetabtop}>
                    <FontIcon className="material-icons">
                        {!collapse ? 'arrow_drop_down' :
            (collapse == -1) ? 'arrow_drop_up' :
                'arrow_drop_down'}
                    </FontIcon>
                </div>
                <div onClick={e => {
            this.onCollapseCall('secondary');
        }} style={collapsetabbottom}>
                    <FontIcon className="material-icons">
                        {!collapse ? 'arrow_drop_up' :
            (collapse == 1) ? 'arrow_drop_down' :
                'arrow_drop_up'}
                    </FontIcon>
                </div>
            </div>
            <div style={bottomframe}>
                {this.props.secondaryPane}
            </div>
        </div>;
    }
}
export default Splitter;
//# sourceMappingURL=splitter.jsx.map