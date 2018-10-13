// popupmenu.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import React from 'react';
import Menu from '@material-ui/core/Menu';
// import PopOver from '@material-ui/core/Popover'
// for PopOver anchorOrigin = {{ vertical: 'bottom', horizontal: 'left',}}
const PopupMenu = props => {
    let { menuopen, menuAnchor, menuClose, anchorOrigin } = props;
    return (<Menu open={menuopen} anchorEl={menuAnchor.current} onClick={menuClose} anchorOrigin={anchorOrigin} getContentAnchorEl={null}>
            {props.children}
        </Menu>);
};
export default PopupMenu;
//# sourceMappingURL=popupmenu.view.jsx.map