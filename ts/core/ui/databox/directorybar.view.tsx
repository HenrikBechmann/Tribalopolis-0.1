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
        width:'100%',
        borderRadius:'8px 0 0 0',
        paddingTop:'3px',
        boxSizing:'border-box',
        top:'0',
        backgroundColor:'#f2f2f2',
        zIndex:1,
    },

    rowwrapperstyle:{
        borderBottom:'1px solid silver',
        position:'relative',
        whiteSpace:'nowrap',
    },

    rowstyle:{
        display:'inline-block',
        position:'relative',
        paddingRight:'3px',
        marginLeft:'7px',
        marginTop:'3px',
        width:'calc(100% - 120px)',
        // backgroundColor:'white',
        // cursor:'pointer',
    },
    namestyle:{
        display:'inline-block',
        textOverflow: 'ellipsis',
        whiteSpace:'nowrap',
        maxWidth: '80%',
        overflow: 'hidden',
        marginBottom:'6px',
        verticalAlign:'bottom',
        paddingLeft:'3px',
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

    componentDidUpdate() {
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
    };

    render() {

        let { listStack, classes } = this.props
        let listDocument = this.state.list?this.state.list.document:null

        return <div>
            <div 
                className = {classes.barstyle}
            >
                {listDocument
                ?(<div className = {classes.rowwrapperstyle}>

                    <div 
                        style = {{float:'right'}}
                        ref = {this.menuAnchor}
                    >
                        <ActionButton icon = 'more_vert' action = {this.toggleMenu}/>
                    </div>
                    <PopupMenu
                        menuopen = {this.state.menuopen}
                        menuAnchor = {this.menuAnchor}
                        menuClose = {this.menuClose}
                    >
                        <MenuItem className = {classes.menustyle}
                            onClick = {this.menuClose}>
                            <Icon style = {{opacity:.54}} >label</Icon> New Label
                        </MenuItem>
                        <MenuItem className = {classes.menustyle}
                            onClick = {this.menuClose}>
                            <Icon >check</Icon> Show All
                        </MenuItem>
                        <Divider />
                        <MenuItem className = {classes.menustyle}
                            onClick = {this.menuClose}>
                            <Info /> Info
                        </MenuItem>
                        <MenuItem className = {classes.menustyle}
                            onClick = {this.menuClose}>
                            <Icon >edit</Icon> Edit
                        </MenuItem>
                        <MenuItem className = {classes.menustyle}
                            onClick = {this.menuClose}>
                            <Icon >delete</Icon> Delete
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
                                icon = 'list'/>
                            <ActionButton 
                                iconStyle = {{width:'16px'}} 
                                img = '/public/icons/cards.svg'
                            />
                            <ActionButton 
                                iconStyle = {{width:'16px'}} 
                                img = '/public/icons/tiles.svg'
                            />
                        </MenuItem>
                    </PopupMenu>
                    <ActionButton img = '/public/icons/expand_all.svg' 
                        iconStyle = {{width:'16px'}}
                    />
                    { listStack.length
                        ?<div className = {classes.arrowstyle}>

                            <QuantityBadge 
                                quantity = {listStack.length} 
                                style = {{left:'-8px',top:'-4px'}}
                            />
                            <ActionButton 
                                icon = 'arrow_back'
                                action = {this.props.collapseDirectoryItem}
                            />

                        </div>

                        :null
                    }
                    <div className = {classes.rowstyle} > 

                        <Icon style={{verticalAlign:'baseline'}} >folder_open</Icon> 
                        {false && <QuantityBadge 
                            quantity = {listDocument.counts.lists + listDocument.counts.links} 
                            style = {{left:'-6px',top:'-8px'}}
                        />}
                        <div className = {classes.namestyle} >
                            { listDocument.properties.name } <span className = {classes.countstyle}>{listDocument.counts.lists + listDocument.counts.links}</span>
                        </div>

                    </div>

                </div>)

                :<div className = {classes.progress}>

                    <CircularProgress size = {12} />

                </div>}
            </div>
            
        </div>
    }
}

export default withStyles(styles)(DirectoryBar)