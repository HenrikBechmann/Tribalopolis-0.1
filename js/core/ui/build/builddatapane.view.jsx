// quaddatapane.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import React from 'react';
import { withStyles, createStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import application from '../../services/application';
import { toast } from 'react-toastify';
let _ = require('lodash');
const styles = createStyles({
    root: {
        position: 'absolute',
        top: '15px',
        right: '6px',
        bottom: '6px',
        left: '6px',
        overflow: 'auto',
    },
    content: {
        padding: '3px',
    },
    platform: {
        width: '100%',
        padding: '3px',
    }
});
class BuildDataPane extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            open: this.props.open,
            opcode: this.props.dataPack ? this.props.dataPack.opcode : undefined,
            specs: this.props.dataPack ? this.props.dataPack.specs : undefined,
        };
        this.data = null;
        this.updateData = () => {
            console.log('updating data');
            if (this.state.open) {
                application.getCollection(this.state.specs.collection, this.dataSuccess, this.dataFailure);
            }
            else {
                console.log('clearing data');
                this.data = null;
                this.forceUpdate();
            }
        };
        this.dataSuccess = queryData => {
            console.log('queryData', queryData);
            this.data = queryData;
            this.forceUpdate();
        };
        this.dataFailure = error => {
            console.log('collection fetch error', error);
            toast.error(error);
        };
    }
    componentDidUpdate() {
        let { open, dataPack } = this.props;
        dataPack = dataPack || {};
        let { opcode, specs } = dataPack;
        if (!_.isEqual(open, this.state.open) ||
            !_.isEqual(opcode, this.state.opcode) ||
            !_.isEqual(specs, this.state.specs)) {
            // console.log('not equal; run setState',this.props, this.state)
            this.setState({
                open,
                opcode,
                specs,
            }, () => {
                this.updateData();
            });
        }
    }
    render() {
        const { classes, dataPack } = this.props;
        console.log('props', this.props);
        return <Paper className={classes.root}>
            <div className={classes.content}>
                <div className={classes.platform}>
                    Build Data shelf {dataPack ? dataPack.opcode : null}
                </div>
            </div>
        </Paper>;
    }
}
export default withStyles(styles)(BuildDataPane);
//# sourceMappingURL=builddatapane.view.jsx.map