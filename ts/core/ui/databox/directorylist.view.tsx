// directorylist.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import React from 'react'

import DirectoryItem from './directoryitem.view'

import Lister from 'react-list'
import CircularProgress from '@material-ui/core/CircularProgress'

import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'

const styles = theme => ({
  button: {
    marginRight: theme.spacing.unit
  },
})

const BaseFloatingAddButton = (props) => {
    const { classes } = props
    return <Button variant = 'fab' mini color = 'secondary' aria-label = 'Add' className = {classes.button} >
      <AddIcon />
    </Button>
}

const FloatingAddButton = withStyles(styles)(BaseFloatingAddButton)


class DirectoryListBase extends React.Component<any,any> {

    constructor(props) {
        super(props)
        this.listcomponent = this.props.forwardedRef
    }

    state = {
        highlightrefuid:null,
        list:null,
        listproxies:new Map(),
    }

    listProxy = null

    highlightrefuid = null

    listcomponent

    componentDidUpdate() {
        if (!this.listProxy && this.props.listProxy) {
            this.listProxy = this.props.listProxy
            this.props.callbacks.setListListener(
                this.listProxy.token,this.listProxy.instanceid,this.cacheListDocument)
        }
        // console.log('componentDidUpdate higlightrefuid',this.props.highlightrefuid)
        if (this.props.highlightrefuid) {
            this.highlightrefuid = this.props.highlightrefuid
        }
        if ((!this.state.listproxies.size) && this.props.listDocument) {
            // console.log('setting list state',this.props.highlightrefuid)
            this.setState({
                list:this.props.listDocument.list
            })
        } else {
            if (this.props.listDocument) {
                // console.log('calling highlight',this.state, this.highlightrefuid,this.props.highlightrefuid)
                setTimeout(()=>{
                    this.dohighlight()
                })
            }
        }
    }

    cacheListDocument = (data,type) => {
        this.setState({
            list:{
                data,
                type
            }
        })
    }

    dohighlight = () => {
        if ((!this.highlightrefuid) || (!this.state.listproxies.size))  return
        let { listproxies } = this.state
        // console.log('doing highlight')
        // keep; value will be purged
        let highlightrefuid = this.highlightrefuid
        this.highlightrefuid = null
        // get index for Lister
        let mapkeys = Array.from(listproxies.values())
        let index = mapkeys.findIndex(this.findlinkIndex(highlightrefuid))
        // update scroll display with selected highlight item
        this.listcomponent.current.scrollAround(index)

        setTimeout(() => { // let scroll update finish
            // animate highlight
            this.setState({
                highlightrefuid,
            },() => {
                this.setState({
                    highlightrefuid:null
                })
            })

        },300)
    }

    findlinkIndex = (uid) => {

        return (item) => {
            return item.uid == uid
        }

    }

    expandDirectoryItem = (token) => {
        return (domSource) => {
            this.props.callbacks.expandDirectoryItem(token, domSource)
        }
    }

    itemRenderer = (index,key) => {
        return this.getListComponent(this.state.listproxies[index],key)
    }

    getListComponent = (proxy, key) => {

        // let listDocument = this.setListListener(token)
        let highlight = (proxy.uid === this.state.highlightrefuid)
        let catitem = 
            <DirectoryItem 
                key = {key} 
                uid = {proxy.uid} 
                listProxy = {proxy} 
                expandDirectoryItem = {this.expandDirectoryItem(proxy.token)}
                highlight = {highlight}
                highlightItem = {this.props.callbacks.highlightItem}
            />

        return catitem

    }

    modifybuttons = (listItemType) => {

        if (!listItemType) return null

        let outgoing = listItemType.properties.is.outgoing

        let retval = outgoing?
            <div style = {{position:'absolute',bottom:'-8px',right:'0'}}>
                <FloatingAddButton />
            </div>
            : null

        return retval
    }

    render() {

        return this.state.listproxies?<Lister 
            ref = {this.props.forwardedRef}
            itemRenderer = {this.itemRenderer}
            length = {this.state.listproxies?this.state.listproxies.size:0}
            type = 'uniform'
        />:<CircularProgress size = {24} />
    }
}

const DirectoryList = React.forwardRef((props:any,ref:any) => {
    return <DirectoryListBase {...props} forwardedRef = {ref} />
})

export default DirectoryList