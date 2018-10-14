// directorybar.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence

/*
    TODO: isolate popup menu to common component
*/

'use strict'

import React from 'react'

import Icon from '@material-ui/core/Icon'
import CircularProgress from '@material-ui/core/CircularProgress'

import QuantityBadge from '../common/quantitybadge.view'
import ActionButton from '../common/actionbutton.view'
import { withStyles, createStyles } from '@material-ui/core/styles'
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider'
import PopupMenu from '../common/popupmenu.view'
import Info from '@material-ui/icons/InfoOutlined'

const styles = createStyles({ 
    barstyle:{
        boxSizing:'border-box',
        position:'relative',
        borderBottom:'1px solid #e2e6e9',

        borderRadius:'8px',
        backgroundColor:'#f2f2f2',
    },

    rowstyle:{
        position:'relative',
        padding:'0 3px',
        display:'flex',
        flexFlow:'row nowrap',
        alignItems:'center',
    },
    namestyle:{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        paddingLeft:'3px',
        whiteSpace:'nowrap',
        flex:1,
    },
    countstyle:{
        fontSize:'smaller',
        color:'silver',
    },
    arrowstyle:{
        float:'right',
        width:'32px',
        height:'32px', 
        position:'relative',
    },
    progress:{
        height:'33px',
    },
    menustyle:{
        padding:'6px',
        fontSize:'.86rem',
    }
})

class DirectoryBar extends React.Component<any,any> {

    constructor(props) {
        super(props)
        this.menuAnchor = React.createRef()
    }

    state = {
        list:null,
        menuopen:false,
    }

    listProxy
    menuAnchor

    componentDidMount() {
        this.assertList()
    }

    componentDidUpdate() {
        this.assertList()
    } 

    assertList = () => {
        if (!this.listProxy && this.props.listProxy) {
            this.listProxy = this.props.listProxy
            this.props.setListListener(
                this.listProxy.token,this.listProxy.instanceid,this.cacheListDocument)
        }        
    }

    componentWillUnmount() {
        if (this.listProxy) {
            this.props.removeListListener(
                this.listProxy.token,this.listProxy.instanceid)
        }        
    }

    cacheListDocument = (document,type) => {
        this.setState({
            list:{
                document,
                type
            }
        })
    }

    toggleMenu = () => {
        this.setState(state => ({ menuopen: !state.menuopen }));
    }

    menuClose = event => {
        if (this.menuAnchor.current.contains(event.target)) {
          return;
        }

        this.setState({ menuopen: false });
    }

    callDataDrawer = (e,opcode) => {
        this.menuClose(e)
        this.props.callDataDrawer(this.listProxy,opcode)
    }

    render() {

        let { listStack, classes, haspeers, contextitem } = this.props
        let listDocument = this.state.list?this.state.list.document:null

        return <div 
                className = {classes.barstyle}
            >
                {listDocument
                ?(<div className = {classes.rowstyle}>

                    <Icon >folder_open</Icon> 
                    <div className = {classes.namestyle} >
                        <span>{ listDocument.properties.name } </span>
                        <span 
                            className = {
                                classes.countstyle
                            }
                        >
                            {listDocument.counts.lists + listDocument.counts.links}
                        </span>
                    </div>
                    {(!haspeers && !contextitem) && <div 
                        ref = {this.menuAnchor}
                    >
                        <ActionButton 
                            buttonStyle = {
                                {
                                    float:'none',
                                    width:'24px',
                                    height:'24px',
                                }
                            } 
                            icon = 'more_vert' 
                            action = {this.toggleMenu}
                        />
                    </div>}
                    {(!haspeers && !contextitem) && <PopupMenu
                        menuopen = {this.state.menuopen}
                        menuAnchor = {this.menuAnchor}
                        menuClose = {this.menuClose}
                    >
                        <MenuItem className = {classes.menustyle}
                            onClick = {(e) =>{
                                this.callDataDrawer(e,'info')}
                            }>
                            <Info style = {{opacity:.54}} /> Info
                        </MenuItem>
                        <MenuItem className = {classes.menustyle}
                            onClick = {(e) =>{
                                this.callDataDrawer(e,'edit')}
                            }>
                            <Icon style = {{opacity:.54}} >edit</Icon> Edit
                        </MenuItem>
                        <MenuItem className = {classes.menustyle}
                            disabled
                            onClick = {(e) =>{
                                this.callDataDrawer(e,'delete')}
                            }>
                            <Icon style = {{opacity:.54}} >delete</Icon> Delete
                        </MenuItem>
                        <Divider />
                        <MenuItem className = {classes.menustyle}
                            onClick = {this.menuClose}>
                            <div style = {{display:'inline-block',width:'24px', height:'24px'}}></div>{false && <Icon style = {{opacity:.54}} >check</Icon>} Select Mode
                        </MenuItem>
                        <MenuItem className = {classes.menustyle}
                            onClick = {(e) =>{
                                this.callDataDrawer(e,'add-label')}
                            }>
                            <Icon style = {{opacity:.54}} >label</Icon> New Label
                        </MenuItem>
                        <Divider />
                        <MenuItem className = {classes.menustyle}
                            onClick = {this.menuClose}>
                            <Icon style = {{opacity:.54}} >check</Icon> Show All
                        </MenuItem>
                        <MenuItem className = {classes.menustyle}
                            onClick = {this.menuClose}>
                            <div style = {{display:'inline-block',width:'24px', height:'24px'}}></div> {false && <Icon style = {{opacity:.54}} >check</Icon>} Show None
                        </MenuItem>
                        <Divider />
                        <MenuItem className = {classes.menustyle}
                            onClick={this.menuClose}>
                            <div 
                                style = {
                                    {
                                        display:'inline-block',
                                        marginRight:'6px',
                                    }
                                }>Layout</div>
                            <ActionButton 
                                icon = 'list'
                                iconStyle = {{border:'1px solid gray',borderRadius:'50%'}}
                            />
                            <ActionButton 
                                iconStyle = {{width:'16px'}} 
                                img = '/public/icons/cards.svg'
                            />
                            {false && <ActionButton 
                                iconStyle = {{width:'16px'}} 
                                img = '/public/icons/tiles.svg'
                            />}
                        </MenuItem>
                    </PopupMenu>}
                    {!contextitem && <ActionButton icon = 'unfold_more' />}
                    {contextitem && <ActionButton 
                        buttonStyle = {
                            {
                                float:'none',
                                width:'24px',
                                height:'24px',
                                marginLeft:'6px',
                            }
                        } 
                        action = {
                            () => {this.props.callDataDrawer('info')}
                        }
                        component = {<Info  />}
                    />}

                </div>)

                :<div className = {classes.progress}>

                    <CircularProgress size = {12} />

                </div>}
            </div>
            
    }
}

export default withStyles(styles)(DirectoryBar)