// directorylist.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import React from 'react';
import Lister from 'react-list';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles, createStyles } from '@material-ui/core/styles';
import DirectoryItem from './directoryitem.view';
import proxy from '../../utilities/proxy';
const styles = createStyles({
    scrollbox: {
        overflow: 'auto',
        position: 'relative',
        paddingLeft: '6px',
        paddingBottom: '32px',
        width: '100%',
        boxSizing: 'border-box',
        height: '100%',
    }
});
const DirectoryListBase = withStyles(styles)(class extends React.Component {
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
        this.cacheListDocument = (document, type) => {
            let listproxies;
            if (!this.state.listproxies) {
                listproxies = this.generateListProxies(document);
            }
            else {
                listproxies = this.updateListProxies(document, this.state.listproxies);
            }
            this.pathToIndexMap = this.generatePathToIndexMap(listproxies);
            this.setState({
                list: {
                    document,
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
        let { classes } = this.props;
        let length = this.state.listproxies ? this.state.listproxies.length : 0;
        return (<div style={{ position: 'relative', height: '100%', width: '100%', }}>
            <div className={classes.scrollbox}>
                {this.state.listproxies ? <Lister ref={this.props.forwardedRef} itemRenderer={this.itemRenderer} length={length} type='uniform' useStaticSize/> : <CircularProgress size={24}/>}
            </div>
        </div>);
    }
});
const DirectoryList = React.forwardRef((props, ref) => {
    return <DirectoryListBase {...props} forwardedRef={ref}/>;
});
export default DirectoryList;
//# sourceMappingURL=directorylist.view.jsx.map