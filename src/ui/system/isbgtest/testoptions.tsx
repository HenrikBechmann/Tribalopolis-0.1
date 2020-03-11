// build.controller.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import InputLabel from '@material-ui/core/InputLabel'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import NativeSelect from '@material-ui/core/NativeSelect'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(3),
    },
  }),
)

export default function OrientationOptions(props) {
  let { orientationCallback, demoCallback } = props
  const styleprops = {}
  const classes = useStyles(styleprops)
  const [value, setValue] = React.useState('vertical')
  const [demovalue, setDemovalue] = React.useState('images')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = (event.target as HTMLInputElement).value
    setValue(value)
    orientationCallback(value)
  }

  const handleDemoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let demovalue = (event.target as HTMLInputElement).value
    setDemovalue(demovalue)
    demoCallback(demovalue)    
  }

  return (
    <div>
      <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Orientation</FormLabel>
          <RadioGroup aria-label="orientation" name="orientation" value={value} onChange={handleChange}>
            <FormControlLabel value="vertical" control={<Radio />} label="Vertical" />
            <FormControlLabel value="horizontal" control={<Radio />} label="Horizontal" />
          </RadioGroup>
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Demos</FormLabel>
          <RadioGroup aria-label="demo" name="demo" value={demovalue} onChange={handleDemoChange}>
            <FormControlLabel value="images" control={<Radio />} label="Images" />
            <FormControlLabel value="lists" control={<Radio />} label="Nested lists" />
          </RadioGroup>
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Scroll To</FormLabel>
          <TextField
            id="scrolltonumber"
            label="Scroll to item number"
            defaultValue={0}
            variant="filled"
          />
          <Button variant="contained">Go</Button>
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Scroll To Alignment</FormLabel>
        <NativeSelect
          defaultValue={'nearest'}
          // onChange={handleChange('age')}
          inputProps={{
            name: 'alignment',
            id: 'alignment',
          }}
        >
          <option value={'nearest'}>nearest</option>
          <option value={'start'}>start</option>
          <option value={'center'}>center</option>
          <option value={'end'}>end</option>
        </NativeSelect>
      </FormControl>

    </div>
  )
}
