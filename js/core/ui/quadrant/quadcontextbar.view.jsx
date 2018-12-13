// quadtitlebar.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import React from 'react';
import { withStyles, createStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import BoxIdentityBar from '../databox/identitybar.view';
import DirectoryBar from '../databox/directorybar.view';
import RootDirectoryBarHolder from '../databox/rootdirectorybarholder.view';
import proxy from '../../utilities/proxy';
const styles = createStyles({
    root: {
        position: 'relative',
        height: '38px',
        backgroundColor: 'white',
        boxSizing: 'border-box',
        width: '100%',
        borderRadius: '5px 5px 0 0',
        borderBottom: '1px solid silver',
        overflow: 'hidden',
        fontSize: 'smaller',
    },
    aliasbox: {
        position: 'absolute',
        top: '0',
        left: '0',
        zIndex: 3,
        backgroundColor: 'white',
        border: '1px solid gray',
        boxSizing: 'border-box',
        height: '24px',
        width: '24px',
        fontSize: '20px',
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'gray',
    },
    titlebox: {
        position: 'absolute',
        top: '0',
        width: 'calc(100% - 35px)',
        height: '42px',
        overflow: 'auto',
        boxSizing: 'border-box',
        padding: '3px 0 0 30px',
    },
    titlewrap: {
        display: 'flex',
        flexFlow: 'row nowrap',
        alignItems: 'center',
    },
});
class QuadContextBar extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            context: null
        };
        this.datastack = null;
        this.stackpointer = null;
        this.createcontext = () => {
            // console.log('create context',this.datastack, this.stackpointer)
            if (this.datastack.length <= 1 || !this.stackpointer) { // no context
                if (this.state.context) {
                    this.setState({
                        context: null
                    });
                }
                return;
            }
            const { datastack, stackpointer } = this;
            let { classes } = this.props;
            let context = [];
            for (let n = 1; n < datastack.length; n++) {
                let stacklayer = datastack[n];
                if (stacklayer.source.action == 'select') { // ignore; no change in context
                    continue;
                }
                let itemProxy = stacklayer.source.itemProxy;
                if (itemProxy.liststack.length) { // make list entry
                    let listtoken = itemProxy.listStack[itemProxy.liststack.length - 1];
                    let listProxy = new proxy(listtoken);
                    let component = <DirectoryBar key={n + 'list'} haspeers={false} listProxy={listProxy} setDocumentListener={this.props.callbacks.setDocumentListener} removeDocumentListener={this.props.callbacks.removeDocumentListener} callDataDrawer={this.props.callDataDrawer} listStack={itemProxy.liststack} collapseDirectoryItem={() => { }} contextitem/>;
                    context.push(<Icon key={n + 'icon'} style={{ opacity: .54 }}>chevron_right</Icon>);
                    context.push(component);
                }
                else { // make item entry and root list entry
                    let { itemProxy } = stacklayer.source;
                    let newItemProxy = new proxy({
                        doctoken: itemProxy.doctoken,
                        liststack: itemProxy.liststack.slice(),
                    });
                    context.push(<BoxIdentityBar key={n + 'item'} itemProxy={newItemProxy} setDocumentListener={this.props.callbacks.setDocumentListener} removeDocumentListener={this.props.callbacks.removeDocumentListener} callDataDrawer={this.props.callDataDrawer} contextitem/>);
                    let holderItemProxy = new proxy({
                        doctoken: itemProxy.doctoken,
                        liststack: itemProxy.liststack.slice(),
                    });
                    let component = <RootDirectoryBarHolder key={n + 'list'} itemProxy={holderItemProxy} setDocumentListener={this.props.callbacks.setDocumentListener} removeDocumentListener={this.props.callbacks.removeDocumentListener} callDataDrawer={this.props.callDataDrawer}/>;
                    context.push(<Icon key={n + 'icon'} style={{ opacity: .54 }}>chevron_right</Icon>);
                    context.push(component);
                }
            }
            if (context.length) {
                context.push(<Icon key={'iconend'} style={{ opacity: .54 }}>arrow_drop_down</Icon>);
                this.setState({
                    context,
                });
            }
            else {
                if (this.state.context) { // defensive
                    this.setState({
                        context: null,
                    });
                }
            }
        };
    }
    componentDidUpdate(prevProps) {
        if ((this.stackpointer === null) ||
            (prevProps.stackpointer != this.props.stackpointer) ||
            (prevProps.datastack.length != this.datastack.length)) {
            this.stackpointer = this.props.stackpointer;
            this.datastack = this.props.datastack;
            this.createcontext();
        }
    }
    render() {
        let { quadidentifier: alias, classes, datastack, stackpointer } = this.props;
        // console.log('datastack, stackpointer', datastack, stackpointer)
        return (<div className={classes.root}>
            <div className={classes.aliasbox}>
                {alias} 
            </div>
            <div className={classes.titlebox}>
                <div className={classes.titlewrap}>
                    {this.state.context}
                </div>
            </div>
        </div>);
    }
}
export default withStyles(styles)(QuadContextBar);
//# sourceMappingURL=quadcontextbar.view.jsx.map