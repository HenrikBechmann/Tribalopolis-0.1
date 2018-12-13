// directorybar.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
/*
    TODO: isolate popup menu to common component
*/
'use strict';
import React from 'react';
import Icon from '@material-ui/core/Icon';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import PopupMenu from '../common/popupmenu.view';
import Info from '@material-ui/icons/InfoOutlined';
import { withStyles, createStyles } from '@material-ui/core/styles';
import ActionButton from '../common/actionbutton.view';
import LoadingMessage from '../common/loadingmessage.view';
const styles = createStyles({
    barstyle: {
        boxSizing: 'border-box',
        position: 'relative',
        borderBottom: '1px solid #e2e6e9',
        borderRadius: '8px',
        backgroundColor: '#f2f2f2',
        padding: '3px',
    },
    rowstyle: {
        position: 'relative',
        display: 'flex',
        flexFlow: 'row nowrap',
        alignItems: 'center',
    },
    namestyle: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        paddingLeft: '3px',
        whiteSpace: 'nowrap',
        flex: 1,
    },
    countstyle: {
        fontSize: 'smaller',
        color: 'silver',
    },
    arrowstyle: {
        float: 'right',
        width: '32px',
        height: '32px',
        position: 'relative',
    },
    progress: {
    // height:'33px',
    },
    menustyle: {
        padding: '6px',
        fontSize: '.86rem',
    }
});
class DirectoryBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: null,
            menuopen: false,
        };
        this.assertList = () => {
            if (!this.listProxy && this.props.listProxy) {
                this.listProxy = this.props.listProxy;
                this.props.setDocumentListener(this.listProxy.doctoken, this.listProxy.instanceid, this.cacheListDocument);
            }
        };
        this.cacheListDocument = (document, type, change) => {
            this.setState({
                list: {
                    document,
                    type
                }
            });
        };
        this.toggleMenu = () => {
            this.setState(state => ({ menuopen: !state.menuopen }));
        };
        this.menuClose = event => {
            if (this.menuAnchor.current.contains(event.target)) {
                return;
            }
            this.setState({ menuopen: false });
        };
        this.callDataDrawer = (e, opcode) => {
            this.menuClose(e);
            this.props.callDataDrawer(this.listProxy, opcode);
        };
        this.menuAnchor = React.createRef();
    }
    componentDidMount() {
        this.assertList();
    }
    componentDidUpdate() {
        this.assertList();
    }
    componentWillUnmount() {
        if (this.listProxy) {
            this.props.removeDocumentListener(this.listProxy.doctoken, this.listProxy.instanceid);
        }
    }
    render() {
        let { listStack, classes, haspeers, contextitem } = this.props;
        let listDocument = this.state.list ? this.state.list.document : null;
        return <div className={classes.barstyle}>
                {listDocument
            ? (<div className={classes.rowstyle}>

                    <Icon>folder_open</Icon> 
                    <div className={classes.namestyle}>
                        <span>{listDocument.properties.name} </span>
                        <span className={classes.countstyle}>
                            {listDocument.counts.lists + listDocument.counts.links}
                        </span>
                    </div>
                    {!contextitem && <ActionButton buttonStyle={{
                float: 'none',
                width: '24px',
                height: '24px',
            }} icon='unfold_more'/>}
                    {(!contextitem) && <div ref={this.menuAnchor}>
                        <ActionButton buttonStyle={{
                float: 'none',
                width: '24px',
                height: '24px',
            }} icon='more_vert' action={this.toggleMenu}/>
                    </div>}
                    {(!contextitem) && <PopupMenu menuopen={this.state.menuopen} menuAnchor={this.menuAnchor} menuClose={this.menuClose}>
                        <MenuItem className={classes.menustyle} onClick={(e) => {
                this.callDataDrawer(e, 'info');
            }}>
                            <Info style={{ opacity: .54 }}/> Info
                        </MenuItem>
                        <MenuItem className={classes.menustyle} onClick={(e) => {
                this.callDataDrawer(e, 'edit');
            }}>
                            <Icon style={{ opacity: .54 }}>edit</Icon> Edit
                        </MenuItem>
                        <MenuItem className={classes.menustyle} disabled onClick={(e) => {
                this.callDataDrawer(e, 'remove');
            }}>
                            <Icon style={{ opacity: .54 }}>close</Icon> Remove
                        </MenuItem>
                        <MenuItem className={classes.menustyle} disabled onClick={(e) => {
                this.callDataDrawer(e, 'delete');
            }}>
                            <Icon style={{ opacity: .54 }}>delete</Icon> Delete
                        </MenuItem>
                        <Divider />
                        <MenuItem className={classes.menustyle} onClick={this.menuClose}>
                            <div style={{ display: 'inline-block', width: '24px', height: '24px' }}></div>
                            {false && <Icon style={{ opacity: .54 }}>check</Icon>} Select Mode
                        </MenuItem>
                        <MenuItem className={classes.menustyle} onClick={(e) => {
                this.callDataDrawer(e, 'add-label');
            }}>
                            <Icon style={{ opacity: .54 }}>label</Icon> New Label
                        </MenuItem>
                        <Divider />
                        <MenuItem className={classes.menustyle} onClick={this.menuClose}>
                            <Icon style={{ opacity: .54 }}>check</Icon> Show All Records
                        </MenuItem>
                        <MenuItem className={classes.menustyle} onClick={this.menuClose}>
                            <div style={{ display: 'inline-block', width: '24px', height: '24px' }}></div> 
                            {false && <Icon style={{ opacity: .54 }}>check</Icon>} Show Labels Only
                        </MenuItem>
                        <Divider />
                        <MenuItem className={classes.menustyle} onClick={this.menuClose}>
                            <div style={{
                display: 'inline-block',
                marginRight: '6px',
            }}>Layout</div>
                            <ActionButton icon='view_headline' iconStyle={{ border: '1px solid gray', borderRadius: '50%' }}/>
                            <ActionButton iconStyle={{ width: '16px' }} img='/public/icons/cards.svg'/>
                            <ActionButton iconStyle={{ width: '16px' }} img='/public/icons/variablecards.svg'/>
                        </MenuItem>
                    </PopupMenu>}
                    {contextitem && <ActionButton buttonStyle={{
                float: 'none',
                width: '24px',
                height: '24px',
                marginLeft: '6px',
            }} action={() => { this.props.callDataDrawer(this.listProxy, 'info'); }} component={<Info />}/>}

                </div>)
            : <div className={classes.progress}>
                    <LoadingMessage />
                </div>}
            </div>;
    }
}
export default withStyles(styles)(DirectoryBar);
//# sourceMappingURL=directorybar.view.jsx.map