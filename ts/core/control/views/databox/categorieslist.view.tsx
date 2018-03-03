// categorieslist.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'

import CategoryNode from './categorynode.view'

class CategoriesList extends React.Component<any,any> {
    state = {
        open:this.props.open
    }

    listelement = null

    componentWillGetProps(nextProps) {
        let { open } = nextProps
        if ( open !== this.state.open ) {
            console.log('cat list open changing to ',open)
        }
    }

    getCategoryNodes = node => {


        let categories = node.categories.set 
        let order = node.categories.order

        let catitems = []
        for (let id of order) {
            let data = categories[id]

            let catitem = <CategoryNode key = {id} id = {id} data = {data} />

            catitems.push(catitem)
        }
        return <div
            ref = {element => {
                this.listelement = element
            }}
        >{catitems}</div>
    }

    render() {

        let { node } = this.props

        let list = this.getCategoryNodes(node)

        return <div style = {
            {
                paddingLeft:'6px',
                height:this.state.open?'auto':'0',
                overflow:'hidden',
            }
        }>
            {list}
        </div>
    }
}

export default CategoriesList