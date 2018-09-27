// directorylist.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
/*
    MOVE MODIFYBUTTONS TO HERE
*/
'use strict';
import React from 'react';
import Lister from 'react-list';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import DirectoryItem from './directoryitem.view';
import proxy from '../../utilities/proxy';
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
            list: null,
            listproxies: null,
        };
        this.listProxy = null;
        this.pathToIndexMap = null;
        this.highlightrefuid = null;
        this.cacheListDocument = (data, type) => {
            let listproxies;
            if (!this.state.listproxies) {
                listproxies = this.generateListProxies(data);
            }
            else {
                listproxies = this.updateListProxies(data, this.state.listproxies);
            }
            this.pathToIndexMap = this.generatePathToIndexMap(listproxies);
            this.setState({
                list: {
                    data,
                    type
                },
                listproxies,
            });
        };
        this.generateListProxies = (listDocument) => {
            let listtokens = listDocument.data.lists;
            let listproxies = listtokens.map((token) => {
                return new proxy({ token });
            });
            return listproxies;
        };
        this.updateListProxies = (listDocument, oldListProxies) => {
            // console.log('updating listproxies')
            let pathMap = this.pathToIndexMap;
            let listtokens = listDocument.data.lists;
            let listproxies = listtokens.map((token) => {
                let path = `${token.repo}/${token.uid}`;
                let proxy = oldListProxies[pathMap[path]];
                if (!proxy) {
                    // console.log('generating new proxy')
                    proxy = new proxy({ token });
                }
                return proxy;
            });
            // console.log('updated list proxies',listproxies)
            return listproxies;
        };
        this.generatePathToIndexMap = (listProxies) => {
            let pathMap = {};
            for (let index = 0; index < listProxies.length; index++) {
                pathMap[listProxies[index].path] = index;
            }
            return pathMap;
        };
        this.dohighlight = () => {
            if ((!this.highlightrefuid) || (!this.state.listproxies.length))
                return;
            let { listproxies } = this.state;
            // keep; value will be purged
            let highlightrefuid = this.highlightrefuid;
            this.highlightrefuid = null;
            // get index for Lister
            let index = listproxies.findIndex(this.findlinkIndex(highlightrefuid));
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
            let proxy = this.state.listproxies[index];
            return this.getListComponent(proxy, key, index);
        };
        this.getListComponent = (proxy, key, index) => {
            // let listDocument = this.setListListener(token)
            let highlight = (proxy.uid === this.state.highlightrefuid);
            let directoryitem = <DirectoryItem key={proxy.instanceid} listProxy={proxy} setListListener={this.props.callbacks.setListListener} removeListListener={this.props.callbacks.removeListListener} expandDirectoryItem={this.expandDirectoryItem(proxy.token)} highlight={highlight} highlightItem={this.props.callbacks.highlightItem}/>;
            return directoryitem;
        };
        this.modifybuttons = (listItemType) => {
            if (!listItemType)
                return null;
            let outgoing = listItemType.properties.static.is.outgoing;
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
            this.props.callbacks.setListListener(this.listProxy.token, this.listProxy.instanceid, this.cacheListDocument);
        }
        if (this.props.highlightrefuid) {
            this.highlightrefuid = this.props.highlightrefuid;
        }
        if (this.state.listproxies) {
            setTimeout(() => {
                this.dohighlight();
            });
        }
    }
    componentWillUnmount() {
        if (this.listProxy) {
            this.props.callbacks.removeListListener(this.listProxy.token, this.listProxy.instanceid);
        }
    }
    render() {
        let scrollboxstyle = {
            height: (this.props.containerHeight - 185) + 'px',
            overflow: 'auto',
            position: 'relative',
            paddingLeft: '6px',
            paddingBottom: '32px',
        };
        let length = this.state.listproxies ? this.state.listproxies.length : 0;
        return (<div style={{ position: 'relative' }}>
            <div style={scrollboxstyle}>
                {this.state.listproxies ? <Lister ref={this.props.forwardedRef} itemRenderer={this.itemRenderer} length={length} type='uniform' useStaticSize/> : <CircularProgress size={24}/>}
            </div>
            {this.modifybuttons(this.state.list ? this.state.list.type : null)}
        </div>);
    }
}
const DirectoryList = React.forwardRef((props, ref) => {
    return <DirectoryListBase {...props} forwardedRef={ref}/>;
});
export default DirectoryList;
//# sourceMappingURL=directorylist.view.jsx.map