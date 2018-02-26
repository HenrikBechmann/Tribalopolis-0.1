// boxheader.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'

import FontIcon from 'material-ui/FontIcon'

const CategoriesBar = props => {

    let { item } = props

    let styles = {
        width:'100%',
        border:'1px solid silver',
        borderRadius:'8px',
        padding:'3px',
        whitespace:'nowrap',
        overflow:'hidden',
        boxSizing:'border-box',
        fontSize:'smaller',
        marginBottom: '3px',
    }

    return <div style = {styles as any}>
        <FontIcon style = {{verticalAlign:'middle',float:'right'}} className='material-icons'>expand_less</FontIcon> 
        <FontIcon style = {{verticalAlign:'middle'}} className='material-icons'>list</FontIcon> 
        <span style = {{verticalAlign:'middle'}} >Activity categories</span>
    </div>
}

export default CategoriesBar