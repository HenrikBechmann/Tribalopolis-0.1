// databox.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'

import BoxHeader from './views/databox/header.view'
import BoxToolbar from './views/databox/toolbar.view'
import ProfileBar from './views/databox/profilebar.view'
import ProfileForm from './views/databox/profileform.view'
import CategoriesBar from './views/databox/categoriesbar.view'
import ScanBar from './views/databox/scanbar.view'

class DataBox extends React.Component<any,any> {

    state = {
        opacity:0,
    }

    componentDidMount() {
        this.setState({
            opacity:1,
        })
    }

    render() {
        // console.log('item',this.props.item)

        let opacity = this.state.opacity

        let frameStyle:React.CSSProperties = {
            width:'300px',
            backgroundColor:'lightblue',
            border:'1px solid silver',
            maxHeight:'96%',
            minHeight:'60%',
            padding:'3px',
            boxSizing:'border-box',
            borderRadius:'8px',
            marginRight:'16px',
            fontSize:'smaller',
            opacity:opacity,
            transition:'opacity .5s ease-out',
        }

        let { node } = this.props

        return <div style = {frameStyle}>
            <BoxToolbar node = {node} />
            <BoxHeader node = {node} />
            <div style = {
                {
                    overflow:'auto',
                    height:'calc(100% - 70px)'
                }
            } >
                <div>
                    <ProfileBar node = {node} />
                    <ProfileForm node = {node} />
                    <CategoriesBar node = {node} />
                    <ScanBar node = {node} />
                </div>

            </div>
        </div>
    }
}

export default DataBox
