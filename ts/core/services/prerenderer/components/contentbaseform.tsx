// baseform.view.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

import { withStyles, createStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

/*
    patterned after first demo https://material-ui.com/demos/selects/ for 3.03
    use Typsecript fixes from here: https://material-ui.com/guides/typescript/
*/

const styles = (theme) => createStyles({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems:'baseline',
  },
  button:{
      margin:theme.spacing.unit,
  }
})

class ContentBaseForm extends React.Component<any,any> {

    render() {
        const { classes, onSubmit, disabled, children } = this.props

        console.log('ContentBaseForm children',children)

        let isarray = Array.isArray(children) 
        let length = Array.isArray(children)?children.length:children?1:0

        let iseditable = false
        if (!isarray && length) {
            let node = children as React.ReactElement
            iseditable = !!(node.props && node.props.readonly)
        } else {
            for (let node of children as Array<React.ReactElement>) {
                if (!node.props.readonly) {
                    iseditable = true
                    break
                }
            }
        }

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
                {length?<fieldset style = {{marginBottom:'8px'}} disabled = {disabled}>
                    { this.props.children }
                </fieldset>:null}
                {iseditable?<Button 
                    className = {classes.button}
                    color = "primary" 
                    variant = "contained" 
                    type="submit">
                        Save
                    </Button>
                :null}
            </form>
        )
    }

}

export default withStyles( styles )( ContentBaseForm )
