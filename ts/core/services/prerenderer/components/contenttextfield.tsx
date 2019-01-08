// textfield.view.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

import { withStyles, createStyles, Theme } from '@material-ui/core/styles'

import MuiTextField from '@material-ui/core/TextField'


const styles = ( theme:Theme ) => createStyles({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
})

// allow optional margin
interface TextFieldInterface {
   classes:any, 
   name:any, 
   label:any, 
   value:any, 
   helperText:any, 
   margin?:any, 
   multiline?:boolean
   onChange:any, 
}

const ContentTextField = ({ classes, name, label, value, helperText, margin, multiline, onChange }:TextFieldInterface) => {

    let marginval = (margin)?margin:'normal'

    // console.log('calling Textfield')

    // console.log('textfield props',classes, name, label, value, helperText, margin, onChange)

    return (
        <MuiTextField
          id = { name + '-id' }
          name = { name }
          label = { label }
          value = { value }
          className = { classes.textField }
          helperText = { helperText }
          multiline = {multiline?multiline:false}
          margin = { marginval }
          onChange = { onChange }
        />
    )
}

export default withStyles(styles)(ContentTextField)
