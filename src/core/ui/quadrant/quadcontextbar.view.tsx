// quadtitlebar.view.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later
'use strict'

import React from 'react'

import { withStyles, createStyles } from '@material-ui/core/styles'
import Icon from '@material-ui/core/Icon'

import BoxIdentityBar from '../databox/identitybar.view'
import DirectoryBar from '../databox/directorybar.view'
import RootDirectoryBarHolder from '../databox/rootdirectorybarholder.view'

import docproxy from '../../utilities/docproxy'

const styles = createStyles({
    root:{
        position:'relative',
        height:'38px',
        backgroundColor:'white',
        boxSizing:'border-box',
        width:'100%',
        borderRadius:'5px 5px 0 0',
        borderBottom:'1px solid silver',
        overflow:'hidden',
        fontSize:'smaller',
    },
    aliasbox:{
        position:'absolute',
        top:'0',
        left:'0',
        zIndex:3,
        backgroundColor:'white',
        border:'1px solid gray',
        boxSizing:'border-box',
        height:'24px',
        width:'24px',
        fontSize:'20px',
        textAlign:'center',
        fontWeight:'bold',
        color:'gray',
    },
    titlebox:{
        position:'absolute',
        top:'0',
        width:'calc(100% - 35px)',
        height:'42px',
        overflow:'auto',
        boxSizing:'border-box',
        padding: '3px 0 0 30px',
    },
    titlewrap:{
        display:'flex',
        flexFlow:'row nowrap',
        alignItems: 'center',
    },
})

class QuadContextBar extends React.Component<any> {

    state = {
        context:null
    }

    datastack = null
    stackpointer = null

    componentDidUpdate(prevProps) {

        // console.log('context componentDidUpdate',this.stackpointer)

        if (

                (this.stackpointer === null) || 
                (prevProps.datastack === null && this.datastack !== null) ||
                (this.datastack === null && prevProps.datastack !== null) ||
                (prevProps.stackpointer !== this.props.stackpointer) ||
                ((prevProps.datastack && this.datastack) && (prevProps.datastack.length != this.datastack.length)) ||
                !this.props.userdata

            ) {

            if (this.props.userdata) {

                this.stackpointer = this.props.stackpointer
                this.datastack = this.props.datastack

            } else {

                this.stackpointer = null
                this.datastack = null
                
            }

            this.createcontext()

        }

    }

    createcontext = () => {
        let userdata = this.props.userdata
        // console.log('create context userdata',userdata)

        if ( (!this.datastack || (this.datastack.length <= 1)) || !this.stackpointer || !userdata) { // no context
            if (this.state.context) {
                this.setState({
                    context:null
                })
            }
            return
        }
        const { datastack, stackpointer } = this
        let { classes } = this.props
        let context = []
        for (let n = 1;n < datastack.length;n++) {
            let stacklayer = datastack[n]
            if (stacklayer.source.action == 'select') { // ignore; no change in context
                continue
            }

            let itemProxy = stacklayer.source.itemProxy
            if (itemProxy.liststack.length) {// make list entry

                let listtoken = itemProxy.listStack[itemProxy.liststack.length - 1]
                let listProxy = new docproxy(listtoken)
                let component = <DirectoryBar 
                    key = {n + 'list'}
                    haspeers = {false}
                    listProxy = {listProxy}
                    setDocpackPairListener = {this.props.callbacks.setDocpackPairListener}
                    removeDocpackPairListener = {this.props.callbacks.removeDocpackPairListener}
                    callDataDrawer = {this.props.callDataDrawer}

                    listStack = {itemProxy.liststack}
                    collapseDirectoryItem = {() => {}} 
                    contextitem
                />
                context.push(<Icon key = {n + 'icon'} style = {{opacity:.54}}>chevron_right</Icon>)
                context.push(component)


            } else { // make item entry and root list entry
                let { itemProxy } = stacklayer.source
                let newItemProxy = new docproxy(
                    {
                        doctoken:itemProxy.doctoken,
                        liststack:itemProxy.liststack.slice(),
                    }
                )
                context.push(<BoxIdentityBar 
                    key = {n + 'item'}
                    itemProxy = {newItemProxy}
                    setDocpackPairListener = {this.props.callbacks.setDocpackPairListener}
                    removeDocpackPairListener = {this.props.callbacks.removeDocpackPairListener}
                    callDataDrawer = { this.props.callDataDrawer }
                    contextitem
                />)

                let holderItemProxy = new docproxy(
                    {
                        doctoken:itemProxy.doctoken,
                        liststack:itemProxy.liststack.slice(),
                    }
                )

                let component = <RootDirectoryBarHolder 
                    key = {n + 'list'}
                    itemProxy = {holderItemProxy}
                    setDocpackPairListener = {this.props.callbacks.setDocpackPairListener}
                    removeDocpackPairListener = {this.props.callbacks.removeDocpackPairListener}
                    callDataDrawer = {this.props.callDataDrawer}
                />
                context.push(<Icon key = {n + 'icon'}  style = {{opacity:.54}}>chevron_right</Icon>)
                context.push(component)

            }
        }
        if (context.length) {
            context.push(<Icon key = {'iconend'} style = {{opacity:.54}}>arrow_drop_down</Icon>)
            this.setState({
                context,
            })
        } else {
            if (this.state.context) { // defensive
                this.setState({
                    context:null,
                })
            }
        }
    }

    render() {

    let { quadidentifier:alias, classes, datastack, stackpointer } = this.props
    // console.log('datastack, stackpointer', datastack, stackpointer)
    return (
        <div className = { classes.root } >
            <div className = { classes.aliasbox } >
                {alias} 
            </div>
            <div className = { classes.titlebox }>
                <div className = { classes.titlewrap }>
                    {this.state.context}
                </div>
            </div>
        </div>
    )

    }
}

export default withStyles(styles)(QuadContextBar)
