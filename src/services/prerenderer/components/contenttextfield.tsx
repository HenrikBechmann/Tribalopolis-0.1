// textfield.view.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

import { withStyles, createStyles, Theme } from '@material-ui/core/styles'

import TextField from '@material-ui/core/TextField'


const styles = ( theme:Theme ) => createStyles({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
})

// allow optional margin
interface TextFieldInterface {
   classes?:any, 
   name:string, 
   label:string, 
   value:any, 
   helperText?:string, 
   margin?:"normal" | "none" | "dense", 
   multiline?:boolean
   onChange?:any, 
   readonly?:boolean,
   disabled?:boolean,
   rows?:number,
}

const ContentTextField = (props:TextFieldInterface) => {

    let { classes, name, label, value, helperText, margin, multiline, rows, onChange, readonly, disabled } = props

    let marginval = margin?margin:'normal'

    // console.log('calling Textfield')

    // console.log('textfield props',classes, name, label, value, helperText, margin, onChange)

    return (
        <TextField
          id = { name + '-id' }
          name = { name }
          label = { label }
          value = { value || '' }
          className = { classes.textField }
          helperText = { helperText }
          multiline = {multiline?multiline:false}
          rows = {rows?rows:1}
          margin = { marginval }
          onChange = { onChange }
          inputProps = {{
            readOnly:(readonly && readonly),
            disabled:(disabled && disabled),
          }}
        />
    )
}

export default withStyles(styles)(ContentTextField)
