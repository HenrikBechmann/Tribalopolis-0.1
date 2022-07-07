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
    wrapper:{
      width:'3200px'
    }
  }),
)

export default function TestOptions({callbacks}) {
  let { 
    orientationcallback, 
    democallback, 
    scrolltoposcallback, 
    reloadcallback, 
    clearcachecallback,
    setlistsizecallback,
    getcachemapcallback,
    getcachelistcallback,
    getcradlemapcallback,
    reverselistcallback,
    insertindexbeforecallback,
    insertindexaftercallback,
    removeindexcallback,
  } = callbacks
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
    clearcachecallback()
    setDemovalue(demovalue)
    democallback(demovalue)    
  }

  let gotovalue:any = 0
  let cachemaxvalue:any = 0
  let triggerlinevalue:any = 10
  let gapvalue:any = 0
  let paddingvalue:any = 0
  let cellwidthvalue:any = 0
  let cellheightvalue:any = 0
  let estimatedlistsizevalue:any = 0
  let runwaysizevalue:any = 0
  let startingindexvalue:any = 0
  let setlistsizevalue:any = 0
  let addremoveindexvalue:any = 0

  const updateEstimatedListsizeValue = (event:React.ChangeEvent<HTMLInputElement>) => {

    estimatedlistsizevalue = (event.target as HTMLInputElement).value

  }
  const updateRunwaysizeValue = (event:React.ChangeEvent<HTMLInputElement>) => {

    runwaysizevalue = (event.target as HTMLInputElement).value

  }
  const updateStartingindexValue = (event:React.ChangeEvent<HTMLInputElement>) => {

    startingindexvalue = (event.target as HTMLInputElement).value

  }

  const updateGapValue = (event:React.ChangeEvent<HTMLInputElement>) => {

    gapvalue = (event.target as HTMLInputElement).value

  }
  const updatePaddingValue = (event:React.ChangeEvent<HTMLInputElement>) => {

    paddingvalue = (event.target as HTMLInputElement).value

  }
  const updateCellwidthValue = (event:React.ChangeEvent<HTMLInputElement>) => {

    cellwidthvalue = (event.target as HTMLInputElement).value

  }
  const updateCellheightValue = (event:React.ChangeEvent<HTMLInputElement>) => {

    cellheightvalue = (event.target as HTMLInputElement).value

  }

  const updateGotoValue = (event:React.ChangeEvent<HTMLInputElement>) => {

    gotovalue = (event.target as HTMLInputElement).value

  }

  const updateSetListsizeValue = (event:React.ChangeEvent<HTMLInputElement>) => {

    setlistsizevalue = (event.target as HTMLInputElement).value

  }

  const updateCacheMaxValue = (event:React.ChangeEvent<HTMLInputElement>) => {

    cachemaxvalue = (event.target as HTMLInputElement).value

  }

  const updateTriggerlineValue = (event:React.ChangeEvent<HTMLInputElement>) => {

    triggerlinevalue = (event.target as HTMLInputElement).value

  }

  const updateAddRemoveIndexValue = (event:React.ChangeEvent<HTMLInputElement>) => {

    addremoveindexvalue = (event.target as HTMLInputElement).value

  }

  const handleGoto = () => {

    scrolltoposcallback(gotovalue)

  }

  const handleSetListsize = () => {

    setlistsizecallback(setlistsizevalue)

  }

  const handleInsertBeforeIndex = () => {
    insertindexbeforecallback(addremoveindexvalue)
  }

  const handleInsertAfterIndex = () => {
    insertindexaftercallback(addremoveindexvalue)
  }

  const handleRemoveIndex = () => {
    removeindexcallback(addremoveindexvalue)
  }

  const doreload = () => {
    // console.log('reloadcallback from testoptions')
    reloadcallback()
  }

  const doclearcache = () => {
    clearcachecallback()
  }

  const doreverselist = () => {
    reverselistcallback()
  }

  const dogetcachemap = () => {
    getcachemapcallback()
  }

  const dogetcachelist = () => {
    getcachelistcallback()
  }

  const dogetcradlemap = () => {
    getcradlemapcallback()
  }

  return (
    <div className = {classes.wrapper}>
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
            <FormControlLabel value="variable" control={<Radio />} label="Variable (dynamic)" />
          </RadioGroup>
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Scroll To</FormLabel>
          <TextField
            id="scrolltonumber"
            label="Enter index number"
            defaultValue={0}
            variant="filled"
            onChange = {updateGotoValue}
          />
          <Button onClick = {handleGoto} variant="contained">Go</Button>
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Set listsize</FormLabel>
          <TextField
            id="setlistsize"
            label="Enter new listsize number"
            defaultValue={0}
            variant="filled"
            onChange = {updateSetListsizeValue}
          />
          <Button onClick = {handleSetListsize} variant="contained">Go</Button>
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Layout</FormLabel>
        <NativeSelect
          defaultValue={'uniform'}
          inputProps={{
            name: 'layout',
            id: 'layout',
          }}
        >
          <option value={'uniform'}>uniform</option>
          <option value={'variable'}>variable</option>
          <option value={'dynamic'}>dynamic</option>
          <option value={'dense'}>dense</option>
        </NativeSelect>
        <TextField
          id="cachemax"
          label="Enter triggerline offset"
          defaultValue={10}
          variant="filled"
          onChange = {updateTriggerlineValue}
        />
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Cache</FormLabel>
        <NativeSelect
          defaultValue={'cradle'}
          inputProps={{
            name: 'cache',
            id: 'cache',
          }}
        >
          <option value={'cradle'}>cradle</option>
          <option value={'keepload'}>keepload</option>
          <option value={'preload'}>preload</option>
        </NativeSelect>
        <TextField
          id="cachemax"
          label="Enter max cache items"
          defaultValue={0}
          variant="filled"
          onChange = {updateCacheMaxValue}
        />
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Grid config</FormLabel>
          <TextField
            id="gap"
            label="Enter gap number"
            defaultValue={0}
            variant="filled"
            onChange = {updateGapValue}
          />
          <TextField
            id="gap"
            label="Enter padding number"
            defaultValue={0}
            variant="filled"
            onChange = {updatePaddingValue}
          />
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Grid config</FormLabel>
          <TextField
            id="cellwidth"
            label="Enter cell width"
            defaultValue={0}
            variant="filled"
            onChange = {updateCellwidthValue}
          />
          <TextField
            id="cellheight"
            label="Enter cell height"
            defaultValue={0}
            variant="filled"
            onChange = {updateCellheightValue}
          />
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Scroller config</FormLabel>
          <TextField
            id="estimatedlistsize"
            label="Enter estimated list size"
            defaultValue={0}
            variant="filled"
            onChange = {updateEstimatedListsizeValue}
          />
          <TextField
            id="runwaysize"
            label="Enter runway size"
            defaultValue={0}
            variant="filled"
            onChange = {updateRunwaysizeValue}
          />
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Scroller config</FormLabel>
          <TextField
            id="startingindex"
            label="Enter starting index"
            defaultValue={0}
            variant="filled"
            onChange = {updateStartingindexValue}
          />
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">component functions</FormLabel>
          <Button onClick = {doreload} variant="contained">Reload</Button>
          <Button onClick = {doclearcache} variant="contained">Clear cache</Button>
          <Button onClick = {doreverselist} variant="contained">Reverse list</Button>
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">component functions</FormLabel>
          <Button onClick = {dogetcachemap} variant="contained">Get Cache Map</Button>
          <Button onClick = {dogetcachelist} variant="contained">Get Cache List</Button>
          <Button onClick = {dogetcradlemap} variant="contained">Get Cradle Map</Button>
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Add/remove index</FormLabel>
          <TextField
            id="addremoveindex"
            label="Enter index number"
            defaultValue={0}
            variant="filled"
            onChange = {updateAddRemoveIndexValue}
          />
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Add/remove index</FormLabel>
          <Button onClick = {handleInsertBeforeIndex} variant="contained">Insert Before</Button>
          <Button onClick = {handleInsertAfterIndex} variant="contained">Insert After</Button>
          <Button onClick = {handleRemoveIndex} variant="contained">Remove</Button>
      </FormControl>
    </div>
  )
}

          // <Button onClick = {dogetVisibleList} variant="contained">get Visible List</Button>
          // <Button onClick = {dogetContentList} variant="contained">get Content List</Button>
