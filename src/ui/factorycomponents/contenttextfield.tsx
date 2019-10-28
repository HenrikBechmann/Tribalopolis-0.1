// textfield.view.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

import { withStyles, createStyles, Theme } from '@material-ui/core/styles'

import TextField from '@material-ui/core/TextField'

import { GenericObject } from '../../services/interfaces'


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
   rows?:number,
   inputProps:GenericObject,
}

const ContentTextField = (props:TextFieldInterface) => {

    let { 
      classes, 
      name, 
      label, 
      value, 
      helperText, 
      margin, 
      multiline, 
      rows, 
      onChange,
      inputProps,
    } = props

    let marginval = margin?margin:'normal'
    // console.log('contentTextField:props',props)
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
          inputProps = {inputProps}
        />
    )
}

export default withStyles(styles)(ContentTextField)
