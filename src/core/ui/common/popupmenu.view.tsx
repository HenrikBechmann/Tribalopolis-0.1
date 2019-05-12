// popupmenu.view.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

import Menu from '@material-ui/core/Menu';
// import PopOver from '@material-ui/core/Popover'
 // for PopOver anchorOrigin = {{ vertical: 'bottom', horizontal: 'left',}}

const PopupMenu = props => {

    let { menuopen, menuAnchor, menuClose, anchorOrigin } = props

    return (
        <Menu
          open={menuopen} 
          anchorEl={menuAnchor.current}
          onClick ={menuClose} 
          anchorOrigin = {anchorOrigin}
          getContentAnchorEl = {null}
        >
            { props.children }
        </Menu>
    )
}

export default PopupMenu

    // {({ TransitionProps, placement }) => (
    //   <Grow
    //     {...TransitionProps}
    //     style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
    //   >
      // </Grow>
