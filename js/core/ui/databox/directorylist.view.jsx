// directorylist.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import React from 'react';
import DirectoryItem from './directoryitem.view';
import Lister from 'react-list';
import CircularProgress from '@material-ui/core/CircularProgress';
class DirectoryListBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            highlightrefuid: null,
            list: this.props.listDocument ? this.props.listDocument.list : null,
        };
        this.highlightrefuid = null;
        this.setListListener = this.props.setListListener;
        this.dohighlight = () => {
            if ((!this.highlightrefuid) || (!this.state.list))
                return;
            // console.log('doing highlight')
            // keep; value will be purged
            let highlightrefuid = this.highlightrefuid;
            this.highlightrefuid = null;
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
        };
        this.findlinkIndex = (uid) => {
            return (item) => {
                return item.uid == uid;
            };
        };
        this.expandDirectoryItem = (token) => {
            return (domSource) => {
                this.props.expandDirectoryItem(token, domSource);
            };
        };
        this.itemRenderer = (index, key) => {
            return this.getListComponent(this.state.list[index], key);
        };
        this.getListComponent = (token, key) => {
            let listDocument = this.setListListener(token);
            let highlight = (token.uid === this.state.highlightrefuid);
            let catitem = <DirectoryItem key={key} uid={token.uid} listDocument={listDocument} expandDirectoryItem={this.expandDirectoryItem(token)} highlight={highlight} highlightItem={this.props.highlightItem}/>;
            return catitem;
        };
        this.listcomponent = this.props.forwardedRef;
    }
    componentDidUpdate() {
        // console.log('componentDidUpdate higlightrefuid',this.props.highlightrefuid)
        if (this.props.highlightrefuid) {
            this.highlightrefuid = this.props.highlightrefuid;
        }
        if ((!this.state.list) && this.props.listDocument) {
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
        return this.state.list ? <Lister ref={this.props.forwardedRef} itemRenderer={this.itemRenderer} length={this.state.list ? this.state.list.length : 0} type='uniform'/> : <CircularProgress size={24}/>;
    }
}
const DirectoryList = React.forwardRef((props, ref) => {
    return <DirectoryListBase {...props} forwardedRef={ref}/>;
});
export default DirectoryList;
//# sourceMappingURL=directorylist.view.jsx.map