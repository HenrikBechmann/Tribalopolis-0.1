// boxheader.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import React from 'react'

import ActionButton from '../common/actionbutton.view'

import Info from '@material-ui/icons/InfoOutlined'

import { withStyles, createStyles } from '@material-ui/core/styles'

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
        padding:'3px',
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
    avatar:{
        verticalAlign:'middle',
        width:'24px', 
        marginRight:'3px'
    },

})

class IdentityBar extends React.Component<any> {

    state = {
        item:null,
    }

    itemProxy

    componentDidMount() {
        this.assertListener()
    }

    componentDidUpdate() {
        this.assertListener()
    } 

    assertListener = () => {
        if (!this.itemProxy && this.props.itemProxy) {
            this.itemProxy = this.props.itemProxy
            this.props.setItemListener(
                this.itemProxy.token,this.itemProxy.instanceid,this.cacheItemDocument)
        }        
    }

    componentWillUnmount() {
        if (this.itemProxy) {
            this.props.removeItemListener(
                this.itemProxy.token,this.itemProxy.instanceid)
        }        
    }

    cacheItemDocument = (document,type) => {

        this.setState({
            item:{
                document,
                type
            }
        })
    }

    render() {

    let { classes} = this.props

    let avatar = '/public/avatars/henrik_in_circle.png'

    return <div className = {classes.barstyle + ' ' + this.props.className}>
        <div className = {classes.rowstyle}>
            {false && <ActionButton 
                icon = 'lock' 
            />}
            <img className = {classes.avatar} src = {avatar} /> 
            <div className = { classes.namestyle } >
                {this.state.item && this.state.item.document.properties.name.fullname}
            </div>
            <ActionButton 
                buttonStyle = {
                    {
                        float:'none',
                        width:'24px',
                        height:'24px',
                    }
                } 
                action = {
                    () => {this.props.callDataDrawer('info')}
                }
                component = {<Info  />}
            />
        </div>
    </div>
    }
}

export default withStyles(styles)(IdentityBar)
