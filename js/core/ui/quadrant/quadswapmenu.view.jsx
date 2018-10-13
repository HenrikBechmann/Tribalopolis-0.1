// swapmenu.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles, createStyles } from '@material-ui/core/styles';
import ActionButton from '../common/actionbutton.view';
import PopupMenu from '../common/popupmenu.view';
const styles = createStyles({
    root: {
        position: 'absolute',
        right: '6px',
        top: '6px',
        border: '1px solid silver',
        borderRadius: '0 0 0 8px',
        backgroundColor: 'lightgray',
        zIndex: 1,
        padding: '3px',
    },
    menustyle: {
        padding: '6px',
        fontSize: '.86rem',
    }
});
class SwapMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menuopen: false,
        };
        this.toggleMenu = () => {
            this.setState(state => ({ menuopen: !state.menuopen }));
        };
        this.menuClose = event => {
            if (this.menuAnchor.current.contains(event.target)) {
                return;
            }
            this.setState({ menuopen: false });
        };
        this.menuAnchor = React.createRef();
    }
    render() {
        let { quadrantPosition, handleSwap, classes } = this.props;
        // console.log('quadrantposition',quadrantPosition)
        let tilt = null;
        if (quadrantPosition == 'topleft' || quadrantPosition == 'bottomright') {
            tilt = '-45deg';
        }
        else {
            tilt = '45deg';
        }
        return <div className={classes.root}>
            <div ref={this.menuAnchor}>
                <ActionButton buttonStyle={{
            float: 'none',
            width: '24px',
            height: '24px',
        }} icon='menu' action={this.toggleMenu}/>
            </div>

            <PopupMenu menuopen={this.state.menuopen} menuAnchor={this.menuAnchor} menuClose={this.menuClose} anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
        }}>
                <MenuItem className={classes.menustyle} onClick={this.menuClose}>

                <div style={{
            display: 'inline-block',
            marginRight: '6px',
        }}>
                    Swap
                </div>

                <ActionButton iconStyle={{ color: 'green' }} icon='swap_vert' action={() => {
            handleSwap(quadrantPosition, 'vertical');
        }}/>
                <ActionButton iconStyle={{ color: 'green', transform: `rotate(${tilt})` }} icon='swap_vert' action={() => {
            handleSwap(quadrantPosition, 'diagonal');
        }}/>
                <ActionButton iconStyle={{ color: 'green' }} icon='swap_horiz' action={() => {
            handleSwap(quadrantPosition, 'horizontal');
        }}/>
                </MenuItem>
            </PopupMenu>

        </div>;
    }
}
export default withStyles(styles)(SwapMenu);
//# sourceMappingURL=quadswapmenu.view.jsx.map