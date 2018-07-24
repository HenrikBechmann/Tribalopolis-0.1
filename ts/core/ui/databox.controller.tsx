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
        this.scrollelementref = React.createRef()
    }

    state = {
        opacity:0,
        boxconfig:this.props.boxConfig,
        refid:null,
        open:true,
    }

    scrollelementref

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
            refid:ref.id,
        },() => {
            this.setState({
                refid:null
            })
        })
    }

    highlightItem = (itemref) => {
        let itemelement:HTMLElement = itemref.current
        let scrollelement:HTMLElement = this.scrollelementref.current
        let clientoffset = 0
        let element:HTMLElement = itemelement
        while (element && (element.getAttribute('data-marker') != 'databox-scrollbox')) {
            clientoffset += element.offsetTop
            console.log('marker',element.getAttribute('data-marker'),clientoffset)
            element = element.offsetParent as HTMLElement
            console.log('next element',element.getAttribute('data-marker'),element)
        }

        console.log('do highlight item', itemref, itemelement, scrollelement, element, clientoffset)
    }

    render() {
        // console.log('item',this.props.item)

        let opacity = this.state.opacity

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
            opacity:opacity,
            transition:'opacity .5s ease-out',
            overflow:'hidden',
        }

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
                    refid = {this.state.refid}
                    getListItem = {this.props.getListItem}
                    listStack = {this.state.boxconfig.liststack}
                    collapseCategory = {this.collapseCategory}
                />
                <div style = {{height:'calc(100% - 28px)',overflow:'auto',position:'relative'}}>
                    <CategoriesList 
                        refid = {this.props.refid}
                        open = {this.state.open} 
                        list = {list} 
                        highlightItem = {this.highlightItem}
                        getListItem = {this.props.getListItem}
                        expandCategory = {this.expandCategory}
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
