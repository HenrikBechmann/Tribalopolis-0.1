// databox.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import React from 'react'

import { withStyles, createStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'

import BoxIdentityBar from './databox/identitybar.view'
import BoxTypebar from './databox/typebar.view'

import DirectoryBar from './databox/directorybar.view'
import DirectoryList from './databox/directorylist.view'
// import ScanBar from './databox/scanbar.view'

import ResizeTab from './databox/resizetab.view'
import NavigationMenuTab from './databox/navigationmenutab.view'

import proxy from '../utilities/proxy'

const buttonstyles = theme => createStyles({
  button: {
    marginRight: theme.spacing.unit
  },
})

const FloatingAddButton = withStyles(buttonstyles)((props:any) => {
    let { classes, onClick } = props
    return <Button 
        variant = 'fab' 
        mini 
        color = 'secondary' 
        aria-label = 'Add' 
        className = {classes.button} 
        onClick = {onClick}
    >
      <AddIcon />
    </Button>
})

const styles = createStyles({
    buttonwrapper:{
        position:'absolute',
        bottom:'-8px',
        right:'0',
    },
    wrapper:{
        boxSizing:'border-box',
        position:'relative',
        overflow:'hidden', // creates problems on mobile
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
    boxcontentswrapper:{
        display:'flex',
        flexFlow:'column',
        height:'100%',
    },
    directoryBlock:{
        display:'flex',
        flexFlow:'column',
        position:'relative',
        flex:1,
        overflow:'hidden', // for FF to allow scroll
    },
    directorylistwrapper:{
        overflow:'hidden',
        flex:1,
    },

})

class DataBox extends React.Component<any,any> {

    constructor(props) {
        super(props)
        this.boxframe = React.createRef()
        this.listcomponent = React.createRef()
        this.itemProxy = this.props.itemProxy
        this.identityItemProxy = new proxy(
            {
                token:this.itemProxy.token,
                liststack:this.itemProxy.liststack.slice()
            }
        )
    }

    state = {
        highlightrefuid:null,
        item:null,
        MainlistProxy:null,
        BarlistProxy:null,
        TypelistProxy:null,
    }

    // always available; no need to check state
    itemProxy
    identityItemProxy

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

        this.collapseTargetProxy = collapseTargetProxy // trigger for coloring target box border

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

    onClickAdd = (proxy) => {
        this.props.callbacks.callDataDrawer(proxy, 'add')
        // console.log('proxy',proxy)
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
            width: haspeers
                ?(this.props.boxwidth + 56) + 'px'
                :'none',
            minWidth: !haspeers
                ?(this.props.boxwidth + 56) + 'px'
                :'none',
            height: haspeers
                ?(containerHeight -2) + 'px'
                :(containerHeight -2) + 'px',
            float: haspeers
                ?'left'
                :'none',
            // try (unsuccessfully) to migigate FF mobile scroll problem
            // display: haspeers
            //     ?'inline-block'
            //     :'block',
            // left: haspeers
            //     ?'auto'
            //     :'-20px',
            padding: haspeers
                ?'16px 40px 16px 16px'
                :'16px',
            // margin: haspeers
            //     ?'16px 0'
            //     :'inherit',
        }

        let frameStyle:React.CSSProperties = {
            border: this.collapseTargetProxy
                ?'1px solid blue'
                :'1px solid silver',
            width: haspeers
                ?'none'
                :(this.props.boxwidth) + 'px',
            margin: haspeers
                ?'0'
                :'auto',
        }

        // placeholder for display if item hasn't been received yet
        if (!item) {
            return <div className = {classes.wrapper} style = {wrapperStyle}>
                <div className = {classes.frame} style = {frameStyle}>
                    <CircularProgress size = {24}/>
                </div>
            </div>
        }
        
        return  (
        <div 
            data-index = { this.props.index } 
            className = { classes.wrapper } 
            style = { wrapperStyle }
        >
            <div className = { classes.frame } style = {frameStyle}
                ref = { this.boxframe }
            >
                {/* side decorations */}
                <NavigationMenuTab 
                    itemType = { itemType /*future*/}
                    listProxy = {this.state.TypelistProxy}
                    haspeers = {haspeers}
                    liststack = {listStack}

                    callbacks = {this.typecallbacks}
                    collapseDirectoryItem = {this.collapseDirectoryItem}
                />

                { !haspeers && <ResizeTab 
                    boxwidth = {this.props.boxwidth} 
                    boxframe = {this.boxframe}
                    setBoxWidth = { this.props.callbacks.setBoxWidth }
                /> }
                {/* main content */}
                <div data-name = 'box-contents-wrapper'
                    className = {classes.boxcontentswrapper}>

                    {false && <BoxTypebar /* suspended */
                        item = { item } 
                        itemType = { itemType /*future*/}
                        listProxy = {this.state.TypelistProxy}
                        haspeers = {haspeers}

                        callbacks = {this.typecallbacks}
                    />}

                    {!listStack.length && <BoxIdentityBar 
                        itemProxy = {this.identityItemProxy}
                        setItemListener = {this.props.callbacks.setItemListener}
                        removeItemListener = {this.props.callbacks.removeItemListener}
                        callDataDrawer = { this.props.callbacks.callDataDrawer }
                    />}

                    <div className = {classes.directoryBlock} >

                        <DirectoryBar 
                            haspeers = {haspeers}
                            listProxy = {this.state.BarlistProxy}
                            setListListener = {this.props.callbacks.setListListener}
                            removeListListener = {this.props.callbacks.removeListListener}
                            callDataDrawer = {this.props.callbacks.callDataDrawer}

                            listStack = {listStack}
                        />
                        {/* flex wrapper */}
                        <div className = {classes.directorylistwrapper}>
                            {/* wrapped directory list */}
                            <DirectoryList 
                                ref = {this.listcomponent}

                                listProxy = {this.state.MainlistProxy}
                                highlightrefuid = {this.state.highlightrefuid}

                                callbacks = {this.listcallbacks}
                            />

                        </div>
                    </div>
                    { this.indexmarker(classes) }
                    <div className = {classes.buttonwrapper}>
                        <FloatingAddButton 
                            onClick = {() => {
                                this.onClickAdd(this.state.MainlistProxy)
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
        )
    }
}

export default withStyles(styles)(DataBox)

