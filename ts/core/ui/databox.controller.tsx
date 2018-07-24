// databox.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'

import BoxIdentifier from './views/databox/identitybar.view'
import BoxTypebar from './views/databox/typebar.view'
import ProfileBar from './views/databox/profilebar.view'
import ProfileForm from './views/databox/profileform.view'
import CategoriesBar from './views/databox/categoriesbar.view'
import CategoriesList from './views/databox/categorylist.view'
import ScanBar from './views/databox/scanbar.view'

class DataBox extends React.Component<any,any> {

    constructor(props) {
        super(props)
    }

    state = {
        opacity:0,
        boxconfig:this.props.boxConfig,
        highlightrefid:null,
    }

    componentDidMount() {
        this.setState({
            opacity:1,
        })
    }

    expandCategory = (ref) => {
        let boxConfig = this.state.boxconfig
        boxConfig.liststack.push(ref)
        this.setState({
            boxConfig,
        })
    }

    collapseCategory = () => {
        let boxConfig = this.state.boxconfig
        let ref = boxConfig.liststack.pop()
        this.setState({
            boxConfig,
            highlightrefid:ref.id,
        },() => {
            this.setState({
                highlightrefid:null
            })
        })
    }

    highlightItem = (itemref) => {
        let itemelement:HTMLElement = itemref.current
        let clientoffset = 0
        let element:HTMLElement = itemelement
        while (element && (element.getAttribute('data-marker') != 'databox-scrollbox')) {
            clientoffset += element.offsetTop
            element = element.offsetParent as HTMLElement
        }
        let scrollelement:Element = element

        console.log('do highlight item', itemref, itemelement, scrollelement, element, clientoffset)
    }

    render() {
        // console.log('item',this.props.item)

        let { item,getListItem } = this.props

        let listStack = this.state.boxconfig.liststack

        let { listref:listroot } = item

        let listref

        if (listStack.length) {
            listref = listStack[listStack.length-1]
        } else {
            listref = listroot
        }

        let list = getListItem(listref)

        let frameStyle:React.CSSProperties = {
            width:'300px',
            backgroundColor:'white',
            border:'1px solid silver',
            maxHeight:'96%',
            minHeight:'60%',
            padding:'3px',
            boxSizing:'border-box',
            borderRadius:'8px',
            marginRight:'16px',
            fontSize:'smaller',
            opacity:this.state.opacity,
            transition:'opacity .5s ease-out',
            overflow:'hidden',
        }

        let scrollbarstyle:React.CSSProperties = {
            height:'calc(100% - 28px)',
            overflow:'auto',
            position:'relative',
        }

        return <div style = {frameStyle}>
            <BoxTypebar item = {item} />
            <BoxIdentifier item = {item} />
            <div style = {
                    {
                        height:'calc(100% - 70px)',
                        position:'relative',
                    }
                } 
            >
                <CategoriesBar 
                    item = {item} 
                    getListItem = {this.props.getListItem}
                    listStack = {this.state.boxconfig.liststack}
                    collapseCategory = {this.collapseCategory}
                />
                <div data-marker = 'databox-scrollbox' style = {scrollbarstyle}>
                    <CategoriesList 
                        list = {list} 
                        getListItem = {this.props.getListItem}
                        expandCategory = {this.expandCategory}
                        highlightItem = {this.highlightItem}
                        highlightrefid = {this.state.highlightrefid}
                    />
                </div>
            </div>
        </div>
    }
}

// <ProfileBar item = {item} />
// <ProfileForm item = {item} />
// <ScanBar item = {item} />

export default DataBox
