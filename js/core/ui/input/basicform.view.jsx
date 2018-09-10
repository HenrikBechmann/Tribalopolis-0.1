// basicform.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
const styles = (theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
});
class BaseFormBase extends React.Component {
    render() {
        const classes = this.props;
        console.log('classes', classes);
        return (<form className={classes.root} autoComplete="off">
            </form>);
    }
}
const BaseForm = withStyles(styles)(BaseFormBase);
export default BaseForm;
//# sourceMappingURL=basicform.view.jsx.map