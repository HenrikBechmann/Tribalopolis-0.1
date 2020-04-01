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

export default function OrientationOptions({callbacks}) {
  let { orientationcallback, democallback, scrolltoposcallback, scrolltogocallback,alignmentcallback } = callbacks
  const styleprops = {}
  const classes = useStyles(styleprops)
  const [orientationvalue, setOrientationValue] = React.useState('vertical')
  const [demovalue, setDemovalue] = React.useState('generic')

  const handleOrientationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let orientationvalue = (event.target as HTMLInputElement).value
    setOrientationValue(orientationvalue)
    orientationcallback(orientationvalue)
  }

  const handleDemoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let demovalue = (event.target as HTMLInputElement).value
    setDemovalue(demovalue)
    democallback(demovalue)    
  }

  return (
    <div>
      <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Orientation</FormLabel>
          <RadioGroup aria-label="orientation" name="orientation" value={orientationvalue} onChange={handleOrientationChange}>
            <FormControlLabel value="vertical" control={<Radio />} label="Vertical" />
            <FormControlLabel value="horizontal" control={<Radio />} label="Horizontal" />
          </RadioGroup>
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Demos</FormLabel>
          <RadioGroup aria-label="demo" name="demo" value={demovalue} onChange={handleDemoChange}>
            <FormControlLabel value="generic" control={<Radio />} label="Generic (simple)" />
            <FormControlLabel value="nested" control={<Radio />} label="Nested lists (complex)" />
          </RadioGroup>
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Scroll To</FormLabel>
          <TextField
            id="scrolltonumber"
            label="Enter item number"
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
