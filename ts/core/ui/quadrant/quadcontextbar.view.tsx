// quadtitlebar.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import React from 'react'

import { withStyles, createStyles } from '@material-ui/core/styles'

import BoxIdentityBar from '../databox/identitybar.view'
import DirectoryBar from '../databox/directorybar.view'

import proxy from '../../utilities/proxy'

const styles = createStyles({
    root:{
        position:'relative',
        height:'33px',
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
        width:'100%',
        height:'42px',
        overflow:'auto',
        display:'flex',
        flexWrap:'nowrap',
        boxSizing:'border-box',
        padding: '3px 0 0 30px',
    },
    titlewrap:{
        whiteSpace:'nowrap',
    },

})

class QuadContextBar extends React.Component<any> {

    state = {
        context:null
    }

    datastack = null
    stackpointer = null

    componentDidUpdate(prevProps) {

        if ((this.stackpointer === null) || 
            (prevProps.stackpointer != this.props.stackpointer) ||
            (prevProps.datastack.length != this.datastack.length)
            ) {
            this.stackpointer = this.props.stackpointer
            this.datastack = this.props.datastack
            this.createcontext()
        }

    }

    createcontext = () => {
        console.log('create context',this.datastack, this.stackpointer)
        if ( this.datastack.length <= 1 || !this.stackpointer ) { // no context
            if (this.state.context) {
                this.setState({
                    context:null
                })
            }
            return
        }
        const { datastack, stackpointer } = this
        let context = []
        for (let n = 1;n < datastack.length;n++) {
            let stacklayer = datastack[n]
            if (stacklayer.source.action == 'select') { // ignore; no change in context
                continue
            }

            let itemProxy = stacklayer.source.itemProxy
            if (itemProxy.liststack.length) {// make list entry


            } else { // make item entry and root list entry
                let { itemProxy } = stacklayer.source
                let newItemProxy = new proxy(
                    {
                        token:itemProxy.token,
                        liststack:itemProxy.liststack.slice(),
                    }
                )

                context.push(<BoxIdentityBar 
                    key = {n + 'item'}
                    itemProxy = {newItemProxy}
                    setItemListener = {this.props.callbacks.setItemListener}
                    removeItemListener = {this.props.callbacks.removeItemListener}
                    callDataDrawer = { (opcode ) => {
                            this.props.callbacks.callDataDrawer(newItemProxy,opcode)
                    }}
                />)

            }
        }
        if (context.length) {
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
