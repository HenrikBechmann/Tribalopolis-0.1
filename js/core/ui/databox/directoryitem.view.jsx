// directoryitem.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import React from 'react';
import Icon from '@material-ui/core/Icon';
import CircularProgress from '@material-ui/core/CircularProgress';
import QuantityBadge from '../common/quantitybadge.view';
class DirectoryItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: null,
        };
        this.barstyle = {
            padding: '3px',
            height: '25px',
        };
        this.tabwrapperstyle = {
            borderBottom: '1px solid #e2e6e9',
            position: 'relative',
            height: '24px',
        };
        this.pretabstyle = {
            display: 'inline-block',
            height: '24px',
            width: '5px',
            verticalAlign: 'middle',
        };
        this.tabstyle = {
            display: 'inline-block',
            position: 'relative',
            verticalAlign: 'middle',
            borderWidth: '1px',
            borderRadius: '6px 6px 0 0',
            borderColor: '#e2e6e9',
            borderBottomColor: 'white',
            borderStyle: 'solid',
            paddingRight: '3px',
            marginLeft: '-1px',
            marginBottom: '-1px',
            backgroundColor: 'white',
            cursor: 'pointer',
            maxWidth: '90%',
            whiteSpace: 'nowrap',
        };
        this.cacheListDocument = (data, type) => {
            this.setState({
                list: {
                    data,
                    type
                }
            });
        };
        this.expandDirectoryItem = () => {
            this.props.expandDirectoryItem(this.barelementref.current);
        };
        this.barcomponent = () => {
            let listDocument = this.state.list ? this.state.list.data : null;
            return <div style={this.barstyle} ref={this.barelementref}>
            {listDocument ? <div style={this.tabwrapperstyle}>
                <div style={this.pretabstyle}></div>
                <div style={this.tabstyle} onClick={this.expandDirectoryItem}> 
                    <Icon style={{
                verticalAlign: 'middle',
                color: listDocument ? listDocument.system.attributes.sysnode ? 'green' : 'gray' : 'gray',
            }}>
                        folder
                    </Icon> 
                    <div style={{
                display: 'inline-block',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                maxWidth: '92%',
                textOverflow: 'ellipsis',
                verticalAlign: 'middle',
            }}>
                        {listDocument && listDocument.properties.name}
                    </div>
                    <QuantityBadge quantity={listDocument ? (listDocument.counts.lists + listDocument.counts.items) : 0} style={{
                left: '-10px',
                top: '-5px',
            }}/>
                </div>
            </div> : <div style={{ height: '25px' }}> 
                <CircularProgress size={16}/>
            </div>}
        </div>;
        };
        this.barelementref = React.createRef();
    }
    componentDidMount() {
        if ((!this.listProxy) && this.props.listProxy) {
            this.listProxy = this.props.listProxy;
            this.props.setListListener(this.listProxy.token, this.listProxy.instanceid, this.cacheListDocument);
        }
    }
    componentDidUpdate() {
        if (this.props.highlight && this.barelementref) {
            this.props.highlightItem(this.barelementref);
        }
    }
    componentWillUnmount() {
        if (this.listProxy) {
            this.props.removeListListener(this.listProxy.token, this.listProxy.instanceid);
        }
    }
    render() {
        return this.barcomponent();
    }
}
export default DirectoryItem;
//# sourceMappingURL=directoryitem.view.jsx.map