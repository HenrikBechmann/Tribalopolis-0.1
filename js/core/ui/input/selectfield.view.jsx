// selectfield.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import React from 'react';
import { withStyles, createStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
const styles = (theme) => createStyles({
    formControl: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
});
const SelectField = ({ classes, label, name, value, onChange, helperText, options }) => {
    let optionslist = options.map((item, index) => {
        return <MenuItem key={index} value={item.value}> {item.text} </MenuItem>;
    });
    let inputid = name + '-id';
    return (<FormControl className={classes.formControl} margin='normal'>
          <InputLabel shrink htmlFor={inputid}>
             {label}
          </InputLabel>
          <Select value={value} onChange={onChange} input={<Input name={name} id={inputid}/>} displayEmpty name={name} className={classes.selectEmpty}>
              {optionslist}
          </Select>
          <FormHelperText> {helperText} </FormHelperText>
        </FormControl>);
};
export default withStyles(styles)(SelectField);
//# sourceMappingURL=selectfield.view.jsx.map