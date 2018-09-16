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
        list:this.props.listobject.list,
    }

    listcomponent

    setListListener = this.props.setListListener

    componentDidUpdate() {
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

    expandDirectoryItem = (datatoken) => {
        return (domSource) => {
            this.props.expandDirectoryItem(datatoken, domSource)
        }
    }

    itemRenderer = (index,key) => {
        return this.getListComponent(this.state.list[index],key)
    }

    getListComponent = (datatoken, key) => {

        let data = this.setListListener(datatoken)
        let highlight = (datatoken.uid === this.state.highlightrefuid)
        let catitem = 
            <DirectoryItem 
                key = {key} 
                uid = {datatoken.uid} 
                data = {data} 
                expandDirectoryItem = {this.expandDirectoryItem(datatoken)}
                highlight = {highlight}
                highlightItem = {this.props.highlightItem}
            />

        return catitem

    }

    render() {

        return <Lister 
            ref = {this.props.forwardedRef}
            itemRenderer = {this.itemRenderer}
            length = {this.state.list.length}
            type = 'uniform'
        />
    }
}

const DirectoryList = React.forwardRef((props:any,ref:any) => {
    return <DirectoryListBase {...props} forwardedRef = {ref} />
})

export default DirectoryList