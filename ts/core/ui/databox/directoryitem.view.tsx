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
        }

    tabwrapperstyle:React.CSSProperties = {
        borderBottom:'1px solid #e2e6e9',
        position:'relative',
        height:'24px',
    }

    pretabstyle:React.CSSProperties = {
        display:'inline-block',
        height:'24px',
        width:'5px',
        verticalAlign:'middle',
    }

    tabstyle:React.CSSProperties = {
        display:'inline-block',
        position:'relative',
        verticalAlign:'middle',
        borderWidth:'1px',
        borderRadius:'6px 6px 0 0',
        borderColor:'#e2e6e9',
        borderBottomColor:'white',
        borderStyle:'solid',
        paddingRight:'3px',
        marginLeft:'-1px',
        marginBottom:'-1px',
        backgroundColor:'white',
        cursor:'pointer',
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
    }

    cacheListDocument = (data,type) => {

        this.setState({
            list:{
                data,
                type
            }
        })
    }


    expandDirectoryItem = () => {
        this.props.expandDirectoryItem(this.barelementref.current)
    }

    barcomponent = () => {
        let listDocument = this.state.list?this.state.list.data:null
        return <div 
            style = {
                this.barstyle
            }
            ref = {this.barelementref}
        >
            {listDocument?<div style = {this.tabwrapperstyle}>
                <div style = {this.pretabstyle}></div>
                <div 
                    style = {this.tabstyle}
                    onClick = {this.expandDirectoryItem}
                > 
                    <Icon 
                        style = {
                            {
                                verticalAlign:'middle',
                                color:listDocument?listDocument.properties.sysnode?'green':'gray':'gray',
                            }
                        } 
                    >
                        folder
                    </Icon> 
                    {listDocument?listDocument.properties.name:null}
                    <QuantityBadge quantity = {listDocument?listDocument.properties.numbers.list.count:0} style = {
                        {
                            left:'-10px',
                            top:'-5px',
                        }
                    }/>
                </div>
            </div>:<div style = {{height:'25px',width:'286px'}}> 
                <CircularProgress size = {16} />
            </div>}
        </div>
    }

    render() {

        return this.barcomponent()

    }
}

export default DirectoryItem