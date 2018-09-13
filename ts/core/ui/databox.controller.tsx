// databox.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import React from 'react'

import BoxIdentityBar from './databox/identitybar.view'
import BoxTypebar from './databox/typebar.view'
// import ProfileBar from './databox/profilebar.view'
// import ProfileForm from './databox/profileform.view'
import DirectoryBar from './databox/directorybar.view'
import DirectoryList from './databox/directorylist.view'
// import ScanBar from './databox/scanbar.view'

import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'
import Icon from '@material-ui/core/Icon'

const ResizeTab = props => {

    return <div style = {{
        position:'absolute',
        right:'-21px',
        top:'calc(50% - 16px)',
        width:'20px',
        height:'32px',
        border:'1px solid gray',
        borderLeft:'1px solid transparent',
        backgroundColor:'white',
        borderRadius:'0 8px 8px 0',
        opacity:.54,
    }}>
        <div style = {{margin:'4px 0 0 -3px'}} >
            <Icon style = {{transform:'rotate(90deg)',opacity:.54}}>drag_handle</Icon>
        </div>
    </div>
}

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

    collapseTargetData

    componentDidMount() {
        let { collapseTargetData } = this.props
        // console.log('collapsing from componentdidMOUNT',collapseTargetData)
        // console.log('box componentdidMOUNT', this.state)
        if (!collapseTargetData) return
        // console.log('didMOUNT collapseTargetData',collapseTargetData)
        this.collapseTargetData = collapseTargetData

        setTimeout(()=>{
            this.doHighlights(collapseTargetData)
            setTimeout(()=>{
                this.collapseTargetData = null
            },2000)
        })
    }

    componentDidUpdate() {
        let { collapseTargetData } = this.props
        // console.log('box componentdidUPDATE', this.state)
        if (!collapseTargetData) return
        // console.log('didupdate collapseTargetData',collapseTargetData)
        if (this.collapseTargetData) return // avoid infinite recursion, triggered by list highlight

        this.collapseTargetData = collapseTargetData
        setTimeout(()=>{
            this.doHighlights(collapseTargetData)
            setTimeout(()=>{
                this.collapseTargetData = null
            },2000)
        })
    }

    // TODO: migrate code to componentDidUpdate
    componentWillReceiveProps(newProps) {
        // console.log('old and new boxProxy',this.state.boxProxy,newProps.boxProxy)
        if (this.state.boxProxy !== newProps.boxProxy) {
            this.setState({
                boxProxy:newProps.boxProxy,
            })
        }
    }

    doHighlights = (collapseTargetData) => {

        this.props.highlightBox({boxElement:this.boxframe.current})

        if (collapseTargetData.action == 'expand' || 
            collapseTargetData.action == 'splay') {

            let dataref = 
                collapseTargetData.liststack[
                    collapseTargetData.liststack.length -1]

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

    collapseDirectoryItem = () => {

        this.props.collapseDirectoryItem(this.state.boxProxy)

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
            : null

        return retval
    }

    indexmarker = () => {
        return (
            this.props.haspeers?
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
            : null
        )
    }

    render() {

        let { item, getList, haspeers } = this.props

        let listStack = this.state.boxProxy.liststack

        let { list:listroot } = item

        let listref

        if (listStack.length) {
            listref = listStack[listStack.length-1]
        } else {
            listref = listroot
        }

        let listobject = getList(listref)

        let frameStyle:React.CSSProperties = {
            width:'300px',
            backgroundColor:'white',
            border:this.collapseTargetData?'1px solid blue':'1px solid silver',
            maxHeight:'96%',
            minHeight:'60%',
            boxSizing:'border-box',
            borderRadius:'8px',
            fontSize:'smaller',
            boxShadow: haspeers?'none':'0 0 12px black',
            margin:haspeers?'none':'auto',
            position:'relative',
        }

        let scrollboxstyle:React.CSSProperties = {
            height:(this.props.containerHeight - 185) + 'px', // this figure is the net of many inside amounts!
            overflow:'auto',
            position:'relative', // required for offsetParent of highlightItem search
            paddingLeft:'6px',
            paddingBottom:'32px',
        }

        let listcount = listobject.list.length

        let listItemType = this.props.getType(listobject.type)
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
            <ResizeTab />
            <BoxTypebar 
                item = {item} 
                listcount = {listcount}
                splayBox = {this.splayBox}
                haspeers = {this.props.haspeers}
                selectFromSplay = {this.props.selectFromSplay}
            />
            <BoxIdentityBar item = {item} />
            <div style = {
                    {
                        height:'calc(100% - 78px)',
                        position:'relative',
                    }
                }
            >
                <div>
                    <DirectoryBar 
                        item = {item} 
                        getList = {this.props.getList}
                        listStack = {this.state.boxProxy.liststack}
                        collapseDirectoryItem = {this.collapseDirectoryItem}
                        haspeers = {this.props.haspeers}
                    />
                </div>
                <div style = {scrollboxstyle}>
                    <DirectoryList 
                        ref = {this.listcomponent}
                        listobject = {listobject} 
                        highlightrefuid = {this.state.highlightrefuid}
                        getList = {this.props.getList}
                        expandDirectoryItem = {this.props.expandDirectoryItem}
                        highlightItem = {this.highlightItem}
                    />
                </div>
                { this.modifybuttons(listItemType) }
                { this.indexmarker() }
            </div>
        </div>
        </div>
    }
}

// <ProfileBar item = {item} />
// <ProfileForm item = {item} />
// <ScanBar item = {item} />

export default DataBox
