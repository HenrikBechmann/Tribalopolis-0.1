// popupmenu.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuList from '@material-ui/core/MenuList';
const PopupMenu = props => {
    let { menuopen, menuAnchor, menuClose } = props;
    return (<Popper open={menuopen} anchorEl={menuAnchor.current} transition disablePortal style={{ zIndex: 3 }}>
        <Paper>
          <ClickAwayListener onClickAway={menuClose}>
            <MenuList>
                {props.children}
            </MenuList>
          </ClickAwayListener>
        </Paper>
    )}
    </Popper>);
};
export default PopupMenu;
//# sourceMappingURL=popupmenu.view.jsx.map