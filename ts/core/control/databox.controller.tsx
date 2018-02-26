// databox.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'

import BoxHeader from './views/databox/boxheader.view'
import BoxToolbar from './views/databox/boxtoolbar.view'
import ProfileBar from './views/databox/boxprofilebar.view'
import CategoriesBar from './views/databox/boxcategoriesbar.view'

class DataBox extends React.Component<any,any> {

    render() {
        // console.log('item',this.props.item)
        let frameStyle = {
            width:'280px',
            backgroundColor:'lightblue',
            border:'1px solid silver',
            maxHeight:'96%',
            minHeight:'60%',
            padding:'3px',
            boxSizing:'border-box',
            borderRadius:'8px',
            marginRight:'16px',
        }

        return <div style = {frameStyle as any}>
            <BoxToolbar item = {this.props.item} />
            <BoxHeader item = {this.props.item} />
            <div style = {
                {
                    overflow:'auto',
                }
            } >

                <ProfileBar item = {this.props.item} />
                <CategoriesBar item = {this.props.item} />

            </div>
        </div>
    }
}

export default DataBox
