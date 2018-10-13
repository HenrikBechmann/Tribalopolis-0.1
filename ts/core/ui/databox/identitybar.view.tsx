// boxheader.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import React from 'react'

import ActionButton from '../common/actionbutton.view'

import Info from '@material-ui/icons/InfoOutlined'

import { withStyles, createStyles } from '@material-ui/core/styles'

const styles = createStyles({
    root:{
        position:'relative',
        border:'1px solid transparent',
        borderRadius:'8px',
        padding:'3px',
        whiteSpace:'nowrap',
        // overflow:'hidden',
        boxSizing:'border-box',
        marginBottom: '1px',
        fontSize:'larger',
        backgroundColor:'#f2f2f2',
    },
    avatar:{
        verticalAlign:'middle',
        width:'32px', 
        margin:'0 3px'
    },
    name:{
        display:'inline-block',
        verticalAlign:'middle',
        textOverflow: 'ellipsis',
        maxWidth: '63%',
        overflow: 'hidden',
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

    return <div className = {classes.root + ' ' + this.props.className}>
        {false && <ActionButton 
            icon = 'lock' 
        />}
        <ActionButton 
            action = {
                () => {this.props.callDataDrawer('info')}
            }
            component = {<Info  />}
        />
        <img className = {classes.avatar} src = {avatar} /> 
        <div className = { classes.name } >
            {this.state.item && this.state.item.document.properties.name.fullname}
        </div>
    </div>
    }
}

export default withStyles(styles)(IdentityBar)
