// directoryitem.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence

'use strict'

import React from 'react'

import Icon from '@material-ui/core/Icon'
import CircularProgress from '@material-ui/core/CircularProgress'

import QuantityBadge from '../common/quantitybadge.view'

class DirectoryItem extends React.Component<any,any> {

    constructor(props) {
        super(props)
        this.barelementref = React.createRef()
    }

    state = {
        list:null,
    }

    listProxy

    barstyle = 
        {
            padding:'3px',
            height:'25px',
            cursor:'pointer',
        }

    rowwrapperstyle:React.CSSProperties = {
        borderBottom:'1px solid #e2e6e9',
        position:'relative',
        height:'24px',
    }

    rowstyle:React.CSSProperties = {
        display:'inline-block',
        position:'relative',
        verticalAlign:'middle',
        paddingRight:'3px',
        marginLeft:'-1px',
        marginBottom:'-1px',
        // backgroundColor:'white',
        maxWidth:'90%',
        whiteSpace:'nowrap',
    }

    barelementref

    componentDidMount() {

        if ((!this.listProxy) && this.props.listProxy) {
            this.listProxy = this.props.listProxy
            this.props.setListListener(
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
            this.props.removeListListener(
                this.listProxy.token,this.listProxy.instanceid)
        }        
    }

    cacheListDocument = (document,type) => {

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

    barcomponent = () => {
        let listDocument = this.state.list?this.state.list.document:null
        return <div 
            style = {
                this.barstyle
            }
            onClick = {this.expandDirectoryItem}
            ref = {this.barelementref}
        >
            {listDocument
                ?<div style = {this.rowwrapperstyle}>

                    <div 
                        style = {this.rowstyle}
                    > 
                        <Icon 
                            style = {
                                {
                                    verticalAlign:'middle',
                                    color:listDocument?listDocument.system.attributes.sysnode?'green':'gray':'gray',
                                }
                            } 
                        >
                            folder
                        </Icon> 

                        <div style = {{
                            display:'inline-block',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            maxWidth: '92%',
                            textOverflow: 'ellipsis',
                            verticalAlign: 'middle',
                        }}>
                            {listDocument && listDocument.properties.name}
                        </div>

                        <QuantityBadge 
                            quantity = {listDocument?(listDocument.counts.lists + listDocument.counts.links):0} 
                            style = {
                            {
                                left:'-10px',
                                top:'-5px',
                            }}
                        />

                    </div>

                </div>

                :<div style = {{height:'25px'}}> 
                    <CircularProgress size = {16} />
                </div>
            }
        </div>
    }

    render() {

        return this.barcomponent()

    }
}

export default DirectoryItem