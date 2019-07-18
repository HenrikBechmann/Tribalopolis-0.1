// textfield.view.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

import { withStyles, createStyles, Theme } from '@material-ui/core/styles'

import MuiTextField from '@material-ui/core/TextField'


const styles = ( theme:Theme ) => createStyles({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
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

const TextField = ({ classes, name, label, value, helperText, margin, multiline, onChange }:TextFieldInterface) => {

    let marginval = (margin)?margin:'normal'

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

export default withStyles(styles)(TextField)