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
import Checkbox from '@material-ui/core/Checkbox'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(3),
    },
    wrapper:{
      width:'5250px'
    }
  }),
)

// -------------------------[ options values ]-------------------

// 3.
let cachevalue = 'cradle'
let cachemaxvalue = 0

// 4.
let gapvalue = 0
let paddingvalue = 0

// 5.
let cellwidthvalue = 0
let cellheightvalue = 0

// 6. 
let cellminwidthvalue = 0
let cellminheightvalue = 0

// 7.
let runwaysizevalue = 0

// 8.
let gotovalue = 0

// 9.
let setlistsizevalue = 0

// 12.
let addremoveindexvalue = 0
let addremoverangehighvalue = 0

// 13.
let movefromindexvalue = 0
let movefromhighrangevalue = 0
let movetoindexvalue = 0

// 14.
let remapindextest = 'test1'

// callbacks selected
let indexchecked = false
let preloadchecked = false
let itemchecked = false
let repositioningflagchecked = false
let repositioningchecked = false
let listsizechecked = false
let deletechecked = false

  // --------------------[ onChange update calls ]--------------------

// 3.
const updateCacheValue  = (event) => {

  cachevalue = event.target.value

}

const updateCacheMaxValue = (event) => {

  cachemaxvalue = parseInt(event.target.value)

}

// 4. 
const updateGapValue = (event) => {

  gapvalue = parseInt(event.target.value)

}
const updatePaddingValue = (event) => {

  paddingvalue = parseInt(event.target.value)

}

// 5.
const updateCellwidthValue = (event) => {

  cellwidthvalue = parseInt(event.target.value)

}
const updateCellheightValue = (event) => {

  cellheightvalue = parseInt(event.target.value)

}

// 6.
const updateCellminwidthValue = (event) => {

  cellminwidthvalue = parseInt(event.target.value)

}
const updateCellminheightValue = (event) => {

  cellminheightvalue = parseInt(event.target.value)

}

// 7.
const updateRunwaysizeValue = (event) => {

  runwaysizevalue = parseInt(event.target.value)

}

// 8.
const updateGotoValue = (event) => {

  gotovalue = parseInt(event.target.value)

}

// 9.
const updateSetListsizeValue = (event) => {

  setlistsizevalue = parseInt(event.target.value)

}

// 12. 
const updateAddRemoveIndexValue = (event) => {

  addremoveindexvalue = parseInt(event.target.value)

}

// 14.

const updateremapindexes = (event) => {

  remapindextest = event.target.value 

}

const updateAddRemoveRangeHighValue = (event) => {

  addremoverangehighvalue = parseInt(event.target.value)

}

// 13. 
const updateMoveFromIndexValue = (event) => {

  movefromindexvalue = parseInt(event.target.value)

}

const updateMoveFromHighRangeValue = (event) => {

  movefromhighrangevalue = parseInt(event.target.value)

}

const updateMoveToIndexValue = (event) => {

  movetoindexvalue = parseInt(event.target.value)

}

// =================[ TEST OPTIONS COMPONENT ]=================

