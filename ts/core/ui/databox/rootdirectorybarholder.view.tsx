// directorybarholder.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import React from 'react'

import { withStyles, createStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'

import DirectoryBar from './directorybar.view'
import proxy from '../../utilities/proxy'

const styles = createStyles({
    holderstyle:{
        boxSizing:'border-box',
        height:'24px',
        borderRadius:'8px',
        backgroundColor:'#c7ddc7',
    },
})

class RootDirectoryBarHolder extends React.Component<any, any> {

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
            // console.log('asserting listener')
            this.itemProxy = this.props.itemProxy
            this.props.setDocumentListener(
                this.itemProxy.token,this.itemProxy.instanceid,this.cacheItemDocument)
        }        
    }

    componentWillUnmount() {
        if (this.itemProxy) {
            this.props.removeDocumentListener(
                this.itemProxy.token,this.itemProxy.instanceid)
        }        
    }

    cacheItemDocument = (document,type) => {
        // console.log('caching item',document)
        this.setState({
            item:{
                document,
                type
            }
        })
    }

    render() {

    // console.log('rendering',this.state)
    let { classes } = this.props
    let listProxy
    if (this.state.item) {
        let listtoken = {
            collection:'lists', 
            id:this.state.item.document.references.list,
        }
        listProxy = new proxy({token:listtoken})
    }

    return (
    this.state.item?
    <DirectoryBar 
        haspeers = {false}
        listProxy = {listProxy}
        setDocumentListener = {this.props.setDocumentListener}
        removeDocumentListener = {this.props.removeDocumentListener}
        callDataDrawer = {this.props.callDataDrawer}

        listStack = {this.itemProxy.liststack}
        collapseDirectoryItem = {() => {}} 
        contextitem
    
    />    
    :<div className = {classes.holderstyle}>
        <CircularProgress size = {24} />
    </div>)
    }
}

export default withStyles(styles)(RootDirectoryBarHolder)
