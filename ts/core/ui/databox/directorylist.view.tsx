// directorylist.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import React from 'react'

import Lister from 'react-list'

import CircularProgress from '@material-ui/core/CircularProgress'

import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'

import DirectoryItem from './directoryitem.view'
import proxy from '../../utilities/proxy'

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
        listproxies:null,
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

        if (this.props.highlightrefuid) {
            this.highlightrefuid = this.props.highlightrefuid
        }

        if ((!this.state.listproxies ) && this.state.list && this.state.list.data) {

            let listproxies = this.generateListProxies(this.state.list.data)

            console.log('listproxies',listproxies)

            this.setState({
                listproxies,
            })

        } else {
            if (this.state.list) {
                // console.log('calling highlight',this.state, this.highlightrefuid,this.props.highlightrefuid)
                setTimeout(()=>{
                    this.dohighlight()
                })
            }
        }
    }

    generateListProxies = (listDocument) => {
        let listtokens = listDocument.list
        let listproxies = listtokens.map((token) => {
            return new proxy({token})
        })
        return listproxies
    }

    cacheListDocument = (data,type) => {
        console.log('cacheListDocument callback',data,type)
        this.setState({
            list:{
                data,
                type
            }
        })
    }

    dohighlight = () => {
        if ((!this.highlightrefuid) || (!this.state.listproxies.length))  return
        let { listproxies } = this.state
        // console.log('doing highlight')
        // keep; value will be purged
        let highlightrefuid = this.highlightrefuid
        this.highlightrefuid = null
        // get index for Lister
        let index = listproxies.findIndex(this.findlinkIndex(highlightrefuid))
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
                listProxy = {proxy} 
                setListListener = {this.props.callbacks.setListListener}
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
            length = {this.state.listproxies?this.state.listproxies.length:0}
            type = 'uniform'
        />:<CircularProgress size = {24} />
    }
}

const DirectoryList = React.forwardRef((props:any,ref:any) => {
    return <DirectoryListBase {...props} forwardedRef = {ref} />
})

export default DirectoryList