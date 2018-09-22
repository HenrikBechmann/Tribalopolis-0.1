// databox.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import React from 'react'

import Icon from '@material-ui/core/Icon'
import CircularProgress from '@material-ui/core/CircularProgress'

import BoxIdentityBar from './databox/identitybar.view'
import BoxTypebar from './databox/typebar.view'
// import ProfileBar from './databox/profilebar.view'
// import ProfileForm from './databox/profileform.view'
import DirectoryBar from './databox/directorybar.view'
import DirectoryList from './databox/directorylist.view'
// import ScanBar from './databox/scanbar.view'

import proxy from '../utilities/proxy'

const tabstyles:React.CSSProperties = {
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
}

let wrapperStyle:React.CSSProperties = {
    boxSizing:'border-box',
}

let frameStyle:React.CSSProperties = {
    backgroundColor:'white',
    maxHeight:'96%',
    minHeight:'60%',
    boxSizing:'border-box',
    borderRadius:'8px',
    fontSize:'smaller',
    position:'relative',
}

const wrapperstyles = {margin:'4px 0 0 -3px'}

const iconstyles = {transform:'rotate(90deg)',opacity:.54}

const ResizeTab = props => {

    return <div style = {tabstyles}>
        <div style = {wrapperstyles} >
            <Icon style = {iconstyles}>drag_handle</Icon>
        </div>
    </div>
}

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

        console.log('updating ',this.itemProxy?this.itemProxy.instanceid:'no item',this.itemProxy.path)
        // pick up and clear the queue
        collapseTargetProxy = this.queueCollapseTargetProxy
        this.queueCollapseTargetProxy = null

        // check sentinel
        if (this.collapseTargetProxy) return // avoid infinite recursion, triggered by list highlight
        // set sentinel
        this.collapseTargetProxy = collapseTargetProxy

        setTimeout(()=>{
            this.doHighlights(collapseTargetProxy)
            setTimeout(()=>{
                this.collapseTargetProxy = null // clear sentinel
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

    cacheItemData = (data,type) => {
        // setTimeout(()=>{
            this.setState({
                item:{
                    data,
                    type
                }
            },() => { // set matching list proxies for children

                if (!this.state.MainlistProxy) { // no proxies have been set
                    // setTimeout(()=>{
                            let listdoctoken
                            if (this.itemProxy.liststack.length) {
                                listdoctoken = this.itemProxy.liststack[this.itemProxy.liststack.length -1]
                            } else {
                                listdoctoken = this.state.item.data.list
                            }
                            this.setState({
                                MainlistProxy:new proxy({token:listdoctoken}),
                                BarlistProxy: new proxy({token:listdoctoken}),
                                TypelistProxy: new proxy({token:listdoctoken}),
                            })

                    // })
                }
            })

        // })
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

        let { haspeers } = this.props

        let item = this.state.item?this.state.item.data:null
        let itemType = this.state.item?this.state.item.type:null

        let listStack = this.itemProxy.liststack

        if (!item) {
            let wrapperStyle2 = Object.assign({},wrapperStyle)
            wrapperStyle2.height = (this.props.containerHeight - 16) + 'px'
            wrapperStyle2.width = haspeers?(this.props.boxwidth + 32) + 'px':'auto'
            wrapperStyle2.float = haspeers?'left':'none'
            wrapperStyle2.padding = haspeers?'initial':'16px'

            let frameStyle2 = Object.assign({},frameStyle)
            frameStyle2.maxHeight = '100%'
            frameStyle2.height = frameStyle.maxHeight
            frameStyle2.width = haspeers?'none':(this.props.boxwidth) + 'px'
            frameStyle2.margin = haspeers?'16px':'auto'

            return <div style = {wrapperStyle2}>
                <div style = {frameStyle2}>
                    <CircularProgress size = {24}/>
                </div>
            </div>
        }
        
        // experimenting with style management...
        // origin is readonly for some reason
        let wrapperStyle2 = Object.assign({},wrapperStyle, 
            {
                float:haspeers?'left':'none',
                width:haspeers?(this.props.boxwidth + 32) + 'px':'none',
                padding: haspeers?'none':'16px'
            }
        )
        let frameStyle2 = Object.assign({},frameStyle, 
            {
                border:this.collapseTargetProxy?'1px solid blue':'1px solid silver',
                boxShadow: haspeers?'none':'0 0 12px black',
                width: haspeers?'none':(this.props.boxwidth) + 'px',
                margin: haspeers?'16px':'auto',
            }
        )

        return  <div data-index = {this.props.index} style = { wrapperStyle2 }>
            <div style = {frameStyle2}
                ref = {this.boxframe}
            >
            {haspeers?null:<ResizeTab />}
            <BoxTypebar 
                item = { item } 
                itemType = { itemType /*future*/}
                listProxy = {this.state.TypelistProxy}
                haspeers = {this.props.haspeers}

                callbacks = {this.typecallbacks}
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
                        listProxy = {this.state.BarlistProxy}
                        setListListener = {this.props.callbacks.setListListener}
                        removeListListener = {this.props.callbacks.removeListListener}

                        listStack = {this.itemProxy.liststack}
                        collapseDirectoryItem = {this.collapseDirectoryItem}
                    />
                </div>
                
                <DirectoryList 
                    ref = {this.listcomponent}

                    listProxy = {this.state.MainlistProxy}
                    highlightrefuid = {this.state.highlightrefuid}
                    containerHeight = {this.props.containerHeight}

                    callbacks = {this.listcallbacks}
                />
                
                { this.indexmarker() }

            </div>
        </div>
        </div>
    }
}

export default DataBox
