// directorylist.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import React from 'react'

import DirectoryItem from './directoryitem.view'

import Lister from 'react-list'
import CircularProgress from '@material-ui/core/CircularProgress'

class DirectoryListBase extends React.Component<any,any> {

    constructor(props) {
        super(props)
        this.listcomponent = this.props.forwardedRef
    }
    state = {
        highlightrefuid:null,
        list:this.props.listdocument?this.props.listdocument.list:null,
    }

    highlightrefuid = null

    listcomponent

    setListListener = this.props.setListListener

    componentDidUpdate() {
        // console.log('componentDidUpdate higlightrefuid',this.props.highlightrefuid)
        if (this.props.highlightrefuid) {
            this.highlightrefuid = this.props.highlightrefuid
        }
        if ((!this.state.list) && this.props.listdocument) {
            // console.log('setting list state',this.props.highlightrefuid)
            this.setState({
                list:this.props.listdocument.list
            })
        } else {
            if (this.props.listdocument) {
                // console.log('calling highlight',this.state, this.highlightrefuid,this.props.highlightrefuid)
                setTimeout(()=>{
                    this.dohighlight()
                })
            }
        }
    }

    dohighlight = () => {
        if ((!this.highlightrefuid) || (!this.state.list))  return
        // console.log('doing highlight')
        // keep; value will be purged
        let highlightrefuid = this.highlightrefuid
        this.highlightrefuid = null
        // get index for Lister
        let index = this.state.list.findIndex(this.findlinkIndex(highlightrefuid))
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

    expandDirectoryItem = (doctoken) => {
        return (domSource) => {
            this.props.expandDirectoryItem(doctoken, domSource)
        }
    }

    itemRenderer = (index,key) => {
        return this.getListComponent(this.state.list[index],key)
    }

    getListComponent = (doctoken, key) => {

        let data = this.setListListener(doctoken)
        let highlight = (doctoken.uid === this.state.highlightrefuid)
        let catitem = 
            <DirectoryItem 
                key = {key} 
                uid = {doctoken.uid} 
                data = {data} 
                expandDirectoryItem = {this.expandDirectoryItem(doctoken)}
                highlight = {highlight}
                highlightItem = {this.props.highlightItem}
            />

        return catitem

    }

    render() {

        return this.state.list?<Lister 
            ref = {this.props.forwardedRef}
            itemRenderer = {this.itemRenderer}
            length = {this.state.list?this.state.list.length:0}
            type = 'uniform'
        />:<CircularProgress size = {24} />
    }
}

const DirectoryList = React.forwardRef((props:any,ref:any) => {
    return <DirectoryListBase {...props} forwardedRef = {ref} />
})

export default DirectoryList