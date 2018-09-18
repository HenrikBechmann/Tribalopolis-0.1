// directorylist.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import React from 'react'

import DirectoryItem from './directoryitem.view'

import Lister from 'react-list'

class DirectoryListBase extends React.Component<any,any> {

    constructor(props) {
        super(props)
        this.listcomponent = this.props.forwardedRef
    }
    state = {
        highlightrefuid:null,
        list:this.props.listobject?this.props.listobject.list:null,
    }

    listcomponent

    setListListener = this.props.setListListener

    componentDidUpdate() {
        if ((!this.state.list) && this.props.listobject) {
            this.setState({
                list:this.props.listobject.list
            })
        }
        if (!this.props.highlightrefuid) return
        // keep; value will be purged
        let highlightrefuid = this.props.highlightrefuid
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

        return <Lister 
            ref = {this.props.forwardedRef}
            itemRenderer = {this.itemRenderer}
            length = {this.state.list?this.state.list.length:0}
            type = 'uniform'
        />
    }
}

const DirectoryList = React.forwardRef((props:any,ref:any) => {
    return <DirectoryListBase {...props} forwardedRef = {ref} />
})

export default DirectoryList