// textfield.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import React from 'react';
import { withStyles, createStyles } from '@material-ui/core/styles';
import MuiTextField from '@material-ui/core/TextField';
const styles = (theme) => createStyles({
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
});
const TextField = ({ classes, name, label, value, helperText, margin, onChange }) => {
    let marginval = (margin) ? margin : 'normal';
    // console.log('calling Textfield')
    // console.log('textfield props',classes, name, label, value, helperText, margin, onChange)
    return (<MuiTextField id={name + '-id'} name={name} label={label} value={value} className={classes.textField} helperText={helperText} margin={marginval} onChange={onChange}/>);
};
export default withStyles(styles)(TextField);
//# sourceMappingURL=textfield.view.jsx.map