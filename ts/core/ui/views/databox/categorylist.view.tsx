// categorieslist.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'

import CategoryItem from './categoryitem.view'

class CategoriesList extends React.Component<any,any> {
    state = {
        highlightrefid:null,
    }

    listelement = null

    componentDidUpdate() {
        if (!this.props.highlightrefid) return
        this.setState({
            highlightrefid:this.props.highlightrefid,
        },() => {
            this.setState({
                highlightrefid:null
            })
        })
    }

    expandCategory = (ref) => {
        return () => {
            this.props.expandCategory(ref)
        }
    }

    getListItems = listobject => {

        let { getListItem } = this.props

        let { links } = listobject

        let catitems = []
        for (let ref of links) {
            let data = getListItem(ref)
            let highlight = (ref.id === this.state.highlightrefid)
            let catitem = 
                <CategoryItem 
                    key = {ref.id} 
                    id = {ref.id} 
                    data = {data} 
                    expandCategory = {this.expandCategory(ref)}
                    highlight = {highlight}
                    highlightItem = {this.props.highlightItem}
                />

            catitems.push(catitem)
        }
        return <div
            ref = {element => {
                this.listelement = element
            }}
        >{catitems}</div>
    }

    render() {

        let { listobject } = this.props

        let listitems = this.getListItems(listobject)

        return <div style = {
            {
                paddingLeft:'6px',
                paddingBottom:'32px',
            }
        }>
            {listitems}
        </div>
    }
}

export default CategoriesList