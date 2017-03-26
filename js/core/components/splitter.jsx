// splitter.tsx
/*
    TODO: bug showing tabs when collapse is not 0
*/
import * as React from 'react';
import FontIcon from 'material-ui/FontIcon';
import { styles as globalstyles } from '../utilities/styles';
import DragHandle from './draghandle';
import MoveDraghandleLayer from './movedraghandlelayer';
let styles = globalstyles.splitter;
class Splitter extends React.Component {
    constructor(props) {
        super(props);
        this.dragUpdate = (args) => {
            let newdivision = (((args.frameDimensions.reference + args.diffOffset.y)
                / args.frameDimensions.height) * 100);
            if (newdivision > 100)
                newdivision = 100;
            if (newdivision < 0)
                newdivision = 0;
            // console.log('dragupdate args',args,newdivision)
            styles.topframe.bottom = `calc(${100 - newdivision}% + 1px)`;
            styles.bottomframe.top = `calc(${newdivision}% + 1px)`;
            styles.splitter.bottom = `calc(${100 - newdivision}% - 1px)`;
            this.setState({
                division: newdivision,
                collapse: 0
            });
        };
        this.getFrameDimensions = () => {
            let el = document.getElementById('splitterframe');
            let { collapse } = this.state;
            let reference;
            if (collapse) {
                reference = (collapse == -1) ? 0 : el.clientHeight;
            }
            else {
                reference = (el.clientHeight * (this.state.division / 100));
            }
            let frameDimensions = {
                height: el.clientHeight,
                width: el.clientWidth,
                reference,
            };
            console.log('frameDimensions', frameDimensions);
            return frameDimensions;
        };
        this.onCollapseCall = (selection) => {
            let collapse = this.state.collapse;
            let newcollapse = null;
            if (!collapse) {
                if (selection == 'primary') {
                    newcollapse = 1;
                }
                else {
                    newcollapse = -1;
                }
            }
            else {
                newcollapse = 0;
            }
            this.setCollapseStyles(newcollapse);
            this.setState({
                collapse: newcollapse
            });
        };
        this.setCollapseStyles = (collapse) => {
            if (collapse) {
                if (collapse == 1) {
                    styles.topframe.bottom = '2px';
                    styles.bottomframe.top = '100%';
                    styles.splitter.bottom = '0px';
                }
                else {
                    styles.topframe.bottom = '100%';
                    styles.bottomframe.top = '2px';
                    styles.splitter.bottom = 'calc(100% - 2px)';
                }
            }
            else {
                styles.topframe.bottom = `calc(${100 - this.state.division}% + 1px)`;
                styles.bottomframe.top = `calc(${this.state.division}% + 1px)`;
                styles.splitter.bottom = `calc(${100 - this.state.division}% - 1px)`;
            }
        };
        let { division, collapse, orientation } = this.props;
        if (division < 0)
            division = 0;
        if (division > 100)
            division = 100;
        orientation = orientation || 'horizontal';
        this.state = {
            division,
            collapse,
            orientation,
        };
        this.setCollapseStyles(collapse);
    }
    // update state if division or collapse changes
    componentWillReceiveProps(nextProps) {
    }
    render() {
        let collapse = this.state.collapse;
        styles.collapsetabtop.display = (collapse == -1) ? 'none' : 'flex';
        styles.collapsetabbottom.display = (collapse == 1) ? 'none' : 'flex';
        // mutated values not allowed (deprectated by React); make fresh clones
        const topframe = Object.assign({}, styles.topframe);
        const splitter = Object.assign({}, styles.splitter);
        const collapsetabtop = Object.assign({}, styles.collapsetabtop);
        const collapsetabbottom = Object.assign({}, styles.collapsetabbottom);
        const bottomframe = Object.assign({}, styles.bottomframe);
        const draghandle = Object.assign({}, styles.draghandle);
        return <div id='splitterframe' style={styles.splitterframe}>
            <div style={topframe}>
                {this.props.primaryPane}
            </div>
            <div style={splitter}>
                <DragHandle dragUpdate={this.dragUpdate} getFrameDimensions={this.getFrameDimensions}/>
                <MoveDraghandleLayer />
                <div onClick={e => {
            this.onCollapseCall('primary');
        }} style={collapsetabtop}>
                    <FontIcon className="material-icons">
                        {!collapse ? 'arrow_drop_down' :
            (collapse == 1) ? 'arrow_drop_up' :
                'arrow_drop_down'}
                    </FontIcon>
                </div>
                <div onClick={e => {
            this.onCollapseCall('secondary');
        }} style={collapsetabbottom}>
                    <FontIcon className="material-icons">
                        {!collapse ? 'arrow_drop_up' :
            (collapse == -1) ? 'arrow_drop_down' :
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