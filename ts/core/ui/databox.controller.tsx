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
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add'

class DataBox extends React.Component<any,any> {

    constructor(props) {
        super(props)
        this.categoriesbarwrapper = React.createRef()
    }

    categoriesbarwrapper

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
        },() => {
            let element:HTMLElement = this.categoriesbarwrapper.current
            element.classList.add('outlinehighlight')
            setTimeout(() => {
                element.classList.remove('outlinehighlight')
            },2000)
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

        let diff = (clientoffset + itemelement.offsetHeight) - scrollelement.clientHeight
        if (diff > 0) {
            scrollelement.scrollTop = diff
        }

        itemelement.classList.add('highlight')
        setTimeout(() => {
            itemelement.classList.remove('highlight')
        },2000)
    }

    modifybuttons = (listItemType) => {
        console.log('listItemType',listItemType)
        // let incoming = false
        // if (listItemType && listItemType.properties && listItemType.properties.is) {
        let outgoing = listItemType.properties.is.outgoing
        // }
        let retval = (outgoing)?<div style = {{position:'absolute',bottom:'-8px',right:'0'}}>
            <FloatingActionButton secondary = {true} mini = {true} style={{marginRight:'12px'}} >
              <ContentAdd />
            </FloatingActionButton>
        </div>:null
        return retval
    }

    render() {

        let { item, getListItem } = this.props

        let listStack = this.state.boxconfig.liststack

        let { listref:listroot } = item

        let listref

        if (listStack.length) {
            listref = listStack[listStack.length-1]
        } else {
            listref = listroot
        }

        let listobject = getListItem(listref)

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
        }

        let scrollboxstyle:React.CSSProperties = {
            height:'calc(100% - 32px)',
            overflow:'auto',
            position:'relative', // required for offsetParent of highlightItem search
        }

        let listcount = listobject.links.length

        let listItemType = this.props.getListItemType(listobject.type)
        // placeholder logic for showing add button

        return <div style = {frameStyle}>
            <BoxTypebar 
                item = {item} 
                listcount = {listcount}
                splayBox = {this.props.splayBox}
            />
            <BoxIdentifier item = {item} />
            <div style = {
                    {
                        height:'calc(100% - 70px)',
                        position:'relative',
                    }
                }
            >
                <div ref = {this.categoriesbarwrapper}>
                    <CategoriesBar 
                        item = {item} 
                        getListItem = {this.props.getListItem}
                        listStack = {this.state.boxconfig.liststack}
                        collapseCategory = {this.collapseCategory}
                    />
                </div>
                <div data-marker = 'databox-scrollbox' style = {scrollboxstyle}>
                    <CategoriesList 
                        listobject = {listobject} 
                        highlightrefid = {this.state.highlightrefid}
                        getListItem = {this.props.getListItem}
                        expandCategory = {this.expandCategory}
                        highlightItem = {this.highlightItem}
                    />
                </div>
                {this.modifybuttons(listItemType)}
            </div>
        </div>
    }
}

// <ProfileBar item = {item} />
// <ProfileForm item = {item} />
// <ScanBar item = {item} />

export default DataBox
