// quaddatadrawer.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence

'use strict'

import React from 'react'

import { withStyles, createStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import Icon from '@material-ui/core/Icon'

import ResizeTab from '../common/generalresizetab.view'

let styles = createStyles({
   root: {
        backgroundColor:'white',
        height:'calc(100% - 19px)',
        padding:'3px',
        paddingTop:'16px',
        position:'absolute',
        top:'0',
        zIndex:1,
        transition:'right .25s',
        borderLeft:'1px solid silver',
   },
   button:{
       position:'absolute',
       top:'0',
       right:'0',
       zIndex:1,
   },
   moniker:{
       fontSize:'x-small',
       fontStyle:'italic',
       position:'absolute',
       top:'0',
       left:'0',
       padding:'3px',
   }
})

class QuadDataDrawer extends React.Component<any,any>  {

    constructor(props) {
        super(props)

        this.datadrawerelement = React.createRef()
    }

    state = {
        width:300,
        right:-310,
    }

    datadrawerelement

    componentDidMount() {
        this.assertOpen(this.props.open)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.open != this.props.open) {
            this.assertOpen(this.props.open)
        }
    }

    assertOpen = (open) => {

        let right

        if (open) {
            right = 0
        } else {
            right = -(this.state.width + 10 + 26) // for padding and resize tab
        }

        this.setState({
            right,
        })

    }

    render() {
        let { classes } = this.props
        return (
        <div style = {
            {
                 width:this.state.width + 'px',
                 right:this.state.right + 'px',
            }}
            className = {classes.root}
            ref = { this.datadrawerelement }
            data-name = 'data-drawer'
        >
            <ResizeTab orientation = 'left' />
            <div className = {classes.moniker}>data shelf</div>
            <IconButton
                 className = { classes.button }
                 onClick = { this.props.handleClose }
            >
                <Icon>close</Icon>
            </IconButton>
            { this.props.children }
        </div>
        )
   }

}

export default withStyles(styles)(QuadDataDrawer)
