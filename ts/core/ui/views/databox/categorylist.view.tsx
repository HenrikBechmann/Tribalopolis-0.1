// categorieslist.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'

import CategoryItem from './categorynode.view'

class CategoriesList extends React.Component<any,any> {
    state = {
        open:this.props.open,
        listheight:this.props.open?'auto':'0',
    }

    listelement = null

    componentWillReceiveProps(nextProps) {
        let { open:willbeopen } = nextProps
        if ( willbeopen !== this.state.open ) {
            let targetheight = null
            let startheight = null
            let finalheight = null
            let subheight = this.listelement.offsetHeight + 'px'
            if (this.state.open) {
                targetheight = '0',
                startheight = subheight 
                finalheight = '0'
            } else {
                targetheight = subheight
                startheight = '0'
                finalheight = 'auto'
            }
            this.setState({
                listheight:startheight
            },
                () => {
                    setTimeout(()=>{
                        this.setState({
                            listheight:targetheight,
                            open:willbeopen,
                        },
                            () => {
                                setTimeout(() =>{
                                    this.setState({
                                        listheight:finalheight,
                                    })
                                },600)
                            }
                        )
                    },50)
                }
            )
        }
    }

    getCategoryItems = item => {


        let { links } = item

        let { getListItem } = this.props

        let catitems = []
        for (let ref of links) {
            let data = getListItem(ref)

            let catitem = <CategoryItem key = {ref.id} id = {ref.id} data = {data} />

            catitems.push(catitem)
        }
        return <div
            ref = {element => {
                this.listelement = element
            }}
        >{catitems}</div>
    }

    render() {

        let { item } = this.props

        console.log

        let list = this.getCategoryItems(item)

        return <div style = {
            {
                paddingLeft:'6px',
                height:this.state.listheight,
                overflow:'hidden',
                transition:'height 0.5s ease-out'
            }
        }>
            {list}
        </div>
    }
}

export default CategoriesList