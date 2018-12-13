// toolbar.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import React from 'react';
import ActionButton from '../common/actionbutton.view';
import { withStyles, createStyles } from '@material-ui/core/styles';
const styles = createStyles({
    root: {
        position: 'relative',
        width: '100%',
        borderRadius: '8px',
        padding: '3px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        // fontSize:'larger',
        boxSizing: 'border-box',
    },
    buttonwrapper: {
        float: 'right',
        marginLeft: '6px'
    },
    splaybuttonwrapper: {
        float: 'right',
    },
    boxiconwrapper: {
        padding: '3px',
        boxSizing: 'border-box',
        width: '32px',
        height: '32px',
        display: 'inline-block',
        borderRadius: '50%',
        border: '1px solid transparent',
    },
    boxiconimage: {
        verticalAlign: 'bottom',
    },
    name: {
        display: 'inline-block',
        verticalAlign: 'top',
        height: '32px',
        boxSizing: 'border-box',
        border: '1px solid transparent',
        borderRadius: '8px',
        padding: '7px 3px 5px',
        fontStyle: 'italic',
        position: 'relative',
        textOverflow: 'ellipsis',
        maxWidth: '38%',
        overflow: 'hidden',
    }
});
class BoxToolbar extends React.Component {
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
    }
    componentDidUpdate() {
        if (!this.listProxy && this.props.listProxy) {
            this.listProxy = this.props.listProxy;
            this.props.callbacks.setDocumentListener(this.listProxy.doctoken, this.listProxy.instanceid, this.cacheListDocument);
        }
    }
    componentWillUnmount() {
        if (this.listProxy) {
            this.props.callbacks.removeDocumentListener(this.listProxy.doctoken, this.listProxy.instanceid);
        }
    }
    render() {
        let { classes } = this.props;
        let props = this.props;
        let boxicon = '/public/icons/databox.svg';
        let listcount = this.state.list ? this.state.list.document.data.lists.length : 0;
        let haspeers = props.haspeers;
        return <div className={classes.root}>

            <div className={classes.buttonwrapper} ref={this.splaydomsource}>
                <ActionButton icon='zoom_out_map'/>
            </div>
            <div className={classes.buttonwrapper} ref={this.selectdomsource}>
                <ActionButton iconStyle={{ transform: 'rotate(90deg)' }} disabled={!haspeers} img='/public/icons/ic_splay_24px.svg' action={this.selectFromSplay()}/>
            </div>
            <div className={classes.splaybuttonwrapper} ref={this.splaydomsource}>
                <ActionButton img='/public/icons/ic_splay_24px.svg' disabled={!listcount} action={this.splayBox()}/>
            </div>

            <div className={classes.boxiconwrapper}>
                <img className={classes.boxiconimage} src={boxicon}/>
            </div>
            <div className={classes.name}>
                User 
            </div>
            {false && <ActionButton icon='arrow_drop_down' buttonStyle={{ verticalAlign: 'top', float: 'none' }}/>}

        </div>;
    }
}
export default withStyles(styles)(BoxToolbar);
//# sourceMappingURL=typebar.view.jsx.map