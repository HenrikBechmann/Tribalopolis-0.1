// baseform.view.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

import { withStyles, createStyles } from '@material-ui/core/styles'

/*
    patterned after first demo https://material-ui.com/demos/selects/ for 3.03
    use Typsecript fixes from here: https://material-ui.com/guides/typescript/
*/

const styles = () => createStyles({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems:'baseline',
  },
})

class ContentBaseForm extends React.Component<any,any> {

    render() {
        const { classes, onSubmit, disabled, children } = this.props

        console.log('ContentBaseForm children',children)

        // let length = Array.isArray(children)?

        return (
            <form 
                onSubmit = {event => {
                    event.preventDefault()
                    if (!disabled) {
                        onSubmit && onSubmit()
                    }
                }}
                className = { classes && classes.root } 
                autoComplete = "off" 
            > 
                {children.length?<fieldset disabled = {disabled}>
                    { this.props.children }
                </fieldset>:null}
            </form>
        )
    }

}

export default withStyles( styles )( ContentBaseForm )
