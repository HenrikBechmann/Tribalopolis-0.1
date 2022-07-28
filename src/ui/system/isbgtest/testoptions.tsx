// build.controller.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

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
      width:'4200px'
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
    reversecradlecallback,
    insertindexcallback,
    removeindexcallback,
    applylayoutcallback,
    applycachecallback,
    gridconfigcellscallback,
    gridconfigborderscallback,
    scrollerconfigrunwaysizecallback,
    moveindexcallback,

  } = callbacks
  const styleprops = {}
  const classes = useStyles(styleprops)
  const [orientationvalue, setOrientationValue] = React.useState('vertical')
  const [demovalue, setDemovalue] = React.useState('generic')

  const handleOrientationChange = (event) => {
    const orientationvalue = event.target.value
    setOrientationValue(orientationvalue)
    orientationcallback(orientationvalue)
  }

  const handleDemoChange = (event) => {
    let demovalue = event.target.value
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
  let runwaysizevalue:any = 0
  let setlistsizevalue:any = 0
  let addremoveindexvalue:any = 0
  let addremoverangehighvalue:any = 0
  let cachevalue:any = ''
  let movefromindexvalue:number = 0
  let movefromhighrangevalue:number = 0
  let movetoindexvalue:number = 0

  const updateMoveFromHighRangeValue = (event) => {

    movefromhighrangevalue = parseInt(event.target.value)

  }

  const updateMoveFromIndexValue = (event) => {

    movefromindexvalue = parseInt(event.target.value)
  
  }

  const updateMoveToIndexValue = (event) => {

    movetoindexvalue = parseInt(event.target.value)

  }

  const updateRunwaysizeValue = (event) => {

    runwaysizevalue = parseInt(event.target.value)

  }

  const updateGapValue = (event) => {

    gapvalue = parseInt(event.target.value)

  }
  const updatePaddingValue = (event) => {

    paddingvalue = parseInt(event.target.value)

  }
  const updateCellwidthValue = (event) => {

    cellwidthvalue = parseInt(event.target.value)

  }
  const updateCellheightValue = (event) => {

    cellheightvalue = parseInt(event.target.value)

  }

  const updateGotoValue = (event) => {

    gotovalue = parseInt(event.target.value)

  }

  const updateSetListsizeValue = (event) => {

    setlistsizevalue = parseInt(event.target.value)

  }

  const updateCacheMaxValue = (event) => {

    cachemaxvalue = parseInt(event.target.value)

  }

  const updateTriggerlineValue = (event) => {

    triggerlinevalue = parseInt(event.target.value)

  }

  const updateAddRemoveIndexValue = (event) => {

    addremoveindexvalue = parseInt(event.target.value)

  }

  const updateAddRemoveRangeHighValue = (event) => {

    addremoverangehighvalue = parseInt(event.target.value)

  }

  const updateCacheValue  = (event) => {

    cachevalue = parseInt(event.target.value)
  }

  const handleLayout = () => {

    // applylayoutcallback(gotovalue)

  }
  const handleCache = () => {

    applycachecallback(cachevalue, cachemaxvalue)

  }
  const handleGridConfigCells = () => {

    // gridconfigcellscallback(gotovalue)

  }

  const handleGridConfigBorders = () => {

    // gridconfigborderscallback(gotovalue)

  }

  const handleScrollerConfigRunwaySize = () => {

    // scrollerconfigrunwaysizecallback,

  }

  const handleGoto = () => {

    scrolltoposcallback(gotovalue)

  }

  const handleSetListsize = () => {

    setlistsizecallback(setlistsizevalue)

  }

  const handleInsertIndex = () => {

    insertindexcallback(addremoveindexvalue, addremoverangehighvalue)

  }

  const handleRemoveIndex = () => {

    removeindexcallback(addremoveindexvalue, addremoverangehighvalue)

  }

  const handleMoveIndex = () => {

    moveindexcallback(movetoindexvalue, movefromindexvalue, movefromhighrangevalue)

  }

  const doreload = () => {

    reloadcallback()

  }

  const doclearcache = () => {

    clearcachecallback()

  }

  const doreversecradle = () => {

    reversecradlecallback()

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
      <div style = {{backgroundColor:'paleturquoise', display:'inline-block'}}>
      <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">1. Orientation</FormLabel>
          <RadioGroup aria-label="orientation" name="orientation" value={orientationvalue} 
            onChange={handleOrientationChange}>
            <FormControlLabel value="vertical" control={<Radio />} label="Vertical" />
            <FormControlLabel value="horizontal" control={<Radio />} label="Horizontal" />
          </RadioGroup>
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">2. Demos</FormLabel>
          <RadioGroup aria-label="demo" name="demo" value={demovalue} onChange={handleDemoChange}>
            <FormControlLabel value="generic" control={<Radio />} label="Generic (simple)" />
            <FormControlLabel value="nested" control={<Radio />} label="Nested lists (complex)" />
            <FormControlLabel value="variable" control={<Radio />} label="Variable (dynamic)" />
          </RadioGroup>
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">[3. Layout]</FormLabel>
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
        <Button onClick = {handleLayout} variant="contained">Apply</Button>
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">4. Cache</FormLabel>
        <NativeSelect
          defaultValue={'cradle'}
          inputProps={{
            name: 'cache',
            id: 'cache',
          }}
          onChange = {updateCacheValue}
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
        <Button onClick = {handleCache} variant="contained">Apply</Button>
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">[5. Grid config (borders)]</FormLabel>
          <TextField
            id="gap"
            type = "number"
            label="Enter gap size"
            defaultValue={0}
            variant="filled"
            onChange = {updateGapValue}
          />
          <TextField
            id="gap"
            type = "number"
            label="Enter padding size"
            defaultValue={0}
            variant="filled"
            onChange = {updatePaddingValue}
          />
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">[Grid config (borders)]</FormLabel>
        <Button onClick = {handleGridConfigBorders} variant="contained">Apply</Button>
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">[6. Grid config (cells)]</FormLabel>
          <TextField
            id="cellwidth"
            type = "number"
            label="Enter cell width"
            defaultValue={0}
            variant="filled"
            onChange = {updateCellwidthValue}
          />
          <TextField
            id="cellheight"
            type = "number"
            label="Enter cell height"
            defaultValue={0}
            variant="filled"
            onChange = {updateCellheightValue}
          />
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">[Grid config (cells)]</FormLabel>
        <Button onClick = {handleGridConfigCells} variant="contained">Apply</Button>
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">[7. Config Runwaysize]</FormLabel>
          <TextField
            id="runwaysize"
            type = "number"
            label="Enter runway size"
            defaultValue={0}
            variant="filled"
            onChange = {updateRunwaysizeValue}
          />
          <Button onClick = {handleScrollerConfigRunwaySize} variant="contained">Apply</Button>
      </FormControl>
      </div>
      <div style = {{backgroundColor:'palegoldenrod', display:'inline-block'}}>
      <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">8. Scroll to</FormLabel>
          <TextField
            id="scrolltonumber"
            type = "number"
            label="Enter index number"
            defaultValue={0}
            variant="filled"
            onChange = {updateGotoValue}
          />
          <Button onClick = {handleGoto} variant="contained">Apply</Button>
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">9. Set listsize</FormLabel>
          <TextField
            id="setlistsize"
            type = "number"
            label="Enter new listsize number"
            defaultValue={0}
            variant="filled"
            onChange = {updateSetListsizeValue}
          />
          <Button onClick = {handleSetListsize} variant="contained">Apply</Button>
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">10. Get snapshots</FormLabel>
          <Button onClick = {dogetcachemap} variant="contained">Get Cache Index Map</Button>
          <Button onClick = {dogetcachelist} variant="contained">Get Cache Item Map</Button>
          <Button onClick = {dogetcradlemap} variant="contained">Get Cradle Index Map</Button>
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">11. General operations</FormLabel>
          <Button onClick = {doreload} variant="contained">Reload</Button>
          <Button onClick = {doclearcache} variant="contained">Clear cache</Button>
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">12. Change mapping</FormLabel>
          <Button onClick = {doreversecradle} variant="contained">Reverse cradle items</Button>
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">13. Add/remove index</FormLabel>
          <TextField
            id="addremoveindex"
            type = "number"
            label="Enter index number"
            defaultValue={0}
            variant="filled"
            onChange = {updateAddRemoveIndexValue}
          />
          <TextField
            id="addremoveindexrange"
            type = "number"
            label="Enter high range (optional)"
            defaultValue={null}
            variant="filled"
            onChange = {updateAddRemoveRangeHighValue}
          />
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Add/remove index</FormLabel>
          <Button onClick = {handleInsertIndex} variant="contained">Insert</Button>
          <Button onClick = {handleRemoveIndex} variant="contained">Remove</Button>
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">14. Move index</FormLabel>
          <TextField
            id="movefromindex"
            type = "number"
            label="Move from index"
            defaultValue={0}
            variant="filled"
            onChange = {updateMoveFromIndexValue}
          />
          <TextField
            id="movefromhighrange"
            type = "number"
            label="from high-range (optional)"
            defaultValue={null}
            variant="filled"
            onChange = {updateMoveFromHighRangeValue}
          />
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl}>
          <TextField
            id="movetoindex"
            type = "number"
            label="Move to index"
            defaultValue={0}
            variant="filled"
            onChange = {updateMoveToIndexValue}
          />
          <FormLabel component="legend">Move index</FormLabel>
          <Button onClick = {handleMoveIndex} variant="contained">Move index</Button>
      </FormControl>
      </div>
    </div>
  )
}
