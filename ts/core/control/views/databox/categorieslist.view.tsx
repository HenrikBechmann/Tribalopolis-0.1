// categorieslist.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'

import CategoryNode from './categorynode.view'

let getCategoryNodes = node => {


    let categories = node.categories.set 
    let order = node.categories.order

    let catitems = []
    for (let id of order) {
        let data = categories[id]

        let catitem = <CategoryNode key = {id} id = {id} data = {data} />

        catitems.push(catitem)
    }
    return catitems
}

const CategoriesList = props => {

    let { node } = props

    let list = getCategoryNodes(node)

    return <div style = {{paddingLeft:'6px'}} >
        {list}
    </div>
}

export default CategoriesList