// directorylist.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import React from 'react';
import DirectoryItem from './directoryitem.view';
import Lister from 'react-list';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
const styles = theme => ({
    button: {
        marginRight: theme.spacing.unit
    },
});
const BaseFloatingAddButton = (props) => {
    const { classes } = props;
    return <Button variant='fab' mini color='secondary' aria-label='Add' className={classes.button}>
      <AddIcon />
    </Button>;
};
const FloatingAddButton = withStyles(styles)(BaseFloatingAddButton);
class DirectoryListBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            highlightrefuid: null,
            listtokens: this.props.listDocument ? this.props.listDocument.list : null,
        };
        this.listProxy = null;
        this.highlightrefuid = null;
        this.setListListener = this.props.callbacks.setListListener;
        this.cacheListData = (data, type) => {
            this.setState({
                list: {
                    data,
                    type
                }
            });
        };
        this.dohighlight = () => {
            if ((!this.highlightrefuid) || (!this.state.listtokens))
                return;
            // console.log('doing highlight')
            // keep; value will be purged
            let highlightrefuid = this.highlightrefuid;
            this.highlightrefuid = null;
            // get index for Lister
            let index = this.state.listtokens.findIndex(this.findlinkIndex(highlightrefuid));
            // update scroll display with selected highlight item
            this.listcomponent.current.scrollAround(index);
            setTimeout(() => {
                // animate highlight
                this.setState({
                    highlightrefuid,
                }, () => {
                    this.setState({
                        highlightrefuid: null
                    });
                });
            }, 300);
        };
        this.findlinkIndex = (uid) => {
            return (item) => {
                return item.uid == uid;
            };
        };
        this.expandDirectoryItem = (token) => {
            return (domSource) => {
                this.props.callbacks.expandDirectoryItem(token, domSource);
            };
        };
        this.itemRenderer = (index, key) => {
            return this.getListComponent(this.state.listtokens[index], key);
        };
        this.getListComponent = (token, key) => {
            let listDocument = this.setListListener(token);
            let highlight = (token.uid === this.state.highlightrefuid);
            let catitem = <DirectoryItem key={key} uid={token.uid} listDocument={listDocument} expandDirectoryItem={this.expandDirectoryItem(token)} highlight={highlight} highlightItem={this.props.callbacks.highlightItem}/>;
            return catitem;
        };
        this.modifybuttons = (listItemType) => {
            if (!listItemType)
                return null;
            let outgoing = listItemType.properties.is.outgoing;
            let retval = outgoing ?
                <div style={{ position: 'absolute', bottom: '-8px', right: '0' }}>
                <FloatingAddButton />
            </div>
                : null;
            return retval;
        };
        this.listcomponent = this.props.forwardedRef;
    }
    componentDidUpdate() {
        if (!this.listProxy && this.props.listProxy) {
            this.listProxy = this.props.listProxy;
        }
        // console.log('componentDidUpdate higlightrefuid',this.props.highlightrefuid)
        if (this.props.highlightrefuid) {
            this.highlightrefuid = this.props.highlightrefuid;
        }
        if ((!this.state.listtokens) && this.props.listDocument) {
            // console.log('setting list state',this.props.highlightrefuid)
            this.setState({
                list: this.props.listDocument.list
            });
        }
        else {
            if (this.props.listDocument) {
                // console.log('calling highlight',this.state, this.highlightrefuid,this.props.highlightrefuid)
                setTimeout(() => {
                    this.dohighlight();
                });
            }
        }
    }
    render() {
        return this.state.listtokens ? <Lister ref={this.props.forwardedRef} itemRenderer={this.itemRenderer} length={this.state.listtokens ? this.state.listtokens.length : 0} type='uniform'/> : <CircularProgress size={24}/>;
    }
}
const DirectoryList = React.forwardRef((props, ref) => {
    return <DirectoryListBase {...props} forwardedRef={ref}/>;
});
export default DirectoryList;
//# sourceMappingURL=directorylist.view.jsx.map