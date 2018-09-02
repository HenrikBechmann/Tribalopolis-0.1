// toolbar.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'

import ActionButton from '../common/actionbutton.view'

class BoxToolbar extends React.Component<any,any> {

    constructor(props) {
        super(props)
        this.splaydomsource = React.createRef()
        this.selectdomsource = React.createRef()
    }

    splaydomsource
    selectdomsource

    selectFromSplay = () => {
        return () => {
            this.props.selectFromSplay(this.selectdomsource.current)
        }
    }

    splayBox = () => {
        return () => {
            this.props.splayBox(this.splaydomsource.current)
        }
    }

    render () {

        let props = this.props

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
            <div style = {{float:'right'}}
                ref = {this.splaydomsource}
            >
                <ActionButton 
                    img = '/public/icons/ic_splay_24px.svg'
                    disabled = {!props.listcount} 
                    action = {this.splayBox()}
                />
            </div>

            <div style = {{float:'right'}}
                ref = {this.selectdomsource}
            >
                <ActionButton 
                    iconStyle = {{transform:'rotate(90deg)'}}
                    disabled = {!haspeers}
                    img = '/public/icons/ic_splay_24px.svg' 
                    action = {this.selectFromSplay()}
                />
            </div>

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
}


export default BoxToolbar