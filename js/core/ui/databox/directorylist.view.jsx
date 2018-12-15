// directorylist.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import React from 'react';
import Lister from 'react-list';
import { withStyles, createStyles } from '@material-ui/core/styles';
import DirectoryListItem from './directorylistitem.view';
import docproxy from '../../utilities/docproxy';
import LoadingMessage from '../common/loadingmessage.view';
const styles = createStyles({
    scrollboxcontainer: {
        position: 'relative',
        flex: '1 1 0',
        width: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexFlow: 'column'
    },
    scrollbox: {
        flex: '1 1 0',
        // height:'100%',
        overflow: 'auto',
        position: 'relative',
        // paddingBottom:'32px', // leave room for add button
        // WebkitOverflowScrolling:'touch', // attempt to achieve scrolling on ios
        width: '100%',
        boxSizing: 'border-box',
    },
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
        this.cacheListDocument = (document, type, change) => {
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
            let listproxies = listtokens.map((doctoken) => {
                return new docproxy({ doctoken });
            });
            return listproxies;
        };
        this.updateListProxies = (listDocument, oldListProxies) => {
            // console.log('updating listproxies')
            let pathMap = this.pathToIndexMap;
            let listtokens = listDocument.data.lists;
            let listproxies = listtokens.map((doctoken) => {
                let reference = doctoken.reference; // `/${doctoken.collection}/${doctoken.id}`
                let docproxy = oldListProxies[pathMap[reference]];
                if (!docproxy) {
                    // console.log('generating new docproxy')
                    docproxy = new docproxy({ doctoken });
                }
                return docproxy;
            });
            // console.log('updated list proxies',listproxies)
            return listproxies;
        };
        this.generatePathToIndexMap = (listProxies) => {
            let pathMap = {};
            for (let index = 0; index < listProxies.length; index++) {
                pathMap[listProxies[index].reference] = index;
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
            // this.listcomponent.current.scrollAround(index)
            this.listcomponent.current.scrollAround(index);
            // console.log('index',index)
            setTimeout(() => {
                // animate highlight
                this.setState({
                    highlightrefuid,
                }, () => {
                    this.setState({
                        highlightrefuid: null
                    });
                });
            }, 500);
        };
        this.findlinkIndex = (id) => {
            return (item) => {
                return item.id == id;
            };
        };
        this.expandDirectoryItem = (doctoken) => {
            return (domSource) => {
                this.props.callbacks.expandDirectoryItem(doctoken, domSource);
            };
        };
        this.itemRenderer = (index, key) => {
            let docproxy = this.state.listproxies[index];
            return this.getListComponent(docproxy, key, index);
        };
        this.getListComponent = (docproxy, key, index) => {
            let highlight = (docproxy.id === this.state.highlightrefuid);
            let directorylistitem = <DirectoryListItem key={docproxy.instanceid} listProxy={docproxy} setDocumentListener={this.props.callbacks.setDocumentListener} removeDocumentListener={this.props.callbacks.removeDocumentListener} expandDirectoryItem={this.expandDirectoryItem(docproxy.doctoken)} highlight={highlight} highlightItem={this.props.callbacks.highlightItem}/>;
            return directorylistitem;
        };
        this.listcomponent = this.props.forwardedRef;
    }
    componentDidUpdate() {
        if (!this.listProxy && this.props.listProxy) {
            this.listProxy = this.props.listProxy;
            let parms = {
                doctoken: this.listProxy.doctoken,
                instanceid: this.listProxy.instanceid,
                callback: this.cacheListDocument
            };
            this.props.callbacks.setDocumentListener(parms);
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
            let parms = {
                doctoken: this.listProxy.doctoken,
                instanceid: this.listProxy.instanceid,
            };
            this.props.callbacks.removeDocumentListener(parms);
        }
    }
    render() {
        let { classes } = this.props;
        let length = this.state.listproxies ? this.state.listproxies.length : 0;
        return (<div className={classes.scrollboxcontainer}>
            <div className={classes.scrollbox}>
                {this.state.listproxies ? <Lister axis='y' ref={this.props.forwardedRef} itemRenderer={this.itemRenderer} length={length} type='uniform' useStaticSize/> : <div style={{ height: '31px' }}>
                    <LoadingMessage />
                </div>}
            </div>
        </div>);
    }
});
const DirectoryList = React.forwardRef((props, ref) => {
    return <DirectoryListBase {...props} forwardedRef={ref}/>;
});
export default DirectoryList;
//# sourceMappingURL=directorylist.view.jsx.map