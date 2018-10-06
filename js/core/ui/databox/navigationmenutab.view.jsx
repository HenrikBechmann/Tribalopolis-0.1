// resizetab.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import React from 'react';
import { withStyles, createStyles } from '@material-ui/core/styles';
import ActionButton from '../common/actionbutton.view';
const styles = createStyles({
    tabstyles: {
        position: 'absolute',
        right: '-38px',
        top: '10px',
        width: '36px',
        border: '1px solid gray',
        borderLeft: '1px solid transparent',
        backgroundColor: 'white',
        borderRadius: '0 8px 8px 0',
        opacity: .54,
    },
    iconwrapperstyles: {
        margin: '4px 0 0 -3px',
    },
    iconstyles: {
        transform: 'rotate(90deg)', opacity: .54
    },
});
class NavigationMenuTab extends React.Component {
    constructor(props) {
        super(props);
        this.selectFromSplay = () => {
            return () => {
                this.props.callbacks.selectFromSplay(this.selectdomsource.current);
            };
        };
        this.splayBox = () => {
            return () => {
                this.props.callbacks.splayBox(this.splaydomsource.current, this.state.list.document);
            };
        };
        this.splaydomsource = React.createRef();
        this.selectdomsource = React.createRef();
        this.zoomdomsource = React.createRef();
    }
    render() {
        const { classes } = this.props;
        return (<div className={classes.tabstyles}>
                <div className={classes.buttonwrapper} ref={this.zoomdomsource}>
                    <ActionButton icon='zoom_out_map'/>
                </div>
                <div className={classes.buttonwrapper} ref={this.selectdomsource}>
                    <ActionButton iconStyle={{ transform: 'rotate(90deg)' }} disabled={!this.props.haspeers} img='/public/icons/ic_splay_24px.svg' action={this.selectFromSplay()}/>
                </div>
                <div className={classes.splaybuttonwrapper} ref={this.splaydomsource}>
                    <ActionButton img='/public/icons/ic_splay_24px.svg' disabled={!this.props.listcount} action={this.splayBox()}/>
                </div>
            </div>);
    }
}
export default withStyles(styles)(NavigationMenuTab);
//# sourceMappingURL=navigationmenutab.view.jsx.map