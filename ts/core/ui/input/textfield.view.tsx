// textfield.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence

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
   onChange:any, 
}

const TextField = ({ classes, name, label, value, helperText, margin, onChange }:TextFieldInterface) => {

    let marginval = (margin)?margin:'normal'

    return (
        <MuiTextField
          id = { name + '-id' }
          name = { name }
          label = { label }
          value = { value }
          className = { classes.textField }
          helperText = { helperText }
          margin = { marginval }
          onChange = { onChange }
        />
    )
}

export default withStyles(styles)(TextField)