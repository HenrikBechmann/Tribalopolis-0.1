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
    flexDirection:'column',
    alignItems:'baseline',
  },
  button:{
      margin:theme.spacing.unit,
  }
})

class ContentBaseForm extends React.Component<any,any> {

    state = {
        values:{},
    }

    localchildren

    iseditable = false

    length = Array.isArray(this.props.children)?this.props.children.length:this.props.children?1:0

    componentWillMount() {

        let { children } = this.props

        console.log('ContentBaseForm children',children)

        let isarray = Array.isArray(children) 

        if (!isarray && this.length) {
            let node = children as React.ReactElement
            this.iseditable = !!(node.props && node.props.readonly)
            node = React.cloneElement(node,{onChange:this.onChangeValue})
            this.localchildren = node
        } else {
            this.localchildren = []
            for (let node of children as Array<React.ReactElement>) {
                if (!node.props.readonly) {
                    !this.iseditable && (this.iseditable = true)
                    node = React.cloneElement(node,{onChange:this.onChangeValue})
                }
                this.localchildren.push(node)
            }
        }
    }

    onChangeValue = event => {

        let { values } = this.state
        values[event.target.name] = event.target.value
        console.log('values',values)
        this.setState({ values })    

    }

    render() {
        const { classes, onSubmit, disabled } = this.props

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
                {this.length?<fieldset style = {{marginBottom:'8px'}} disabled = {disabled}>
                    { this.localchildren }
                </fieldset>:null}
                {this.iseditable?<Button 
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
