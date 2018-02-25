// databox.view.tsx

// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'

class DataBox extends React.Component<any,any> {

    render() {
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
            <div style = {{width:'100%',borderRadius:'6px'}}>
                data box
            </div>
        </div>
    }
}

export default DataBox