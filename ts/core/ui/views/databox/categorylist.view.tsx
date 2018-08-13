// categorieslist.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'

import CategoryItem from './categoryitem.view'

import Lister from 'react-list'

class CategoriesList extends React.Component<any,any> {

    constructor(props) {
        super(props)
        this.listcomponent = React.createRef()
    }
    state = {
        highlightrefuid:null,
        links:this.props.listobject.links,
    }

    listcomponent

    getListItem = this.props.getListItem

    componentDidUpdate() {
        if (!this.props.highlightrefuid) return
        // keep; value will be purged
        let highlightrefuid = this.props.highlightrefuid
        // get index for Lister
        let index = this.state.links.findIndex(this.findlinkIndex(highlightrefuid))
        // update scroll display with selected highlight item
        this.listcomponent.current.scrollAround(index)

        setTimeout(() => { // let sroll update finish
            // animate highlight
            this.setState({
                highlightrefuid,
            },() => {
                this.setState({
                    highlightrefuid:null
                })
            })

        })
    }

    findlinkIndex = (uid) => {

        return (item) => {
            return item.uid == uid
        }

    }

    expandCategory = (dataref) => {
        return (domSource) => {
            this.props.expandCategory(dataref, domSource)
        }
    }

    itemRenderer = (index,key) => {
        return this.getListComponent(this.state.links[index],key)
    }

    getListComponent = (dataref, key) => {

        let data = this.getListItem(dataref)
        let highlight = (dataref.uid === this.state.highlightrefuid)
        let catitem = 
            <CategoryItem 
                key = {key} 
                uid = {dataref.uid} 
                data = {data} 
                expandCategory = {this.expandCategory(dataref)}
                highlight = {highlight}
                highlightItem = {this.props.highlightItem}
            />

        return catitem

    }

    render() {

        return <Lister 
            ref = {this.listcomponent}
            itemRenderer = {this.itemRenderer}
            length = {this.state.links.length}
            type = 'uniform'
        />
    }
}

export default CategoriesList