const TestOptions = ({callbacks}) => {
  const { 
    orientationcallback, // 1.
    democallback, // 2.
    applycachecallback, // 3.
    gridconfigborderscallback, // 4.
    gridconfigcellscallback, // 5.
    gridconfigminmaxcellscallback, // 6.
    scrollerconfigrunwaysizecallback, // 7.
    scrolltoposcallback, // 8.
    setlistsizecallback, // 9.
    getcachemapcallback, // 10. a
    getcachelistcallback, // 10. b
    getcradlemapcallback, // 10. c
    reloadcallback, // 11. a
    clearcachecallback, // 11. b
    insertindexcallback, // 12. a
    removeindexcallback, // 12. b
    moveindexcallback, // 13
    remapindexescallback, // 14
    // Stream feedback to console
    indexstreamcallback,
    preloadstreamcallback,
    itemstreamcallback,
    repositioningflagcallback,
    repositioningstreamcallback,
    listsizestreamcallback,
    deletestreamcallback,
    // Get test data
    gettestdatacallback,

  } = callbacks

  const styleprops = {}
  const classes = useStyles(styleprops)

  const [orientationvalue, setOrientationValue] = React.useState('vertical')
  const [demovalue, setDemovalue] = React.useState('generic')

  // ------------------------[ onchange callbacks ]---------------------

  // 1.
  const handleOrientationChange = (event) => {
    const orientationvalue = event.target.value
    setOrientationValue(orientationvalue)
    orientationcallback(orientationvalue)
  }

  // 2. 
  const handleDemoChange = (event) => {
    let demovalue = event.target.value
    setDemovalue(demovalue)
    democallback(demovalue)
  }

  // 3.
  const handleCache = () => {

    applycachecallback(cachevalue, cachemaxvalue)

  }

  // 4.
  const handleGridConfigBorders = () => {

    gridconfigborderscallback(paddingvalue, gapvalue)

  }

  // 5. 
  const handleGridConfigCells = () => {

    gridconfigcellscallback(cellwidthvalue, cellheightvalue)

  }

  // 6.
  const handleGridConfigMinMaxCells = () => {

    gridconfigminmaxcellscallback(cellminwidthvalue, cellminheightvalue)

  }

  // 7. 
  const handleScrollerConfigRunwaySize = () => {

    scrollerconfigrunwaysizecallback(runwaysizevalue)

  }

  // 8.
  const handleGoto = () => {

    scrolltoposcallback(gotovalue)

  }

  // 9.
  const handleSetListsize = () => {

    setlistsizecallback(setlistsizevalue)

  }

  // 10. a
  const handlegetcachemap = () => {

    getcachemapcallback()

  }

  // 10. b
  const handlegetcachelist = () => {

    getcachelistcallback()

  }

  // 10. c
  const handlegetcradlemap = () => {

    getcradlemapcallback()
    
  }

  // 11. a
  const handlereload = () => {

    reloadcallback()

  }

  // 11. b
  const handleclearcache = () => {

    clearcachecallback()

  }

  // 12. a
  const handleInsertIndex = () => {

    insertindexcallback(addremoveindexvalue, addremoverangehighvalue)

  }

  // 12. b
  const handleRemoveIndex = () => {

    removeindexcallback(addremoveindexvalue, addremoverangehighvalue)

  }

  // 13. 
  const handleMoveIndex = () => {

    moveindexcallback(movetoindexvalue, movefromindexvalue, movefromhighrangevalue)

  }

  // 14. 
  const handleremapindexes = () => {

    remapindexescallback(remapindextest)

  }

  // Stream feedback to console
  const handleRefIndexStreamChange = (event) => {

    indexchecked = event.target.checked
    indexstreamcallback(indexchecked)

  }

  const handlePreloadStreamChange = (event) => {

    preloadchecked = event.target.checked
    preloadstreamcallback(preloadchecked)

  }

  const handleItemStreamChange = (event) => {

    itemchecked = event.target.checked
    itemstreamcallback(itemchecked)

  }

  const handleRepositioningFlagChange = (event) => {

    repositioningflagchecked = event.target.checked
    repositioningflagcallback(repositioningflagchecked)

  }

  const handleRepositioningStreamChange = (event) => {

    repositioningchecked = event.target.checked
    repositioningstreamcallback(repositioningchecked)

  }

  const handleListsizeStreamChange = (event) => {

    listsizechecked = event.target.checked
    listsizestreamcallback(listsizechecked)

  }

  const handleDeleteStreamChange = (event) => {

    deletechecked = event.target.checked
    deletestreamcallback(deletechecked)

  }

  // Get test data
  const handleGetTestData = () => {
    gettestdatacallback()
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
          <NativeSelect
              defaultValue={'generic'}
              inputProps={{
                name: 'demo',
                id: 'demo',
              }}
              onChange = {handleDemoChange}
          >
            <option value="generic">generic</option>
            <option value="genericpromises">generic promises</option>
            <option value="genericdynamic">generic dynamic</option>
            <option value="nested">nested</option>
            <option value="nestedpromises">nested promises</option>
            <option value="nesteddynamic">nested dynamic</option>
            <option value="variable">variable</option>
            <option value="variablepromises">variable promises</option>
            <option value="variabledynamic">variable dynamic</option>
          </NativeSelect>
      </FormControl>

      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">3. Cache</FormLabel>
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
          <FormLabel component="legend">4. Grid config (borders)</FormLabel>
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
        <FormLabel component="legend">Grid config (borders)</FormLabel>
        <Button onClick = {handleGridConfigBorders} variant="contained">Apply</Button>
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">5. Grid config (cells)</FormLabel>
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
        <FormLabel component="legend">Grid config (cells)</FormLabel>
        <Button onClick = {handleGridConfigCells} variant="contained">Apply</Button>
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">6. Grid min/max (cells)</FormLabel>
          <TextField
            id="cellwidth"
            type = "number"
            label="Enter cell min-width"
            defaultValue={0}
            variant="filled"
            onChange = {updateCellminwidthValue}
          />
          <TextField
            id="cellheight"
            type = "number"
            label="Enter cell min-height"
            defaultValue={0}
            variant="filled"
            onChange = {updateCellminheightValue}
          />
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Grid min/max (cells)</FormLabel>
        <Button onClick = {handleGridConfigMinMaxCells} variant="contained">Apply</Button>
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">7. Config Runwaysize</FormLabel>
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
          <Button onClick = {handlegetcachemap} variant="contained">Get Cache Index Map</Button>
          <Button onClick = {handlegetcachelist} variant="contained">Get Cache Item Map</Button>
          <Button onClick = {handlegetcradlemap} variant="contained">Get Cradle Index Map</Button>
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">11. General operations</FormLabel>
          <Button onClick = {handlereload} variant="contained">Reload</Button>
          <Button onClick = {handleclearcache} variant="contained">Clear cache</Button>
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">12. Add/remove index</FormLabel>
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
          <FormLabel component="legend">13. Move index</FormLabel>
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
      <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">14. Change mapping</FormLabel>
          <NativeSelect
              defaultValue={'test1'}
              inputProps={{
                name: 'mapping',
                id: 'mapping',
              }}
              onChange = {updateremapindexes}
          >
            <option value="test1">test 1</option>
            <option value="test2">test 2</option>
            <option value="test3">test 3</option>
            <option value="test4">test 4</option>
          </NativeSelect>
          <Button onClick = {handleremapindexes} variant="contained">Test remap indexes</Button>
      </FormControl> 
      </div>
      <div style = {{backgroundColor:'lightgreen', display:'inline-block'}}>
      <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Stream feedback to console</FormLabel>
          <FormControlLabel
            control={
              <Checkbox
                onChange={handleRefIndexStreamChange}
                name="checkedA"
              />
            }
            label="Reference Index"
            style = {{fontSize:'7px'}}
          />
          <FormControlLabel
            control={
              <Checkbox
                onChange={handlePreloadStreamChange}
                name="checkedC"
              />
            }
            label="Preload Index"
          />
          <FormControlLabel
            control={
              <Checkbox
                onChange={handleItemStreamChange}
                name="checkedD"
              />
            }
            label="Item Exceptions"
          />
    </FormControl>
    <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Stream feedback to console</FormLabel>
          <FormControlLabel
            control={
              <Checkbox
                onChange={handleRepositioningFlagChange}
                name="checkedB"
              />
            }
            label="isRepositioning Notification"
            style = {{fontSize:'7px'}}
          />
          <FormControlLabel
            control={
              <Checkbox
                onChange={handleRepositioningStreamChange}
                name="checkedB"
              />
            }
            label="Repositioning Index"
            style = {{fontSize:'7px'}}
          />
    </FormControl>
    <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Stream feedback to console</FormLabel>
          <FormControlLabel
            control={
              <Checkbox
                onChange={handleListsizeStreamChange}
                name="checkedE"
              />
            }
            label="Listsize change"
          />
          <FormControlLabel
            control={
              <Checkbox
                onChange={handleDeleteStreamChange}
                name="checkedF"
              />
            }
            label="Deleted List"
          />
    </FormControl>
    <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Get test data</FormLabel>
          <Button onClick = {handleGetTestData} variant="contained">Get test settings</Button>
    </FormControl>
      </div>
    </div>
  )
}

export default TestOptions

