// directorylist.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence

'use strict'

import React from 'react'

import Lister from 'react-list'

import CircularProgress from '@material-ui/core/CircularProgress'

import { withStyles, createStyles } from '@material-ui/core/styles'
import DirectoryItem from './directoryitem.view'
import proxy from '../../utilities/proxy'

const styles = createStyles({
    scrollbox:{            
        overflow:'auto',
        position:'relative', // required for offsetParent of highlightItem search
        // paddingBottom:'32px', // leave room for add button
        WebkitOverflowScrolling:'touch', // attempt to achieve scrolling on ios
        width:'100%',
        boxSizing:'border-box',
        height:'100%',
    }
})

const DirectoryListBase = withStyles(styles)( 
class extends React.Component<any,any> {

    constructor(props) {
        super(props)
        this.listcomponent = this.props.forwardedRef
    }

    state = {
        highlightrefuid:null,
        list:null,
        listproxies:null,
    }

    listProxy = null
    pathToIndexMap = null

    highlightrefuid = null

    listcomponent

    componentDidUpdate() {

        if (!this.listProxy && this.props.listProxy) {
            this.listProxy = this.props.listProxy
            this.props.callbacks.setDocumentListener(
                this.listProxy.token,this.listProxy.instanceid,this.cacheListDocument)
        }

        if (this.props.highlightrefuid) {
            this.highlightrefuid = this.props.highlightrefuid
        }

        if (this.state.listproxies) {

            setTimeout(()=>{
                this.dohighlight()
            })

        }
    }

    componentWillUnmount() {
        if (this.listProxy) {
            this.props.callbacks.removeDocumentListener(
                this.listProxy.token,this.listProxy.instanceid)
        }        
    }

    cacheListDocument = (document,type) => {

        let listproxies
        if (!this.state.listproxies) {
            listproxies = this.generateListProxies(document)
        } else {
            listproxies = this.updateListProxies(document,this.state.listproxies)
        }
        this.pathToIndexMap = this.generatePathToIndexMap(listproxies)
        this.setState({
            list:{
                document,
                type
            },
            listproxies,
        })
    }

    generateListProxies = (listDocument) => {
        let listtokens = listDocument.data.lists
        let listproxies = listtokens.map((token) => {
            return new proxy({token})
        })
        return listproxies
    }

    updateListProxies = (listDocument, oldListProxies) => {
        // console.log('updating listproxies')
        let pathMap = this.pathToIndexMap
        let listtokens = listDocument.data.lists
        let listproxies = listtokens.map((token) => {
            let reference = `${token.collection}/${token.uid}`
            let proxy = oldListProxies[pathMap[reference]]
            if (!proxy) {
                // console.log('generating new proxy')
                proxy = new proxy({token})
            }
            return proxy
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
        let { listproxies } = this.state
        // keep; value will be purged
        let highlightrefuid = this.highlightrefuid
        this.highlightrefuid = null
        // get index for Lister
        let index = listproxies.findIndex(this.findlinkIndex(highlightrefuid))
        // update scroll display with selected highlight item
        this.listcomponent.current.scrollAround(index)

        setTimeout(() => { // let scroll update finish
            // animate highlight
            this.setState({
                highlightrefuid,
            },() => {
                this.setState({
                    highlightrefuid:null
                })
            })

        },300)
    }

    findlinkIndex = (uid) => {

        return (item) => {
            return item.uid == uid
        }

    }

    expandDirectoryItem = (token) => {
        return (domSource) => {
            this.props.callbacks.expandDirectoryItem(token, domSource)
        }
    }

    itemRenderer = (index,key) => {
        let proxy = this.state.listproxies[index]
        return this.getListComponent(proxy,key,index)
    }

    getListComponent = (proxy, key, index) => {

        let highlight = (proxy.uid === this.state.highlightrefuid)
        let directoryitem = 
            <DirectoryItem 
                key = {proxy.instanceid} 
                listProxy = {proxy} 
                setDocumentListener = {this.props.callbacks.setDocumentListener}
                removeDocumentListener = {this.props.callbacks.removeDocumentListener}
                expandDirectoryItem = {this.expandDirectoryItem(proxy.token)}
                highlight = {highlight}
                highlightItem = {this.props.callbacks.highlightItem}
            />

        return directoryitem

    }

    render() {

        let { classes } = this.props

        let length = this.state.listproxies?this.state.listproxies.length:0

        return (
        <div style = {{position:'relative', height:'100%', width:'100%',}}>
            <div
                className = {classes.scrollbox} 
            >
                {this.state.listproxies?<Lister 
                    ref = {this.props.forwardedRef}
                    itemRenderer = {this.itemRenderer}
                    length = {length}
                    type = 'uniform'
                    useStaticSize
                />:<CircularProgress size = {24} />}
            </div>
        </div>
        )
    }
})

const DirectoryList = React.forwardRef((props:any,ref:any) => {
    return <DirectoryListBase {...props} forwardedRef = {ref} />
})

export default DirectoryList