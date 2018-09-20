// databox.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import React from 'react';
import BoxIdentityBar from './databox/identitybar.view';
import BoxTypebar from './databox/typebar.view';
// import ProfileBar from './databox/profilebar.view'
// import ProfileForm from './databox/profileform.view'
import DirectoryBar from './databox/directorybar.view';
import DirectoryList from './databox/directorylist.view';
// import ScanBar from './databox/scanbar.view'
import proxy from '../utilities/proxy';
import Icon from '@material-ui/core/Icon';
import CircularProgress from '@material-ui/core/CircularProgress';
const ResizeTab = props => {
    return <div style={{
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
    }}>
        <div style={{ margin: '4px 0 0 -3px' }}>
            <Icon style={{ transform: 'rotate(90deg)', opacity: .54 }}>drag_handle</Icon>
        </div>
    </div>;
};
class DataBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            highlightrefuid: null,
            item: null,
            listProxy: null,
            listBarProxy: null,
            listTypeProxy: null,
        };
        this.itemProxy = this.props.itemProxy;
        this.cacheItemData = (data, type) => {
            this.setState({
                item: {
                    data,
                    type
                }
            }, () => {
                if (!this.state.listProxy) { // no proxies have been set
                    let listdoctoken;
                    if (this.itemProxy.liststack.length) {
                        listdoctoken = this.itemProxy.liststack[this.itemProxy.liststack.length - 1];
                    }
                    else {
                        listdoctoken = this.state.item.data.list;
                    }
                    this.setState({
                        listProxy: new proxy({ token: listdoctoken }),
                        listBarProxy: new proxy({ token: listdoctoken }),
                        listTypeProxy: new proxy({ token: listdoctoken }),
                    });
                }
            });
        };
        this.doHighlights = (collapseTargetData) => {
            this.props.callbacks.highlightBox({ boxElement: this.boxframe.current });
            if (collapseTargetData.action == 'expand' ||
                collapseTargetData.action == 'splay') {
                let token = collapseTargetData.liststack[collapseTargetData.liststack.length - 1];
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
            expandDirectoryItem: this.props.callbacks.expandDirectoryItem,
            highlightItem: this.highlightItem,
        };
        this.typecallbacks = {
            setListListener: this.props.callbacks.setListListener,
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
        let { collapseTargetData } = this.props;
        if (collapseTargetData) {
            this.waitingCollapseTargetData = collapseTargetData;
        }
        if (!this.state.item)
            return;
        if (!this.waitingCollapseTargetData)
            return;
        collapseTargetData = this.waitingCollapseTargetData;
        this.waitingCollapseTargetData = null;
        if (this.collapseTargetData)
            return; // avoid infinite recursion, triggered by list highlight
        this.collapseTargetData = collapseTargetData;
        setTimeout(() => {
            this.doHighlights(collapseTargetData);
            setTimeout(() => {
                this.collapseTargetData = null;
            }, 2000);
        });
    }
    componentWillUnmount() {
        // unsubscribe data
    }
    render() {
        let { setListListener, haspeers } = this.props;
        let item = this.state.item ? this.state.item.data : null;
        let itemType = this.state.item ? this.state.item.type : null;
        let wrapperStyle = {
            float: haspeers ? 'left' : 'none',
            padding: '16px',
        };
        let frameStyle = {
            width: this.props.boxwidth + 'px',
            backgroundColor: 'white',
            border: this.collapseTargetData ? '1px solid blue' : '1px solid silver',
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
        let listStack = this.itemProxy.liststack;
        let scrollboxstyle = {
            height: (this.props.containerHeight - 185) + 'px',
            overflow: 'auto',
            position: 'relative',
            paddingLeft: '6px',
            paddingBottom: '32px',
        };
        return <div style={wrapperStyle}>
            <div style={frameStyle} ref={this.boxframe}>
            {haspeers ? null : <ResizeTab />}
            <BoxTypebar item={item} itemType={itemType} listProxy={this.state.listTypeProxy} haspeers={this.props.haspeers} callbacks={this.typecallbacks}/>
            <BoxIdentityBar item={item}/>
            <div style={{
            height: 'calc(100% - 78px)',
            position: 'relative',
        }}>
                <div>
                    <DirectoryBar listProxy={this.state.listBarProxy} setListListener={this.props.callbacks.setListListener} listStack={this.itemProxy.liststack} collapseDirectoryItem={this.collapseDirectoryItem}/>
                </div>
                
                <div style={scrollboxstyle}>
                    <DirectoryList ref={this.listcomponent} listProxy={this.state.listProxy} highlightrefuid={this.state.highlightrefuid} callbacks={this.listcallbacks}/>
                </div>
                
                {this.indexmarker()}

            </div>
        </div>
        </div>;
    }
}
// <ProfileBar item = {item} />
// <ProfileForm item = {item} />
// <ScanBar item = {item} />
export default DataBox;
//# sourceMappingURL=databox.controller.jsx.map