// databox.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import React from 'react';
import Icon from '@material-ui/core/Icon';
import CircularProgress from '@material-ui/core/CircularProgress';
import BoxIdentityBar from './databox/identitybar.view';
import BoxTypebar from './databox/typebar.view';
// import ProfileBar from './databox/profilebar.view'
// import ProfileForm from './databox/profileform.view'
import DirectoryBar from './databox/directorybar.view';
import DirectoryList from './databox/directorylist.view';
// import ScanBar from './databox/scanbar.view'
import proxy from '../utilities/proxy';
const tabstyles = {
    position: 'absolute',
    right: '-22px',
    top: 'calc(50% - 16px)',
    width: '20px',
    height: '32px',
    border: '1px solid gray',
    borderLeft: '1px solid transparent',
    backgroundColor: 'white',
    borderRadius: '0 8px 8px 0',
    opacity: .54,
};
const wrapperstyles = { margin: '4px 0 0 -3px' };
const iconstyles = { transform: 'rotate(90deg)', opacity: .54 };
const ResizeTab = props => {
    return <div style={tabstyles}>
        <div style={wrapperstyles}>
            <Icon style={iconstyles}>drag_handle</Icon>
        </div>
    </div>;
};
class DataBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            highlightrefuid: null,
            item: null,
            MainlistProxy: null,
            BarlistProxy: null,
            TypelistProxy: null,
        };
        // always available; no need to check state
        this.itemProxy = this.props.itemProxy;
        this.cacheItemData = (data, type) => {
            this.setState({
                item: {
                    data,
                    type
                }
            }, () => {
                if (!this.state.MainlistProxy) { // no proxies have been set
                    let listdoctoken;
                    if (this.itemProxy.liststack.length) {
                        listdoctoken = this.itemProxy.liststack[this.itemProxy.liststack.length - 1];
                    }
                    else {
                        listdoctoken = this.state.item.data.list;
                    }
                    this.setState({
                        MainlistProxy: new proxy({ token: listdoctoken }),
                        BarlistProxy: new proxy({ token: listdoctoken }),
                        TypelistProxy: new proxy({ token: listdoctoken }),
                    });
                }
            });
        };
        this.doHighlights = (collapseTargetProxy) => {
            this.props.callbacks.highlightBox({ boxElement: this.boxframe.current });
            if (collapseTargetProxy.action == 'expand' ||
                collapseTargetProxy.action == 'splay') {
                let token = collapseTargetProxy.liststack[collapseTargetProxy.liststack.length - 1];
                if (token) {
                    setTimeout(() => {
                        this.setState({
                            highlightrefuid: token.uid,
                        }, () => {
                            this.setState({
                                highlightrefuid: null
                            });
                        });
                    });
                }
            }
        };
        this.collapseDirectoryItem = () => {
            this.props.callbacks.collapseDirectoryItem(this.itemProxy);
        };
        this.splayBox = (domSource, listDocument) => {
            return this.props.callbacks.splayBox(domSource, this.listcomponent, listDocument);
        };
        this.highlightItem = (itemref) => {
            let itemelement = itemref.current;
            itemelement.classList.add('highlight');
            setTimeout(() => {
                itemelement.classList.remove('highlight');
            }, 2000);
        };
        this.indexmarker = () => {
            return (this.props.haspeers ?
                <div style={{
                    position: 'absolute',
                    bottom: '-16px',
                    left: '0',
                    fontSize: 'smaller',
                    color: 'gray',
                }}>{this.props.index + 1}</div>
                : null);
        };
        this.listcallbacks = {
            setListListener: this.props.callbacks.setListListener,
            removeListListener: this.props.callbacks.removeListListener,
            expandDirectoryItem: this.props.callbacks.expandDirectoryItem,
            highlightItem: this.highlightItem,
        };
        this.typecallbacks = {
            setListListener: this.props.callbacks.setListListener,
            removeListListener: this.props.callbacks.removeListListener,
            splayBox: this.splayBox,
            selectFromSplay: this.props.callbacks.selectFromSplay,
        };
        this.boxframe = React.createRef();
        this.listcomponent = React.createRef();
    }
    componentDidMount() {
        let { itemProxy } = this;
        this.props.callbacks.setItemListener(itemProxy.token, itemProxy.instanceid, this.cacheItemData);
    }
    componentDidUpdate() {
        let { collapseTargetProxy } = this.props; // gets set then cancelled by parent
        if (collapseTargetProxy) { // if found, queue the trigger
            this.queueCollapseTargetProxy = collapseTargetProxy;
        }
        if (!this.state.item)
            return; // wait for item document to appear
        if (!this.queueCollapseTargetProxy)
            return;
        // pick up and clear the queue
        collapseTargetProxy = this.queueCollapseTargetProxy;
        this.queueCollapseTargetProxy = null;
        // check sentinel
        if (this.collapseTargetProxy)
            return; // avoid infinite recursion, triggered by list highlight
        // set sentinel
        this.collapseTargetProxy = collapseTargetProxy;
        setTimeout(() => {
            this.doHighlights(collapseTargetProxy);
            setTimeout(() => {
                this.collapseTargetProxy = null; // clear sentinel
            }, 2000);
        });
    }
    componentWillUnmount() {
        // unsubscribe data
        let { itemProxy } = this;
        this.props.callbacks.removeItemListener(itemProxy.token, itemProxy.instanceid);
    }
    render() {
        let { haspeers } = this.props;
        let item = this.state.item ? this.state.item.data : null;
        let itemType = this.state.item ? this.state.item.type : null;
        let listStack = this.itemProxy.liststack;
        let wrapperStyle = {
            float: haspeers ? 'left' : 'none',
            padding: '16px',
        };
        let frameStyle = {
            width: this.props.boxwidth + 'px',
            backgroundColor: 'white',
            border: this.collapseTargetProxy ? '1px solid blue' : '1px solid silver',
            maxHeight: '96%',
            minHeight: '60%',
            boxSizing: 'border-box',
            borderRadius: '8px',
            fontSize: 'smaller',
            boxShadow: haspeers ? 'none' : '0 0 12px black',
            margin: haspeers ? 'none' : 'auto',
            position: 'relative',
        };
        if (!item) {
            let wrapperStyle2 = Object.assign({}, wrapperStyle);
            wrapperStyle2.height = '100%';
            wrapperStyle2.boxSizing = 'border-box';
            let frameStyle2 = Object.assign({}, frameStyle);
            frameStyle2.padding = '16px';
            frameStyle2.maxHeight = '100%';
            frameStyle2.height = frameStyle2.maxHeight;
            return <div style={wrapperStyle2}>
                <div style={frameStyle2}>
                    <CircularProgress size={24}/>
                </div>
            </div>;
        }
        return <div style={wrapperStyle}>
            <div style={frameStyle} ref={this.boxframe}>
            {haspeers ? null : <ResizeTab />}
            <BoxTypebar item={item} itemType={itemType /*future*/} listProxy={this.state.TypelistProxy} haspeers={this.props.haspeers} callbacks={this.typecallbacks}/>
            <BoxIdentityBar item={item}/>
            <div style={{
            height: 'calc(100% - 78px)',
            position: 'relative',
        }}>
                <div>
                    <DirectoryBar listProxy={this.state.BarlistProxy} setListListener={this.props.callbacks.setListListener} removeListListener={this.props.callbacks.removeListListener} listStack={this.itemProxy.liststack} collapseDirectoryItem={this.collapseDirectoryItem}/>
                </div>
                
                <DirectoryList ref={this.listcomponent} listProxy={this.state.MainlistProxy} highlightrefuid={this.state.highlightrefuid} containerHeight={this.props.containerHeight} callbacks={this.listcallbacks}/>
                
                {this.indexmarker()}

            </div>
        </div>
        </div>;
    }
}
export default DataBox;
//# sourceMappingURL=databox.controller.jsx.map