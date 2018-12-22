// databox.view.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later
'use strict'

import React from 'react'

import { withStyles, createStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'

import BoxIdentityBar from './databox/identitybar.view'
// import BoxTypebar from './databox/typebar.view'

import DirectoryBar from './databox/directorybar.view'
import DirectoryList from './databox/directorylist.view'
// import ScanBar from './databox/scanbar.view'

import ResizeTab from './databox/resizetab.view'
import NavigationMenuTab from './databox/navigationmenutab.view'
import LoadingMessage from './common/loadingmessage.view'

import docproxy from '../utilities/docproxy'

import { SetListenerMessage, RemoveListenerMessage, ReturnDocPairMessage } from '../services/interfaces'

const buttonstyles = theme => createStyles({
  button: {
    marginRight: theme.spacing.unit
  },
})

const FloatingAddButton = withStyles(buttonstyles)((props:any) => {
    let { classes, onClick } = props
    return <Fab 
        size = 'small'
        color = 'secondary' 
        aria-label = 'Add' 
        className = {classes.button} 
        onClick = {onClick}
    >
      <AddIcon />
    </Fab>
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
        overflow:'hidden',
    },
    directoryBlock:{
        display:'flex',
        flexFlow:'column',
        position:'relative',
        flex:'1',
        minHeight:'0',
        overflow:'hidden', // for FF to allow scroll
    },
    directorylistwrapper:{
        flex:'1 1 0',
        display:'flex',
        flexFlow:'column',
    },

})

class DataBox extends React.Component<any,any> {

    constructor(props) {
        super(props)
        this.boxframe = React.createRef()
        this.listcomponent = React.createRef()
        this.itemProxy = this.props.itemProxy
        this.identityItemProxy = new docproxy(
            {
                doctoken:this.itemProxy.doctoken,
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
        let parms:SetListenerMessage = {
            doctoken:itemProxy.doctoken, 
            instanceid:itemProxy.instanceid,
            success:this.cacheItemData,failure:null
        }
        this.props.callbacks.setDocpackPairListener(parms)
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
        let parms:RemoveListenerMessage = {
            doctoken:itemProxy.doctoken, 
            instanceid:itemProxy.instanceid,
            // success:null,
            // failure:null,
        }

        this.props.callbacks.removeDocpackPairListener( parms )

    }

    cacheItemData = ( {docpack, typepack, reason}:ReturnDocPairMessage) => {

        this.setState({
            item:{
                docpack,
                typepack,
            }
        },() => { // set matching list proxies for children

            if (!this.state.MainlistProxy) { // no proxies have been set

                let listdoctoken
                if (this.itemProxy.liststack.length) {
                    listdoctoken = this.itemProxy.liststack[this.itemProxy.liststack.length -1]
                } else {
                    listdoctoken = {
                        reference:'/lists/' + this.state.item.docpack.document.references.list,
                    }
                }
                this.setState({
                    MainlistProxy: new docproxy({doctoken:listdoctoken}),
                    BarlistProxy: new docproxy({doctoken:listdoctoken}),
                    TypelistProxy: new docproxy({doctoken:listdoctoken}),
                })

            }
        })

    }

    doHighlights = (collapseTargetProxy) => {

        this.props.callbacks.highlightBox({boxElement:this.boxframe.current})

        if (collapseTargetProxy.action == 'expand' || 
            collapseTargetProxy.action == 'splay') {

            let doctoken = 
                collapseTargetProxy.liststack[
                    collapseTargetProxy.liststack.length -1]

            if (doctoken) {
                let splitref = doctoken.reference.split('/')
                let id = splitref[splitref.length - 1]
                setTimeout(()=>{
                    this.setState({
                        highlightrefuid:id,
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

    onClickAdd = (docproxy) => {
        this.props.callbacks.callDataDrawer(docproxy, 'add')
        // console.log('docproxy',docproxy)
    }

    listcallbacks = {
        setDocpackPairListener:this.props.callbacks.setDocpackPairListener,
        removeDocpackPairListener:this.props.callbacks.removeDocpackPairListener,
        expandDirectoryItem:this.props.callbacks.expandDirectoryItem,
        highlightItem:this.highlightItem,
    }

    typecallbacks = {
        setDocpackPairListener:this.props.callbacks.setDocpackPairListener,
        removeDocpackPairListener:this.props.callbacks.removeDocpackPairListener,
        splayBox:this.splayBox,
        selectFromSplay:this.props.callbacks.selectFromSplay,
    }

    render() {

        let { haspeers, classes, containerHeight } = this.props

        let docpack = this.state.item?this.state.item.docpack:null
        let typepack = this.state.item?this.state.item.typepack:null

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
            padding: haspeers
                ?'16px 40px 16px 16px'
                :'16px',
        }

        let frameStyle:React.CSSProperties = {
            border: this.collapseTargetProxy
                ?'1px solid blue'
                :'1px solid silver',
            width:(this.props.boxwidth) + 'px',
            margin: haspeers
                ?'0'
                :'auto',
        }

        // placeholder for display if docpack hasn't been received yet
        if (!docpack) {
            return <div className = {classes.wrapper} style = {wrapperStyle}>
                <div className = {classes.frame} style = {frameStyle}>
                    <LoadingMessage />
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

                    {!listStack.length && <BoxIdentityBar 
                        itemProxy = {this.identityItemProxy}
                        setDocpackPairListener = {this.props.callbacks.setDocpackPairListener}
                        removeDocpackPairListener = {this.props.callbacks.removeDocpackPairListener}
                        callDataDrawer = { this.props.callbacks.callDataDrawer }
                    />}

                    <div className = {classes.directoryBlock} >

                        <DirectoryBar 
                            haspeers = {haspeers}
                            listProxy = {this.state.BarlistProxy}
                            setDocpackPairListener = {this.props.callbacks.setDocpackPairListener}
                            removeDocpackPairListener = {this.props.callbacks.removeDocpackPairListener}
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


// {false && <BoxTypebar /* suspended */
//     docpack = { docpack } 
//     typepack = { typepack /*future*/}
//     listProxy = {this.state.TypelistProxy}
//     haspeers = {haspeers}

//     callbacks = {this.typecallbacks}
// />}

export default withStyles(styles)(DataBox)

