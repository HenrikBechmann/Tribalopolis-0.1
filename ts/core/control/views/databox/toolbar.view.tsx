// toolbar.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'

import FontIcon from 'material-ui/FontIcon'

const BoxToolbar = props => {

    let styles:React.CSSProperties = {
        position:'relative',
        width:'100%',
        borderRadius:'8px',
        padding:'3px',
        whitespace:'nowrap',
        overflow:'hidden',
        fontSize:'larger',
        boxSizing:'border-box',
    }

    return <div style = {styles}>

        <div style = {
            {
                padding:'3px',
                boxSizing:'border-box',
                width:'32px',
                height:'32px',
                display:'inline-block',
                float:'left',
                borderRadius:'50%',
                border:'1px solid silver',
            }
        } >
            <FontIcon className='material-icons'>menu</FontIcon>
        </div>
        <div style = {
            {
                padding:'4px 0 0 3px',
                boxSizing:'border-box',
                width:'32px',
                height:'32px',
                display:'inline-block',
                float:'right',
                borderRadius:'50%',
                border:'1px solid silver',
            }
        }> 
            <img style = {{verticalAlign:'middle'}} src = '/public/icons/ic_splay_24px.svg' />
        </div>

        <div style = {
            {
                margin:'0 auto 0 auto',
                height:'32px',
                boxSizing:'border-box',
                border:'1px solid silver',
                borderRadius:'8px',
                padding:'5px 3px 3px',
                width:'70%',
                textAlign:'center',
                fontStyle:'italic',
                position:'relative',
            }
        }>
            <FontIcon style = {{position:'absolute',top:'0',right:'0',marginTop:'2px'}} className='material-icons'>arrow_drop_down</FontIcon>
            {props.node.class}
        </div>

    </div>
}

export default BoxToolbar