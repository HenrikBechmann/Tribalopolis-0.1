// toolbar.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import React from 'react';
import ActionButton from '../common/actionbutton.view';
class BoxToolbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: null
        };
        this.cacheListDocument = (data, type) => {
            this.setState({
                list: {
                    data,
                    type
                }
            });
        };
        this.selectFromSplay = () => {
            return () => {
                this.props.callbacks.selectFromSplay(this.selectdomsource.current);
            };
        };
        this.splayBox = () => {
            return () => {
                this.props.callbacks.splayBox(this.splaydomsource.current, this.state.list.data);
            };
        };
        this.splaydomsource = React.createRef();
        this.selectdomsource = React.createRef();
    }
    componentDidUpdate() {
        if (!this.listProxy && this.props.listProxy) {
            this.listProxy = this.props.listProxy;
            this.props.callbacks.setListListener(this.listProxy.token, this.listProxy.instanceid, this.cacheListDocument);
        }
    }
    componentWillUnmount() {
        if (this.listProxy) {
            this.props.callbacks.removeListListener(this.listProxy.token, this.listProxy.instanceid);
        }
    }
    render() {
        let props = this.props;
        let styles = {
            position: 'relative',
            width: '100%',
            borderRadius: '8px',
            padding: '3px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            // fontSize:'larger',
            boxSizing: 'border-box',
        };
        let boxicon = '/public/icons/databox.svg';
        let listcount = this.state.list ? this.state.list.data.list.length : 0;
        let haspeers = props.haspeers;
        return <div style={styles}>

            <div style={{ float: 'right', marginLeft: '6px' }} ref={this.splaydomsource}>
                <ActionButton icon='zoom_out_map'/>
            </div>
            <div style={{ float: 'right', marginLeft: '6px' }} ref={this.selectdomsource}>
                <ActionButton iconStyle={{ transform: 'rotate(90deg)' }} disabled={!haspeers} img='/public/icons/ic_splay_24px.svg' action={this.selectFromSplay()}/>
            </div>
            <div style={{ float: 'right' }} ref={this.splaydomsource}>
                <ActionButton img='/public/icons/ic_splay_24px.svg' disabled={!listcount} action={this.splayBox()}/>
            </div>

            <div style={{
            padding: '3px',
            boxSizing: 'border-box',
            width: '32px',
            height: '32px',
            display: 'none',
            border: '1px solid transparent',
            verticalAlign: 'top',
        }}>
            </div>
            <div style={{
            padding: '3px',
            boxSizing: 'border-box',
            width: '32px',
            height: '32px',
            display: 'inline-block',
            borderRadius: '50%',
            border: '1px solid transparent',
        }}>
                <img style={{ verticalAlign: 'bottom' }} src={boxicon}/>
            </div>
            <div style={{
            display: 'inline-block',
            verticalAlign: 'top',
            height: '32px',
            boxSizing: 'border-box',
            border: '1px solid transparent',
            borderRadius: '8px',
            padding: '5px 3px 3px',
            fontStyle: 'italic',
            position: 'relative',
        }}>
                {props.item.type.name}
            </div>
            <ActionButton icon='arrow_drop_down' buttonStyle={{ verticalAlign: 'top', float: 'none' }}/>

        </div>;
    }
}
export default BoxToolbar;
//# sourceMappingURL=typebar.view.jsx.map