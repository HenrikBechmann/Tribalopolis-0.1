// directorylist.view.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList as List } from 'react-window'

import { withStyles, createStyles } from '@material-ui/core/styles'
import DirectoryListItem from './directorylistitem.view'
import docproxy from '../../utilities/docproxy'
import LoadingMessage from '../common/loadingmessage.view'
import { DocTokenStruc, SetListenerMessage, RemoveListenerMessage, ReturnDocPairMessage } from '../../services/interfaces'

const styles = createStyles({
    scrollboxcontainer:{
        position:'relative', 
        flex: '1 1 0',
        width:'100%',
        overflow:'hidden',
        display:'flex',
        flexFlow:'column'
    },
    scrollbox:{
        flex: '1 1 0',
        // height:'100%',
        overflow:'auto',
        position:'relative', // required for offsetParent of highlightItem search
        // paddingBottom:'32px', // leave room for add button
        // WebkitOverflowScrolling:'touch', // attempt to achieve scrolling on ios
        width:'100%',
        boxSizing:'border-box',
        // height:'100%',
    },
})

const DirectoryListBase = withStyles(styles)( 
class extends React.Component<any,any> {

    constructor(props) {
        super(props)
        this.listcomponent = this.props.forwardedRef
        if (this.props.highlightrefuid) {
            this.highlightrefuid = this.props.highlightrefuid
        }
    }

    state = {
        list:null,
        listproxies:null,
    }

    listProxy = null
    pathToIndexMap = null

    highlightrefuid = null

    listcomponent

    isunmounting = false

    componentDidUpdate() {

        if (!this.listProxy && this.props.listProxy) {
            this.listProxy = this.props.listProxy
            let parms:SetListenerMessage = 
                {
                    doctoken:this.listProxy.doctoken,
                    instanceid:this.listProxy.instanceid,
                    success:this.cacheListDocument,
                    failure:null,
                }
            this.props.callbacks.setDocpackPairListener( parms )
        }

        if (this.state.listproxies) {

            setTimeout(()=>{
                this.dohighlight()
            },300)

        }
    }

    componentWillUnmount() {
        this.isunmounting = true
        if (this.listProxy) {
            let parms:RemoveListenerMessage = 
                {
                    doctoken:this.listProxy.doctoken,
                    instanceid:this.listProxy.instanceid,
                    // success:null,
                    // failure:null,
                }
            this.props.callbacks.removeDocpackPairListener( parms )
        }        
    }

    cacheListDocument = ({docpack, typepack, reason}:ReturnDocPairMessage) => {

        let listproxies
        if (!this.state.listproxies) {
            listproxies = this.generateListProxies(docpack.document)
        } else {
            listproxies = this.updateListProxies(docpack.document,this.state.listproxies)
        }
        this.pathToIndexMap = this.generatePathToIndexMap(listproxies)
        if (this.isunmounting) return
        this.setState({
            list:{
                docpack,
                typepack,
            },
            listproxies,
        })
    }

    generateListProxies = (listDocument) => {
        let listtokens = listDocument.data.lists
        let listproxies = listtokens.map((doctoken) => {
            return new docproxy({doctoken})
        })
        return listproxies
    }

    updateListProxies = (listDocument, oldListProxies) => {
        // console.log('updating listproxies')
        let pathMap = this.pathToIndexMap
        let listtokens = listDocument.data.lists
        let listproxies = listtokens.map((doctoken) => {
            let reference = doctoken.reference // `/${doctoken.collection}/${doctoken.id}`
            let docproxy = oldListProxies[pathMap[reference]]
            if (!docproxy) {
                // console.log('generating new docproxy')
                docproxy = new docproxy({doctoken})
            }
            return docproxy
        })
        // console.log('updated list proxies',listproxies)
        return listproxies
    }

    generatePathToIndexMap = (listProxies) => {
        let pathMap = {}
        for (let index = 0; index < listProxies.length; index++) {
            pathMap[listProxies[index].reference] = index
        }
        return pathMap
    }

    dohighlight = () => {
        if ((!this.highlightrefuid) || (!this.state.listproxies.length))  return

        // console.log('highlightrefuid in dohighlight of directory list',this.highlightrefuid)
        let { listproxies } = this.state
        // keep; value will be purged
        // let highlightrefuid = this.highlightrefuid
        // this.highlightrefuid = null
        // get index for Lister
        let index = listproxies.findIndex(this.findlinkIndex(this.highlightrefuid))
        // update scroll display with selected highlight item
        // this.listcomponent.current.scrollAround(index)
        this.listcomponent.current.scrollToItem(index)
        // console.log('index',index)
        // setTimeout(() => { // let scroll update finish
        //     // animate highlight
        //     console.log('setting list state to ',highlightrefuid)
        //     this.setState({
        //         highlightrefuid,
        //     },() => {
        //         console.log('setting list state to NULL')
        //         this.setState({
        //             highlightrefuid:null
        //         })
        //     })

        // },500)

    }

    findlinkIndex = (id) => {

        return (item) => {
            return item.id == id
        }

    }

    expandDirectoryItem = (doctoken:DocTokenStruc) => {
        return (domSource) => {
            this.props.callbacks.expandDirectoryItem(doctoken, domSource)
        }
    }

    ListComponent = ({index,style}) => {
        let docproxy = this.state.listproxies[index]
        return <div style = {style}>{this.getListComponent(docproxy,index)}</div>
    }

    getListComponent = (docproxy, index) => {

        // let highlight = (docproxy.id === this.state.highlightrefuid)


        let highlight = (docproxy.id === this.highlightrefuid)

        // console.log('getListComponent in directoryList: highlight, highlightrefuid, docproxy, index',highlight,this.highlightrefuid,docproxy,index)

        if (highlight) this.highlightrefuid = null

        let directorylistitem = 
            <DirectoryListItem 
                key = {docproxy.instanceid} 
                listProxy = {docproxy} 
                setDocpackPairListener = {this.props.callbacks.setDocpackPairListener}
                removeDocpackPairListener = {this.props.callbacks.removeDocpackPairListener}
                expandDirectoryItem = {this.expandDirectoryItem(docproxy.doctoken)}
                highlight = {highlight}
                highlightItem = {this.props.callbacks.highlightItem}
            />

        return directorylistitem

    }

    render() {

        let { classes } = this.props

        let length = this.state.listproxies?this.state.listproxies.length:0

        return (
        <div className = {classes.scrollboxcontainer}>
            <div
                className = {classes.scrollbox} 
            >
                <AutoSizer>{
                    ({height, width}) => (this.state.listproxies?(
                        <List 
                        ref = {this.props.forwardedRef}
                        height = {height}
                        width = {width}
                        itemSize = {31}
                        itemCount = {length}
                    >
                        {this.ListComponent}
                    </List>
                    )
                    :<div style = {{height:'31px'}}>
                        <LoadingMessage />
                    </div>)
                }
                </AutoSizer>
            </div>
        </div>
        )
    }
})

const DirectoryList = React.forwardRef((props:any,ref:any) => {
    return <DirectoryListBase {...props} forwardedRef = {ref} />
})

export default DirectoryList