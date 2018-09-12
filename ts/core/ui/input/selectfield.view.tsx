// selectfield.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence

'use strict'

import React from 'react'

import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const styles = ( theme:Theme ) => createStyles({
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
})

const SelectField = ({ classes, label, input, select, helpertext, options }) => {

    let optionslist = options.map(( item, index ) => {
        return <MenuItem key = { index } value = { item.value } > { item.text } </MenuItem>
    })

    return (
        <FormControl className = { classes.formControl } >
          <InputLabel shrink htmlFor = { input.id } >
             { label }
          </InputLabel>
          <Select
            value = { select.value }
            onChange = { select.onChange }
            input={ <Input name = { input.name } id = { input.id } /> }
            displayEmpty
            name= { input.name }
            className={ classes.selectEmpty }
          >
              { optionslist }
          </Select>
          <FormHelperText> { helpertext } </FormHelperText>
        </FormControl>
    )
}

export default withStyles( styles )( SelectField )
