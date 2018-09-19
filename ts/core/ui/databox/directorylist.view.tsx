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
        listtokens:this.props.listDocument?this.props.listDocument.list:null,
    }

    listProxy = null

    highlightrefuid = null

    listcomponent

    listDocument

    listType

    setListListener = this.props.callbacks.setListListener

    componentDidUpdate() {
        if (!this.listProxy && this.props.listProxy) {
            this.listProxy = this.props.listProxy
        }
        // console.log('componentDidUpdate higlightrefuid',this.props.highlightrefuid)
        if (this.props.highlightrefuid) {
            this.highlightrefuid = this.props.highlightrefuid
        }
        if ((!this.state.listtokens) && this.props.listDocument) {
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

    cacheListData = (data,type) => {
        this.setState({
            list:{
                data,
                type
            }
        })
    }

    dohighlight = () => {
        if ((!this.highlightrefuid) || (!this.state.listtokens))  return
        // console.log('doing highlight')
        // keep; value will be purged
        let highlightrefuid = this.highlightrefuid
        this.highlightrefuid = null
        // get index for Lister
        let index = this.state.listtokens.findIndex(this.findlinkIndex(highlightrefuid))
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
        return this.getListComponent(this.state.listtokens[index],key)
    }

    getListComponent = (token, key) => {

        let listDocument = this.setListListener(token)
        let highlight = (token.uid === this.state.highlightrefuid)
        let catitem = 
            <DirectoryItem 
                key = {key} 
                uid = {token.uid} 
                listDocument = {listDocument} 
                expandDirectoryItem = {this.expandDirectoryItem(token)}
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

        return this.state.listtokens?<Lister 
            ref = {this.props.forwardedRef}
            itemRenderer = {this.itemRenderer}
            length = {this.state.listtokens?this.state.listtokens.length:0}
            type = 'uniform'
        />:<CircularProgress size = {24} />
    }
}

const DirectoryList = React.forwardRef((props:any,ref:any) => {
    return <DirectoryListBase {...props} forwardedRef = {ref} />
})

export default DirectoryList