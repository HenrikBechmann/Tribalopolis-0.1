// directorylist.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import React from 'react';
import DirectoryItem from './directoryitem.view';
import Lister from 'react-list';
class DirectoryListBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            highlightrefuid: null,
            list: this.props.listobject.list,
        };
        this.getList = this.props.getList;
        this.findlinkIndex = (uid) => {
            return (item) => {
                return item.uid == uid;
            };
        };
        this.expandDirectoryItem = (datatoken) => {
            return (domSource) => {
                this.props.expandDirectoryItem(datatoken, domSource);
            };
        };
        this.itemRenderer = (index, key) => {
            return this.getListComponent(this.state.list[index], key);
        };
        this.getListComponent = (datatoken, key) => {
            let data = this.getList(datatoken);
            let highlight = (datatoken.uid === this.state.highlightrefuid);
            let catitem = <DirectoryItem key={key} uid={datatoken.uid} data={data} expandDirectoryItem={this.expandDirectoryItem(datatoken)} highlight={highlight} highlightItem={this.props.highlightItem}/>;
            return catitem;
        };
        this.listcomponent = this.props.forwardedRef;
    }
    componentDidUpdate() {
        if (!this.props.highlightrefuid)
            return;
        // keep; value will be purged
        let highlightrefuid = this.props.highlightrefuid;
        // get index for Lister
        let index = this.state.list.findIndex(this.findlinkIndex(highlightrefuid));
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
    }
    render() {
        return <Lister ref={this.props.forwardedRef} itemRenderer={this.itemRenderer} length={this.state.list.length} type='uniform'/>;
    }
}
const DirectoryList = React.forwardRef((props, ref) => {
    return <DirectoryListBase {...props} forwardedRef={ref}/>;
});
export default DirectoryList;
//# sourceMappingURL=directorylist.view.jsx.map