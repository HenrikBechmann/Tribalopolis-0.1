// directorybar.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import React from 'react'

import Icon from '@material-ui/core/Icon'
import CircularProgress from '@material-ui/core/CircularProgress'

import QuantityBadge from '../common/quantitybadge.view'
import ActionButton from '../common/actionbutton.view'
import InfoOutlined from '@material-ui/icons/InfoOutlined'

class DirectoryBar extends React.Component<any,any> {

    state = {
        list:null
    }

    cacheListDocument = (document,type) => {
        this.setState({
            list:{
                document,
                type
            }
        })
    }

    listProxy

    barstyle:React.CSSProperties = {
        width:'100%',
        borderRadius:'8px 8px 0 0',
        paddingTop:'3px',
        whiteSpace:'nowrap',
        overflow:'hidden',
        boxSizing:'border-box',
        marginBottom: '1px',
        top:'0',
        backgroundColor:'#f2f2f2',
        zIndex:1,
    }

    tabwrapperstyle:React.CSSProperties = {
        borderBottom:'1px solid silver',
        position:'relative',
        height:'32px',
    }

    pretabstyle:React.CSSProperties = {
        display:'inline-block',
        height:'32px',
        width:'5px',
        verticalAlign:'middle',
    }

    tabstyle:React.CSSProperties = {
        display:'inline-block',
        position:'relative',
        verticalAlign:'middle',
        borderWidth:'1px',
        borderRadius:'6px 6px 0 0',
        borderColor:'transparent',
        borderStyle:'solid',
        paddingRight:'3px',
        marginLeft:'-1px',
        marginBottom:'-7px',
        // backgroundColor:'white',
        maxWidth:'calc(100% - 80px)',
        // cursor:'pointer',
    }

    componentDidUpdate() {
        if (!this.listProxy && this.props.listProxy) {
            this.listProxy = this.props.listProxy
            this.props.setListListener(
                this.listProxy.token,this.listProxy.instanceid,this.cacheListDocument)
        }        
    } 

    componentWillUnmount() {
        if (this.listProxy) {
            this.props.removeListListener(
                this.listProxy.token,this.listProxy.instanceid)
        }        
    }

    render() {

        let { listStack } = this.props
        let listDocument = this.state.list?this.state.list.document:null

        return <div>
            <div 
                style = {this.barstyle}
            >
                {listDocument?(<div style = {this.tabwrapperstyle}>
                    {false && <ActionButton 
                        component = {<InfoOutlined  />}
                    />}
                    {false && <ActionButton 
                        img = '/public/icons/org_chart.svg'
                    />}
                    <ActionButton icon = 'more_vert' />
                    {false?<ActionButton icon = 'info'/>:null}
                    {listStack.length?
                        <div style = {{float:'right',width:'32px',height:'32px', position:'relative'}}>
                            <QuantityBadge 
                                quantity = {listStack.length} 
                                style = {{left:'-6px',top:'-6px'}}
                            />
                            <ActionButton 
                                icon = 'arrow_back'
                                action = {this.props.collapseDirectoryItem}
                            />
                        </div>
                        :null}
                    <div style = {this.pretabstyle}></div>
                    <div 
                        style = {this.tabstyle}
                    > 
                        <Icon style = {{verticalAlign:'middle'}}>folder_open</Icon> 
                        <QuantityBadge quantity = {listDocument.counts.lists + listDocument.counts.links} style = {{left:'-6px',top:'-8px'}}/>

                        <div style = {
                            {
                                display:'inline-block',
                                verticalAlign:'middle',                        
                                textOverflow: 'ellipsis',
                                maxWidth: '90%',
                                overflow: 'hidden',
                            }
                        } >
                            {listDocument.properties.name}
                        </div>
                    </div>
                </div>):<div style = {{height:'33px'}}><CircularProgress size = {12} /></div>}
            </div>
            
        </div>
    }
}

export default DirectoryBar