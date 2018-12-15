// navigationmenutab.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import React from 'react';
import { withStyles, createStyles } from '@material-ui/core/styles';
import ActionButton from '../common/actionbutton.view';
const styles = createStyles({
    tabstyles: {
        position: 'absolute',
        right: '-38px',
        top: '-1px',
        width: '36px',
        border: '1px solid silver',
        backgroundColor: '#f2f2f2',
        borderRadius: '0 8px 8px 0',
    },
});
class NavigationMenuTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: null
        };
        this.cacheListDocument = (document, type, change) => {
            this.setState({
                list: {
                    document,
                    type
                }
            });
        };
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
    componentDidUpdate() {
        if (!this.listProxy && this.props.listProxy) {
            this.listProxy = this.props.listProxy;
            this.props.callbacks.setDocumentListener({
                doctoken: this.listProxy.doctoken,
                instanceid: this.listProxy.instanceid,
                callback: this.cacheListDocument
            });
        }
    }
    componentWillUnmount() {
        if (this.listProxy) {
            this.props.callbacks.removeDocumentListener({
                doctoken: this.listProxy.doctoken,
                instanceid: this.listProxy.instanceid,
            });
        }
    }
    render() {
        const { classes } = this.props;
        let listcount = this.state.list ? this.state.list.document.data.lists.length : 0;
        return (<div className={classes.tabstyles}>
                <div className={classes.splaybuttonwrapper} ref={this.splaydomsource}>
                    <ActionButton img='/public/icons/ic_splay_24px.svg' disabled={!listcount} action={this.splayBox()}/>
                </div>
                <div className={classes.buttonwrapper} ref={this.selectdomsource}>
                    <ActionButton iconStyle={{ transform: 'rotate(90deg)' }} disabled={!this.props.haspeers} img='/public/icons/ic_splay_24px.svg' action={this.selectFromSplay()}/>
                </div>
                <div className={classes.buttonwrapper}>
                    <ActionButton icon='arrow_back' action={this.props.collapseDirectoryItem} disabled={!this.props.liststack.length}/>
                </div>
                {true && <div className={classes.buttonwrapper} ref={this.zoomdomsource}>
                    <ActionButton disabled icon='zoom_out_map'/>
                </div>}
                {false && <div className={classes.buttonwrapper} ref={this.zoomdomsource}>
                    <ActionButton icon='expand_more'/>
                </div>}
            </div>);
    }
}
export default withStyles(styles)(NavigationMenuTab);
//# sourceMappingURL=navigationmenutab.view.jsx.map