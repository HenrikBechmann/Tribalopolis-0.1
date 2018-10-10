// databox.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import React from 'react'

import { withStyles, createStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'

import BoxIdentityBar from './databox/identitybar.view'
import BoxTypebar from './databox/typebar.view'
// import ProfileBar from './databox/profilebar.view'
// import ProfileForm from './databox/profileform.view'
import DirectoryBar from './databox/directorybar.view'
import DirectoryList from './databox/directorylist.view'
// import ScanBar from './databox/scanbar.view'

import ResizeTab from './databox/resizetab.view'
import NavigationMenuTab from './databox/navigationmenutab.view'

import proxy from '../utilities/proxy'

const styles = createStyles({
    wrapper:{
        boxSizing:'border-box',
        position:'relative',
    },
    frame:{
        height:'100%',
        backgroundColor:'white',
        minHeight:'60%',
        boxSizing:'border-box',
        borderRadius:'8px 0 8px 8px',
        fontSize:'smaller',
        position:'relative',
        transition:'width .5s',
    },
    indexMarker:{
        position:'absolute',
        bottom:'-16px',
        left:'0',
        fontSize:'smaller',
        color:'gray',
    },
    identityBar:{
        display:'flex',
        flexDirection:'column',
        position:'relative',
        height:'100%',
    },
})

class DataBox extends React.Component<any,any> {

    constructor(props) {
        super(props)
        this.boxframe = React.createRef()
        this.listcomponent = React.createRef()
    }

    state = {
        highlightrefuid:null,
        item:null,
        MainlistProxy:null,
        BarlistProxy:null,
        TypelistProxy:null,
    }

    // always available; no need to check state
    itemProxy = this.props.itemProxy

    boxframe
    listcomponent

    collapseTargetProxy
    queueCollapseTargetProxy

    componentDidMount() {
        // console.log('did mount',this.itemProxy?this.itemProxy.instanceid:'no item')
        let { itemProxy } = this
        this.props.callbacks.setItemListener(
            itemProxy.token, itemProxy.instanceid,this.cacheItemData
        )
    }

    componentDidUpdate() {
        let { collapseTargetProxy } = this.props // gets set then cancelled by parent

        if (collapseTargetProxy) { // if found, queue the trigger
            this.queueCollapseTargetProxy = collapseTargetProxy
        }

        if (!this.state.item) return // wait for item document to appear

        if (!this.queueCollapseTargetProxy) return

        // pick up and clear the queue
        collapseTargetProxy = this.queueCollapseTargetProxy
        this.queueCollapseTargetProxy = null

        this.collapseTargetProxy = collapseTargetProxy // for coloring target box border

        setTimeout(()=>{
            this.doHighlights(collapseTargetProxy)
            setTimeout(()=>{
                this.collapseTargetProxy = null // clear queue for box border
            },2000)
        })
    }

    componentWillUnmount() {
        // unsubscribe data
        // console.log('unmounting',this.itemProxy.instanceid)
        let { itemProxy } = this
        this.props.callbacks.removeItemListener(
            itemProxy.token, itemProxy.instanceid
        )
    }

    cacheItemData = (document,type) => {

        this.setState({
            item:{
                document,
                type
            }
        },() => { // set matching list proxies for children

            if (!this.state.MainlistProxy) { // no proxies have been set

                let listdoctoken
                if (this.itemProxy.liststack.length) {
                    listdoctoken = this.itemProxy.liststack[this.itemProxy.liststack.length -1]
                } else {
                    listdoctoken = {
                        uid:this.state.item.document.references.list,
                        repo:'lists',
                    }
                }
                this.setState({
                    MainlistProxy: new proxy({token:listdoctoken}),
                    BarlistProxy: new proxy({token:listdoctoken}),
                    TypelistProxy: new proxy({token:listdoctoken}),
                })

            }
        })

    }

    doHighlights = (collapseTargetProxy) => {

        this.props.callbacks.highlightBox({boxElement:this.boxframe.current})

        if (collapseTargetProxy.action == 'expand' || 
            collapseTargetProxy.action == 'splay') {

            let token = 
                collapseTargetProxy.liststack[
                    collapseTargetProxy.liststack.length -1]

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

    splayBox = (domSource,listDocument) => {
        return this.props.callbacks.splayBox(domSource, this.listcomponent, listDocument)
    }

    highlightItem = (itemref) => {

        let itemelement:HTMLElement = itemref.current

        itemelement.classList.add('highlight')

        setTimeout(() => {
            itemelement.classList.remove('highlight')
        },2000)

    }

    indexmarker = (classes) => {
        return (
            this.props.haspeers?
            <div
                className = {classes.indexMarker}
            >{this.props.index + 1}</div>
            : null
        )
    }

    listcallbacks = {
        setListListener:this.props.callbacks.setListListener,
        removeListListener:this.props.callbacks.removeListListener,
        expandDirectoryItem:this.props.callbacks.expandDirectoryItem,
        highlightItem:this.highlightItem,
    }

    typecallbacks = {
        setListListener:this.props.callbacks.setListListener,
        removeListListener:this.props.callbacks.removeListListener,
        splayBox:this.splayBox,
        selectFromSplay:this.props.callbacks.selectFromSplay,
    }

    render() {

        let { haspeers, classes, containerHeight } = this.props

        let item = this.state.item?this.state.item.document:null
        let itemType = this.state.item?this.state.item.type:null

        let listStack = this.itemProxy.liststack

        let wrapperStyle:React.CSSProperties = {
            height:haspeers?(containerHeight - 32 -2) + 'px':(containerHeight -2) + 'px',
            float:haspeers?'left':'none',
            width:haspeers?(this.props.boxwidth + 56) + 'px':'none',
            left:haspeers?'auto':'-20px',
            padding:haspeers?'initial':'16px',
            margin: haspeers?'16px 0':'inherit',
        }

        let frameStyle:React.CSSProperties = {
            border:this.collapseTargetProxy?'1px solid blue':'1px solid silver',
            width:haspeers?'none':(this.props.boxwidth) + 'px',
            margin:haspeers?'0 40px 0 16px':'auto',
        }

        // over-rides for placeholder
        if (!item) {
            return <div className = {classes.wrapper} style = {wrapperStyle}>
                <div className = {classes.frame} style = {frameStyle}>
                    <CircularProgress size = {24}/>
                </div>
            </div>
        }
        
        return  <div 
            data-index = {this.props.index} 
            className = {classes.wrapper} 
            style = { wrapperStyle}
        >
            <div className = {classes.frame} style = {frameStyle}
                ref = {this.boxframe}
            >
                <NavigationMenuTab 
                    itemType = { itemType /*future*/}
                    listProxy = {this.state.TypelistProxy}
                    haspeers = {haspeers}

                    callbacks = {this.typecallbacks}
                />
                { !haspeers && <ResizeTab 
                    boxwidth = {this.props.boxwidth} 
                    boxframe = {this.boxframe}
                    setBoxWidth = { this.props.callbacks.setBoxWidth }
                /> }
                <div data-name = 'box-contents-wrapper'
                    style = {
                        {
                            display:'flex',
                            flexDirection:'column',
                            flexWrap:'nowrap',
                            alignContent:'flex-start',
                            height:'100%',
                        }
                    }>
                    {false && <BoxTypebar 
                        item = { item } 
                        itemType = { itemType /*future*/}
                        listProxy = {this.state.TypelistProxy}
                        haspeers = {haspeers}

                        callbacks = {this.typecallbacks}
                    />}
                    {!listStack.length && <BoxIdentityBar item = {item} />}

                    <div className = {classes.identityBar} >

                        <DirectoryBar 
                            haspeers = {haspeers}
                            listProxy = {this.state.BarlistProxy}
                            setListListener = {this.props.callbacks.setListListener}
                            removeListListener = {this.props.callbacks.removeListListener}

                            listStack = {listStack}
                            collapseDirectoryItem = {this.collapseDirectoryItem}
                        />
                        <div data-name = 'directory-list' style = {{
                            display:'flex',
                            flexDirection:'row',
                            height:'100%',
                        }}>
                            <div style = {{
                                alignSelf:'stretch',
                                display:'flex',
                                width:'100%',
                            }}>
                                <DirectoryList 
                                    ref = {this.listcomponent}

                                    listProxy = {this.state.MainlistProxy}
                                    highlightrefuid = {this.state.highlightrefuid}

                                    callbacks = {this.listcallbacks}
                                />
                            </div>
                        </div>
                        { this.indexmarker(classes) }

                    </div>
                </div>
            </div>
        </div>
    }
}

export default withStyles(styles)(DataBox)
