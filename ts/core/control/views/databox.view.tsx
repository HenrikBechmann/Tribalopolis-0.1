// databox.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'

import BoxHeader from './boxheader.view'

class DataBox extends React.Component<any,any> {

    render() {
        console.log('item',this.props.item)
        let frameStyle = {
            width:'280px',
            backgroundColor:'lightblue',
            border:'1px solid silver',
            maxHeight:'96%',
            minHeight:'60%',
            padding:'3px',
            boxSizing:'border-box',
            borderRadius:'8px',
            overflow:'auto',
            marginRight:'16px',
        }

        return <div style = {frameStyle as any}>
            <BoxHeader item = {this.props.item}/>
        </div>
    }
}

export default DataBox