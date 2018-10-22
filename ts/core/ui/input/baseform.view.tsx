// baseform.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence

'use strict'

import React from 'react'

import { withStyles, createStyles, Theme } from '@material-ui/core/styles'

/*
    patterned after first demo https://material-ui.com/demos/selects/ for 3.03
    use Typsecript fixes from here: https://material-ui.com/guides/typescript/
*/

const styles = ( theme:Theme ) => createStyles({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
})

class BaseForm extends React.Component<any,any> {

    render() {
        const { classes, fetchObject, superuser } = this.props

        return (
            <form 
                onSubmit = {(event) => {
                    event.preventDefault()
                    if (superuser) {
                        fetchObject()
                    }
                }}
                className = { classes.root } 
                autoComplete="off" 
            > 
                { this.props.children }
            </form>
        )
    }

}

export default withStyles( styles )( BaseForm )
