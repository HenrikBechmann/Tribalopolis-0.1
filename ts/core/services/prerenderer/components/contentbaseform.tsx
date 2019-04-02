// baseform.view.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

import merge from 'deepmerge'
import utlities from '../../../utilities/utilities'

import { withStyles, createStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

import application from '../../application'

import { toast } from 'react-toastify'

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

    constructor(props) {
        super(props)
        // initialize state values
        let { children, context, documentmap } = props
        let values = {} as any
        if (!Array.isArray(children)) {
            values[children.props.name] = children.props.value
        } else {
            for (let child of children) {
                if (!child.props.readonly) {
                    values[child.props.name] = child.props.value
                }
            }
        }
        this.state.values = values
        if (context) {this.formcontext = context}
        this.documentmap = documentmap

    }

    state = {
        values:{},
        dirty:false,
    }

    localchildren
    formcontext
    documentmap

    iseditable = false

    length = Array.isArray(this.props.children)?this.props.children.length:this.props.children?1:0

    componentWillMount() {

        // console.log('props, formcontext, state in form will mount',this.props, this.formcontext, this.state)

        // add onChange to editable children
        let { children } = this.props

        let isarray = Array.isArray(children) 

        if (!isarray && this.length) {
            let node = children as React.ReactElement
            this.iseditable = !!(node.props && node.props.readonly)
            if (!node.props.readonly) {
                node = React.cloneElement(node,{onChange:this.onChangeValue})
            }
            this.localchildren = node
        } else {
            this.localchildren = []
            for (let node of children as Array<React.ReactElement>) {

                if (!node.props.readonly) {
                    !this.iseditable && (this.iseditable = true)

                    node = React.cloneElement(node,{
                        onChange:this.onChangeValue})

                }
                this.localchildren.push(node)
            }
        }
    }

    onSubmit = () => {

        // console.log('onSubmit',this.formcontext, this.props.context)
        let document = merge({},this.formcontext.document)

        for (let valueindex in this.state.values) {
            // console.log('valueindex, documentmap',valueindex,this.documentmap)
            let path = this.documentmap[valueindex].split('.')
            // console.log('document, path',document, path)
            let nodespecs = utlities.getNodePosition(document,path)
            let value = this.state.values[valueindex]
            if (value === undefined) value = null
            nodespecs.nodeproperty[nodespecs.nodeindex] = value
        } 

        // console.log('document after update',document)

        let message = {
            document,
            reference:this.formcontext.props.reference,
            success:this.onSubmitSuccess,
            failure:this.onSubmitFailure,
        }

        this.setState({
            dirty:false
        })
        application.setDocument(message)

    }

    onSubmitSuccess = () => {
        toast.success('document has been posted')
    }

    onSubmitFailure = () => {
        toast.error('document posting has failed')
    }

    onChangeValue = event => {

        let { values } = this.state
        values[event.target.name] = event.target.value
        this.setState({ values, dirty:true })    

    }

    render() {
        const { classes, onSubmit, disabled } = this.props
        let newchildren = []
        // update changed element values
        for (let element of this.localchildren) {
            if (!element.props.readonly) {
                let statevalue = this.state.values[element.props.name]
                let elementvalue = element.props.value
                if (!Object.is(elementvalue,statevalue)) {
                    element = React.cloneElement(element,{value:statevalue})
                }
            }
            newchildren.push(element)
        }
        this.localchildren = newchildren

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
                    {this.props.legend?<legend>{this.props.legend}</legend>:null}
                    { this.localchildren }
                </fieldset>:null}
                {this.iseditable?<Button 
                    onClick = {this.onSubmit}
                    disabled = {!this.state.dirty}
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
