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
import CircularProgress from '@material-ui/core/CircularProgress'

const ResizeTab = props => {

    return <div style = {{
        position:'absolute',
        right:'-22px',
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
        highlightrefuid:null,
        item:null,
        list:null,
    }

    itemProxy = this.props.itemProxy
    listProxy = null

    boxframe
    listcomponent

    collapseTargetData

    componentDidMount() {
        // console.log('box componentDidMount')
        this.props.callbacks.setItemListener(this.cacheItemData)
    }

    waitingCollapseTargetData

    componentDidUpdate() {

        let { collapseTargetData } = this.props

        if (collapseTargetData) {
            this.waitingCollapseTargetData = collapseTargetData
        }

        // console.log('box componentdidUPDATE', this.state, collapseTargetData)

        if (!this.state.item) return

        if (!this.waitingCollapseTargetData) return
        collapseTargetData = this.waitingCollapseTargetData
        this.waitingCollapseTargetData = null
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

    componentWillUnmount() {
    }

    cacheItemData = (data,type) => {
        this.setState((state) => {
            return {...state,item:{data,type}}
        },() => {
            if (!this.state.list) {
                let listdoctoken
                if (this.itemProxy.liststack.length) {
                    listdoctoken = this.itemProxy.liststack[this.itemProxy.liststack.length -1]
                } else {
                    listdoctoken = this.state.item.data.list
                }
                this.listdoctoken = listdoctoken
                this.props.callbacks.setListListenerA(listdoctoken,this.cacheListData)
            }
        })
    }

    listdoctoken //transfer var

    cacheListData = (data,type) => {
        this.setState((state) => {
            return {...state,list:{data,type,token:this.listdoctoken}}
        })
    }
    doHighlights = (collapseTargetData) => {

        this.props.callbacks.highlightBox({boxElement:this.boxframe.current})

        if (collapseTargetData.action == 'expand' || 
            collapseTargetData.action == 'splay') {

            let token = 
                collapseTargetData.liststack[
                    collapseTargetData.liststack.length -1]

            if (token) {

                setTimeout(()=>{
                    this.setState({
                        highlightrefuid:token.uid,
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

        this.props.callbacks.collapseDirectoryItem(this.itemProxy)

    }

    splayBox = (domSource) => {
        return this.props.callbacks.splayBox(domSource, this.listcomponent,this.state.list.data)
    }

    highlightItem = (itemref) => {

        let itemelement:HTMLElement = itemref.current

        itemelement.classList.add('highlight')

        setTimeout(() => {
            itemelement.classList.remove('highlight')
        },2000)

    }

    modifybuttons = (listItemType) => {

        if (!listItemType) return null

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

        let { setListListener, haspeers } = this.props

        let item = this.state.item?this.state.item.data:null

        let wrapperStyle:React.CSSProperties = {
            float:haspeers?'left':'none',
            padding:'16px',
        }

        let frameStyle:React.CSSProperties = {
            width:this.props.boxwidth + 'px',
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

        if (!item) {
            let wrapperStyle2 = Object.assign({},wrapperStyle)
            wrapperStyle2.height = '100%'
            wrapperStyle2.boxSizing = 'border-box'
            let frameStyle2 = Object.assign({},frameStyle)
            frameStyle2.padding = '16px'
            frameStyle2.maxHeight = '100%'
            frameStyle2.height = frameStyle2.maxHeight
            return <div style = {wrapperStyle2}>
                <div style = {frameStyle2}>
                    <CircularProgress size = {24}/>
                </div>
            </div>
        }

        let listStack = this.itemProxy.liststack

        let { list:listroot } = item

        let listDocument = this.state.list? this.state.list.data:null 

        let scrollboxstyle:React.CSSProperties = {
            height:(this.props.containerHeight - 185) + 'px', // this figure is the net of many inside amounts!
            overflow:'auto',
            position:'relative', // required for offsetParent of highlightItem search
            paddingLeft:'6px',
            paddingBottom:'32px',
        }

        let listcount = listDocument?listDocument.list.length:0

        let listItemType = this.state.list?this.state.list.type:null
        // placeholder logic for showing add button

        // this.props.cacheListData(listDocument, listItemType)

        return  <div style = { wrapperStyle }>
            <div style = {frameStyle}
                ref = {this.boxframe}
            >
            {haspeers?null:<ResizeTab />}
            <BoxTypebar 
                item = {item} 
                listcount = {listcount}
                splayBox = {this.splayBox}
                haspeers = {this.props.haspeers}
                selectFromSplay = {this.props.callbacks.selectFromSplay}
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
                        listDocument = {listDocument}
                        listStack = {this.itemProxy.liststack}
                        collapseDirectoryItem = {this.collapseDirectoryItem}
                    />
                </div>
                
                <div style = {scrollboxstyle}>
                    <DirectoryList 
                        ref = {this.listcomponent}
                        listDocument = {listDocument} 
                        highlightrefuid = {this.state.highlightrefuid}
                        setListListener = {this.props.callbacks.setListListener}
                        expandDirectoryItem = {this.props.callbacks.expandDirectoryItem}
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
