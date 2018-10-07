// popupmenu.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence

'use strict'

import React from 'react'

import Menu from '@material-ui/core/Menu';

const PopupMenu = props => {

    let { menuopen, menuAnchor, menuClose } = props

    return (
        <Menu
          open={menuopen} 
          anchorEl={menuAnchor.current}
          onClick ={menuClose} 
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
