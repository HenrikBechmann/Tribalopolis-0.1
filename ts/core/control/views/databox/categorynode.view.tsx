// categoryitem.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'

import FontIcon from 'material-ui/FontIcon'

const CategoryNode = props => {
    let { id,data } = props
    let {name, sysnode} = data
    let count = data.aggregates.childcount.amount

    return <div style = {
        {
            padding:'3px',
        }
    }>
        <FontIcon color = {sysnode?'green':'black'} style = {{verticalAlign:'middle'}} className='material-icons'>list</FontIcon> 
        {name + ` (${count})`}
    </div>
}

export default CategoryNode