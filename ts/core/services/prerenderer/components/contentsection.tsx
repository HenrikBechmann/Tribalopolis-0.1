// contentsection.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'

const ContentSection = props => {

    return <div style = {
        {
            border:'2px solid silver',
            padding:'3px',
            marginBottom:'8px',
        }
    }>

        {props.title && <DialogTitle>{props.title}</DialogTitle>}
        {props.description && <p>{props.description}</p>}
        {props.next && <Button variant = "contained" color = "primary">
            {props.next}
        </Button>}
        {props.descriptionPart2 && <p>{props.descriptionPart2}</p>}
        {props.children}
    
    </div>

}

export default ContentSection