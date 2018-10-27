// directoryitem.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence

'use strict'

import React from 'react'

import Icon from '@material-ui/core/Icon'
import CircularProgress from '@material-ui/core/CircularProgress'
import { withStyles, createStyles } from '@material-ui/core/styles'

import ActionButton from '../common/actionbutton.view'

import QuantityBadge from '../common/quantitybadge.view'
import LoadingMessage from '../common/loadingmessage.view'

const styles = createStyles({
    barstyle: {
        padding:'3px',
        boxSizing:'border-box',
        cursor:'pointer',
        position:'relative',
        borderBottom:'1px solid #e2e6e9',
    },

    rowstyle:{
        position:'relative',
        paddingRight:'3px',
        display:'flex',
        flexFlow:'row nowrap',
        alignItems:'center',
    },

    namestyle:{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        paddingLeft:'3px',
        whiteSpace:'nowrap',
        flex:1,
    },
    countstyle:{
        fontSize:'smaller',
        color:'silver',
    },
    progress: {
        // height:'25px',
    },
})

class DirectoryItem extends React.Component<any,any> {

    constructor(props) {
        super(props)
        this.barelementref = React.createRef()
    }

    state = {
        list:null,
    }

    listProxy

    barelementref

    componentDidMount() {

        if ((!this.listProxy) && this.props.listProxy) {
            this.listProxy = this.props.listProxy
            this.props.setDocumentListener(
                this.listProxy.token,this.listProxy.instanceid,this.cacheListDocument)
        }

    }

    componentDidUpdate() {

        if (this.props.highlight && this.barelementref) {
            this.props.highlightItem(this.barelementref)
        }
    }

    componentWillUnmount() {
        if (this.listProxy) {
            this.props.removeDocumentListener(
                this.listProxy.token,this.listProxy.instanceid)
        }        
    }

    cacheListDocument = (document, type, change) => {

        this.setState({
            list:{
                document,
                type
            }
        })
    }


    expandDirectoryItem = () => {
        this.props.expandDirectoryItem(this.barelementref.current)
    }

    render() {

        let { classes } = this.props
        let listDocument = this.state.list?this.state.list.document:null
        let quantity = listDocument?(listDocument.counts.lists + listDocument.counts.links):0
        return <div 
            className = {
                classes.barstyle
            }
            onClick = {this.expandDirectoryItem}
            ref = {this.barelementref}
        >
            {listDocument
                ?<div 
                        className = {classes.rowstyle}
                    > 
                        {quantity?<ActionButton 
                            buttonStyle = {
                                {
                                    float:'none',
                                    width:'24px',
                                    height:'24px',
                                }
                            } 
                            icon = 'arrow_right' 
                            action = {(e)=>{
                                e.stopPropagation()
                            }}
                        />:<div style = {
                            {
                                display:'inline-block',
                                width:'24px',
                                height:'24px',
                            }
                        }></div>}
                        <Icon 
                            style = {
                                {
                                    color:listDocument?listDocument.system.attributes.sysnode?'green':'gray':'gray',
                                }
                            } 
                        >
                            folder
                        </Icon> 

                        <div className = {classes.namestyle}>
                            <span>{listDocument.properties.name}</span>  <span 
                                className = {classes.countstyle}>{listDocument.counts.lists + 
                                    listDocument.counts.links}</span>
                        </div>

                    </div>

                :<div className = {classes.progress}> 
                    <LoadingMessage />
                </div>
            }
        </div>
    }
}

export default withStyles(styles)(DirectoryItem)
