// quaddatapane.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import React from 'react';
import { withStyles, createStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
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
            let superuser = ((this.props.user) && (this.props.user.uid == '112979797407042560714'));
            if (this.state.open) {
                if (!superuser) {
                    toast.info('Data Drawer data is only available to Henrik Bechmann as this time');
                }
                else {
                    let parm = {
                        reference: this.state.specs.collection,
                        success: this.dataSuccess,
                        failure: this.dataFailure,
                    };
                    application.getCollection(parm);
                }
            }
            else {
                if (superuser) {
                    this.data = null;
                    this.forceUpdate();
                }
            }
        };
        this.dataSuccess = queryData => {
            this.data = queryData;
            this.forceUpdate();
        };
        this.dataFailure = error => {
            console.log('collection fetch error', error);
            toast.error(error);
        };
        this.getListItems = () => {
            let items = [];
            let data = this.data;
            if (!data)
                return items;
            for (let item of data) {
                items.push(<ListItem dense key={item.reference}>
                    <ListItemText primary={item.reference}/>
                </ListItem>);
            }
            return items;
        };
    }
    componentDidUpdate() {
        let { open, dataspecs } = this.props;
        dataspecs = dataspecs || {};
        let { opcode, specs } = dataspecs;
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
        const { classes, dataspecs } = this.props;
        return <Paper className={classes.root}>
            <div className={classes.content}>
                <div className={classes.platform}>
                    <List dense disablePadding>
                        {this.getListItems()}
                    </List>
                </div>
            </div>
        </Paper>;
    }
}
export default withStyles(styles)(BuildDataPane);
//# sourceMappingURL=builddatapane.view.jsx.map