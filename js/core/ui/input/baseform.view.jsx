// baseform.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import React from 'react';
import { withStyles, createStyles } from '@material-ui/core/styles';
/*
    patterned after first demo https://material-ui.com/demos/selects/ for 3.03
    use Typsecript fixes from here: https://material-ui.com/guides/typescript/
*/
const styles = (theme) => createStyles({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
});
class BaseForm extends React.Component {
    render() {
        const { classes, onEnterKey } = this.props;
        return (<form className={classes.root} autoComplete="off" onKeyDown={(event) => {
            // Number 13 is the "Enter" key on the keyboard
            if (event.keyCode === 13) {
                // Trigger the button element with a click
                event.preventDefault();
                // event.stopPropagation()
                this.props.onEnterKey();
            }
        }}>
                {this.props.children}
            </form>);
    }
}
export default withStyles(styles)(BaseForm);
//# sourceMappingURL=baseform.view.jsx.map