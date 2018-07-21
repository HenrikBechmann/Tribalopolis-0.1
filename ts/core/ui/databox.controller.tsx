// databox.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'

import BoxIdentifier from './views/databox/identitybar.view'
import BoxTypebar from './views/databox/typebar.view'
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
            backgroundColor:'white',
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
            overflow:'hidden',
        }

        let { item } = this.props

        return <div style = {frameStyle}>
            <BoxTypebar item = {item} />
            <BoxIdentifier item = {item} />
            <div style = {
                {
                    overflow:'auto',
                    height:'calc(100% - 70px)'
                }
            } >
                <div>
                    <CategoriesBar item = {item} getListItem = {this.props.getListItem}/>
                </div>

            </div>
        </div>
    }
}

                    // <ProfileBar node = {node} />
                    // <ProfileForm node = {node} />
                    // <ScanBar node = {node} />

export default DataBox
