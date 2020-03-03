// build.controller.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(3),
    },
  }),
)

export default function OrientationOptions(props) {
  let { orientationCallback } = props
  const styleprops = {}
  const classes = useStyles(styleprops)
  const [value, setValue] = React.useState('horizontal')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = (event.target as HTMLInputElement).value
    setValue(value)
    orientationCallback(value)
  };

  return (
    <div>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Orientation</FormLabel>
        <RadioGroup aria-label="orientation" name="orientation" value={value} onChange={handleChange}>
          <FormControlLabel value="vertical" control={<Radio />} label="Vertical" />
          <FormControlLabel value="horizontal" control={<Radio />} label="Horizontal" />
        </RadioGroup>
      </FormControl>
    </div>
  )
}
