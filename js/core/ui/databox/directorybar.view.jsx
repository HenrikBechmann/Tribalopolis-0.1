// directorybar.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
/*
    TODO: isolate popup menu to common component
*/
'use strict';
import React from 'react';
import Icon from '@material-ui/core/Icon';
import CircularProgress from '@material-ui/core/CircularProgress';
import ActionButton from '../common/actionbutton.view';
import { withStyles, createStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import PopupMenu from '../common/popupmenu.view';
import Info from '@material-ui/icons/InfoOutlined';
const styles = createStyles({
    barstyle: {
        borderRadius: '8px 0 0 0',
        paddingTop: '3px',
        boxSizing: 'border-box',
        backgroundColor: '#f2f2f2',
    },
    rowwrapperstyle: {
        borderBottom: '1px solid silver',
        position: 'relative',
        whiteSpace: 'nowrap',
    },
    rowstyle: {
        display: 'inline-block',
        position: 'relative',
        paddingRight: '3px',
        marginLeft: '7px',
        marginTop: '3px',
        width: 'calc(100% - 120px)',
    },
    namestyle: {
        display: 'inline-block',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        maxWidth: '80%',
        overflow: 'hidden',
        marginBottom: '6px',
        verticalAlign: 'bottom',
        paddingLeft: '3px',
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
        height: '33px',
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
                this.props.setListListener(this.listProxy.token, this.listProxy.instanceid, this.cacheListDocument);
            }
        };
        this.cacheListDocument = (document, type) => {
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
            this.props.removeListListener(this.listProxy.token, this.listProxy.instanceid);
        }
    }
    render() {
        let { listStack, classes, haspeers } = this.props;
        let listDocument = this.state.list ? this.state.list.document : null;
        return <div className={classes.barstyle}>
                {listDocument
            ? (<div className={classes.rowwrapperstyle}>

                    {!haspeers && <div style={{ float: 'right' }} ref={this.menuAnchor}>
                        <ActionButton icon='more_vert' action={this.toggleMenu}/>
                    </div>}
                    {!haspeers && <PopupMenu menuopen={this.state.menuopen} menuAnchor={this.menuAnchor} menuClose={this.menuClose}>
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
                this.callDataDrawer(e, 'delete');
            }}>
                            <Icon style={{ opacity: .54 }}>delete</Icon> Delete
                        </MenuItem>
                        <Divider />
                        <MenuItem className={classes.menustyle} onClick={this.menuClose}>
                            <div style={{ display: 'inline-block', width: '24px', height: '24px' }}></div>{false && <Icon style={{ opacity: .54 }}>check</Icon>} Select Mode
                        </MenuItem>
                        <MenuItem className={classes.menustyle} onClick={(e) => {
                this.callDataDrawer(e, 'add-label');
            }}>
                            <Icon style={{ opacity: .54 }}>label</Icon> New Label
                        </MenuItem>
                        <Divider />
                        <MenuItem className={classes.menustyle} onClick={this.menuClose}>
                            <Icon style={{ opacity: .54 }}>check</Icon> Show All
                        </MenuItem>
                        <MenuItem className={classes.menustyle} onClick={this.menuClose}>
                            <div style={{ display: 'inline-block', width: '24px', height: '24px' }}></div> {false && <Icon style={{ opacity: .54 }}>check</Icon>} Show None
                        </MenuItem>
                        <Divider />
                        <MenuItem className={classes.menustyle} onClick={this.menuClose}>
                            <div style={{
                display: 'inline-block',
                marginRight: '6px',
            }}>Layout</div>
                            <ActionButton icon='list' iconStyle={{ border: '1px solid gray', borderRadius: '50%' }}/>
                            <ActionButton iconStyle={{ width: '16px' }} img='/public/icons/cards.svg'/>
                            {false && <ActionButton iconStyle={{ width: '16px' }} img='/public/icons/tiles.svg'/>}
                        </MenuItem>
                    </PopupMenu>}
                    {false && <ActionButton img='/public/icons/expand_all.svg' iconStyle={{ width: '16px' }}/>}
                    <ActionButton icon='unfold_more'/>
                    <div className={classes.rowstyle}> 

                        <Icon style={{ verticalAlign: 'baseline' }}>folder_open</Icon> 
                        <div className={classes.namestyle}>
                            {listDocument.properties.name} <span className={classes.countstyle}>{listDocument.counts.lists + listDocument.counts.links}</span>
                        </div>

                    </div>

                </div>)
            : <div className={classes.progress}>

                    <CircularProgress size={12}/>

                </div>}
            </div>;
    }
}
export default withStyles(styles)(DirectoryBar);
//# sourceMappingURL=directorybar.view.jsx.map