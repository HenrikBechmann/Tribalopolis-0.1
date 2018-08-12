// databox.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'

import BoxIdentifier from './views/databox/identitybar.view'
import BoxTypebar from './views/databox/typebar.view'
import ProfileBar from './views/databox/profilebar.view'
import ProfileForm from './views/databox/profileform.view'
import CategoriesBar from './views/databox/categoriesbar.view'
import CategoryList from './views/databox/categorylist.view'
import ScanBar from './views/databox/scanbar.view'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add'

class DataBox extends React.Component<any,any> {

    constructor(props) {
        super(props)
        this.boxframe = React.createRef()
    }

    state = {
        opacity:0,
        boxconfig:this.props.boxConfig,
        highlightrefuid:this.props.highlightrefuid
    }

    boxframe

    componentDidMount() {
        this.setState({
            opacity:1,
        },() => {
            let { collapseBoxConfigForTarget } = this.props
            if (collapseBoxConfigForTarget) {

                this.props.highlightBox(this.boxframe)

                if (collapseBoxConfigForTarget.action == 'expand' || collapseBoxConfigForTarget.action == 'splay') {

                    let dataref = collapseBoxConfigForTarget.liststack[collapseBoxConfigForTarget.liststack.length -1]

                    if (dataref) {

                        this.setState({
                            highlightrefuid:dataref.uid,
                        },() => {
                            this.setState({
                                highlightrefuid:null
                            })
                        })

                    }
                }
            }
        })
    }

    componentWillReceiveProps(newProps) {
        // console.log('old and new boxconfig',this.state.boxconfig,newProps.boxConfig)
        if (this.state.boxconfig !== newProps.boxConfig) {
            this.setState({
                boxconfig:newProps.boxConfig,
            })
        }
    }

    collapseCategory = () => {

        let boxConfig = this.state.boxconfig

        // console.log('databox collapseCategory boxConfig',boxConfig)

        this.props.collapseCategory(boxConfig)

        // let boxConfig = this.state.boxconfig
        // if (!boxConfig.liststack.length) return
        // let ref = boxConfig.liststack.pop()

        // this.setState({
        //     boxConfig,
        //     highlightrefuid:ref.uid,
        // },() => {
        //     this.setState({
        //         highlightrefuid:null
        //     })
        // })
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

        let outgoing = listItemType.properties.is.outgoing

        let retval = (outgoing)?<div style = {{position:'absolute',bottom:'-8px',right:'0'}}>
            <FloatingActionButton secondary = {true} mini = {true} style={{marginRight:'12px'}} >
              <ContentAdd />
            </FloatingActionButton>
        </div>:null
        return retval
    }

    render() {

        // console.log('databox render',this.state.boxconfig)

        let { item, getListItem, haspeers } = this.props

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
            transition:'opacity .5s ease-in',
            boxShadow: haspeers?'none':'0 0 12px black',
        }

        let scrollboxstyle:React.CSSProperties = {
            height:'calc(100% - 64px)',
            overflow:'auto',
            position:'relative', // required for offsetParent of highlightItem search
            paddingLeft:'6px',
            paddingBottom:'32px',
        }

        let listcount = listobject.links.length

        let listItemType = this.props.getListItemType(listobject.type)
        // placeholder logic for showing add button

        return <div style = {frameStyle}
                ref = {this.boxframe}
            >
            <BoxTypebar 
                item = {item} 
                listcount = {listcount}
                splayBox = {this.props.splayBox}
                haspeers = {this.props.haspeers}
                selectFromSplay = {this.props.selectFromSplay}
            />
            <BoxIdentifier item = {item} />
            <div style = {
                    {
                        height:'calc(100% - 70px)',
                        position:'relative',
                    }
                }
            >
                <div>
                    <CategoriesBar 
                        item = {item} 
                        getListItem = {this.props.getListItem}
                        listStack = {this.state.boxconfig.liststack}
                        collapseCategory = {this.collapseCategory}
                        haspeers = {this.props.haspeers}
                    />
                </div>
                <div data-marker = 'databox-scrollbox' style = {scrollboxstyle}>
                    <CategoryList 
                        listobject = {listobject} 
                        highlightrefuid = {this.state.highlightrefuid}
                        getListItem = {this.props.getListItem}
                        expandCategory = {this.props.expandCategory}
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
