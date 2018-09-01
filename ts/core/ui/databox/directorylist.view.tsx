// directorylist.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'

import DirectoryItem from './directoryitem.view'

import Lister from 'react-list'

class DirectoryListBase extends React.Component<any,any> {

    constructor(props) {
        super(props)
        this.listcomponent = this.props.forwardedRef
    }
    state = {
        highlightrefuid:null,
        links:this.props.listobject.links,
    }

    listcomponent

    getList = this.props.getList

    componentDidUpdate() {
        if (!this.props.highlightrefuid) return
        // keep; value will be purged
        let highlightrefuid = this.props.highlightrefuid
        // get index for Lister
        let index = this.state.links.findIndex(this.findlinkIndex(highlightrefuid))
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

    expandDirectoryItem = (dataref) => {
        return (domSource) => {
            this.props.expandDirectoryItem(dataref, domSource)
        }
    }

    itemRenderer = (index,key) => {
        return this.getListComponent(this.state.links[index],key)
    }

    getListComponent = (dataref, key) => {

        let data = this.getList(dataref)
        let highlight = (dataref.uid === this.state.highlightrefuid)
        let catitem = 
            <DirectoryItem 
                key = {key} 
                uid = {dataref.uid} 
                data = {data} 
                expandDirectoryItem = {this.expandDirectoryItem(dataref)}
                highlight = {highlight}
                highlightItem = {this.props.highlightItem}
            />

        return catitem

    }

    render() {

        return <Lister 
            ref = {this.props.forwardedRef}
            itemRenderer = {this.itemRenderer}
            length = {this.state.links.length}
            type = 'uniform'
        />
    }
}

const DirectoryList = React.forwardRef((props:any,ref:any) => {
    return <DirectoryListBase {...props} forwardedRef = {ref} />
})

export default DirectoryList