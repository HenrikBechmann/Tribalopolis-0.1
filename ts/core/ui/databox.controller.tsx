// databox.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'

import BoxIdentifier from './databox/identitybar.view'
import BoxTypebar from './databox/typebar.view'
import ProfileBar from './databox/profilebar.view'
import ProfileForm from './databox/profileform.view'
import CategoriesBar from './databox/categoriesbar.view'
import CategoryList from './databox/categorylist.view'
import ScanBar from './databox/scanbar.view'

import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'

const styles = theme => ({
  button: {
    marginRight: theme.spacing.unit
  },
})

const BaseFloatingAddButton = (props) => {
    const { classes } = props
    return <Button variant = 'fab' mini color = 'secondary' aria-label = 'Add' className = {classes.button} >
      <AddIcon />
    </Button>
}

const FloatingAddButton = withStyles(styles)(BaseFloatingAddButton)

class DataBox extends React.Component<any,any> {

    constructor(props) {
        super(props)
        this.boxframe = React.createRef()
        this.listcomponent = React.createRef()
    }

    state = {
        // opacity:1,
        boxProxy:this.props.boxProxy,
        highlightrefuid:this.props.highlightrefuid
    }

    boxframe
    listcomponent

    componentDidMount() {
        let { collapseBoxConfigForTarget } = this.props
        // console.log('collapsing from componentdidMOUNT',collapseBoxConfigForTarget)
        // console.log('box componentdidMOUNT', this.state)
        if (!collapseBoxConfigForTarget) return
        // console.log('didMOUNT collapseBoxConfigForTarget',collapseBoxConfigForTarget)
        this.collapseBoxConfigForTarget = collapseBoxConfigForTarget

        setTimeout(()=>{
            this.doHighlights(collapseBoxConfigForTarget)
            setTimeout(()=>{
                this.collapseBoxConfigForTarget = null
            },2000)
        })
    }

    collapseBoxConfigForTarget

    componentDidUpdate() {
        let { collapseBoxConfigForTarget } = this.props
        // console.log('box componentdidUPDATE', this.state)
        if (!collapseBoxConfigForTarget) return
        // console.log('didupdate collapseBoxConfigForTarget',collapseBoxConfigForTarget)
        if (this.collapseBoxConfigForTarget) return // avoid infinite recursion, triggered by list highlight

        this.collapseBoxConfigForTarget = collapseBoxConfigForTarget
        setTimeout(()=>{
            this.doHighlights(collapseBoxConfigForTarget)
            setTimeout(()=>{
                this.collapseBoxConfigForTarget = null
            },2000)
        })
    }

    componentWillReceiveProps(newProps) {
        // console.log('old and new boxProxy',this.state.boxProxy,newProps.boxProxy)
        if (this.state.boxProxy !== newProps.boxProxy) {
            this.setState({
                boxProxy:newProps.boxProxy,
            })
        }
    }

    doHighlights = (collapseBoxConfigForTarget) => {

        this.props.highlightBox(this.boxframe)

        if (collapseBoxConfigForTarget.action == 'expand' || 
            collapseBoxConfigForTarget.action == 'splay') {

            let dataref = 
                collapseBoxConfigForTarget.liststack[
                    collapseBoxConfigForTarget.liststack.length -1]

            if (dataref) {

                setTimeout(()=>{
                    this.setState({
                        highlightrefuid:dataref.uid,
                    },() => {
                        this.setState({
                            highlightrefuid:null
                        })
                    })
                })
            }
        }
    }

    collapseCategory = () => {

        this.props.collapseCategory(this.state.boxProxy)

    }

    splayBox = (domSource) => {
        return this.props.splayBox(domSource, this.listcomponent)
    }

    highlightItem = (itemref) => {

        let itemelement:HTMLElement = itemref.current

        itemelement.classList.add('highlight')
        setTimeout(() => {
            itemelement.classList.remove('highlight')
        },2000)

    }

    modifybuttons = (listItemType) => {

        let outgoing = listItemType.properties.is.outgoing

        let retval = outgoing?
            <div style = {{position:'absolute',bottom:'-8px',right:'0'}}>
                <FloatingAddButton />
            </div>
            :
            null
        return retval
    }

    indexmarker = () => {
        return this.props.haspeers?
            <div
                style = {
                    {
                        position:'absolute',
                        bottom:'-16px',
                        left:'0',
                        fontSize:'smaller',
                        color:'gray',
                    }
                }
            >{this.props.index + 1}</div>
            :null
    }

    render() {

        let { item, getListItem, haspeers } = this.props

        let listStack = this.state.boxProxy.liststack

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
            border:this.collapseBoxConfigForTarget?'1px solid blue':'1px solid silver',
            maxHeight:'96%',
            minHeight:'60%',
            boxSizing:'border-box',
            borderRadius:'8px',
            fontSize:'smaller',
            boxShadow: haspeers?'none':'0 0 12px black',
            margin:haspeers?'none':'auto',
        }

        let scrollboxstyle:React.CSSProperties = {
            height:(this.props.containerHeight - 172) + 'px',
            overflow:'auto',
            position:'relative', // required for offsetParent of highlightItem search
            paddingLeft:'6px',
            paddingBottom:'32px',
        }

        let listcount = listobject.links.length

        let listItemType = this.props.getListItemType(listobject.type)
        // placeholder logic for showing add button

        return  <div style = {
            {
                float:haspeers?'left':'none',
                padding:'16px',
            }
        }>
            <div style = {frameStyle}
                ref = {this.boxframe}
            >
            <BoxTypebar 
                item = {item} 
                listcount = {listcount}
                splayBox = {this.splayBox}
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
                        listStack = {this.state.boxProxy.liststack}
                        collapseCategory = {this.collapseCategory}
                        haspeers = {this.props.haspeers}
                    />
                </div>
                <div style = {scrollboxstyle}>
                    <CategoryList 
                        ref = {this.listcomponent}
                        listobject = {listobject} 
                        highlightrefuid = {this.state.highlightrefuid}
                        getListItem = {this.props.getListItem}
                        expandCategory = {this.props.expandCategory}
                        highlightItem = {this.highlightItem}
                    />
                </div>
                {this.modifybuttons(listItemType)}
                {this.indexmarker()}
            </div>
        </div>
        </div>
    }
}

// <ProfileBar item = {item} />
// <ProfileForm item = {item} />
// <ScanBar item = {item} />

export default DataBox
