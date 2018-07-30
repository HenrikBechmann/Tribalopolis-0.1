// toolbar.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'

import FontIcon from 'material-ui/FontIcon'

import ActionButton from '../common/actionbutton.view'

const BoxToolbar = props => {

    let styles:React.CSSProperties = {
        position:'relative',
        width:'100%',
        borderRadius:'8px',
        padding:'3px',
        whiteSpace:'nowrap',
        overflow:'hidden',
        // fontSize:'larger',
        boxSizing:'border-box',
    }

    let boxicon = '/public/icons/databox.svg'

    // console.log('props in boxtoolbar',props, !!props.listcount)

    let haspeers = props.haspeers

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
                border:'1px solid transparent',
            }
        } >
            <img style = {{verticalAlign:'bottom'}} src = {boxicon} />
        </div>
        <ActionButton 
            img = '/public/icons/ic_splay_24px.svg'
            disabled = {!props.listcount} 
            action = {props.splayBox}
        />

        <ActionButton 
            iconStyle = {{transform:'rotate(90deg)',opacity:haspeers?1:0.3}}
            disabled = {!haspeers}
            img = '/public/icons/ic_splay_24px.svg' 
            action = {props.selectFromSplay}
        />

        <ActionButton 
            icon = 'arrow_drop_down'
        />

        <div style = {
            {
                margin:'0 auto 0 auto',
                height:'32px',
                boxSizing:'border-box',
                border:'1px solid transparent',
                borderRadius:'8px',
                padding:'5px 3px 3px',
                width:'60%',
                textAlign:'center',
                fontStyle:'italic',
                position:'relative',
            }
        }>
            {props.item.type.name}
        </div>
    </div>
}


export default BoxToolbar