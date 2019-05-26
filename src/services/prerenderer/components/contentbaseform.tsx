// baseform.view.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

import merge from 'deepmerge'
import utlities from '../../../utilities/utilities'

import { withStyles, createStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

import application from '../../application'
import ContentGroup from './contentgroup'

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
      margin:theme.spacing(1),
  },
  fieldset: {
      marginBottom:'8px', 
      width:'calc(100% - 32px)',
  }
})

class ContentBaseForm extends React.Component<any,any> {

    constructor(props) {
        super(props)
        // initialize state values
        let { children, context, documentmap, fieldsets, groups } = props

        // initialize field values for state
        let values = {} as any
        if (!Array.isArray(children)) {
            values[children.props.name] = children.props.value
        } else {
            // console.log('constructor children',children)
            for (let child of children) {
                if (!child.props.readonly && !child.props['data-static']) {
                    values[child.props.name] = child.props.value
                }
            }
        }
        this.state.values = values

        // save props to class
        if (context) {this.formcontext = context}
        this.documentmap = documentmap
        this.fieldsetprops = fieldsets || []
        this.groupprops = groups || []

    }

    state = {
        values:{},
        dirty:false,
    }

    localchildren
    formcontext
    documentmap
    fieldsetprops
    fieldsets = {}
    defaultfieldset = []
    groupprops
    groups = {}
    defaultgroup = []

    iseditable = false

    length = Array.isArray(this.props.children)?this.props.children.length:this.props.children?1:0

    componentWillMount() {

        // add onChange to editable children
        // sort fields by fieldsets
        let { children } = this.props

        let isarray = Array.isArray(children) 

        if (!isarray && this.length) {
            let node = children as React.ReactElement
            node = this.getAdjustedNode(node)
            this.assignNode(node)
            this.localchildren = node
        } else {
            this.localchildren = []
            for (let node of children as Array<React.ReactElement>) {

                node = this.getAdjustedNode(node)
                this.assignNode(node)

            }
        }
    }

    // add onChange event handler to editable nodes
    getAdjustedNode = node => {
        let localnode = node
        if (!localnode.props.readonly && !localnode.props['data-static']) {
            !this.iseditable && (this.iseditable = true)

            localnode = React.cloneElement(localnode,{
                onChange:this.onChangeValue})

        }
        return localnode
    }

    // assign nodes to named fieldsets
    assignNode = node => {

        let fieldset = node.props['data-fieldset']

        if (!fieldset) {

            this.defaultfieldset.push(node)

        } else {

            if (!this.fieldsets[fieldset]) {

                this.fieldsets[fieldset] = []

            }
            this.fieldsets[fieldset].push(node)

        }

    }

    // refresh fieldset component values
    getDisplayComponents = (classes) => {

        let displaycomponents = []
        let groupcomponents = {}
        for (let groupobj of this.groupprops) {
            groupcomponents[groupobj.name] = []
        }

        if (this.defaultfieldset.length) {

            this.defaultfieldset = this.getFieldsetValues(this.defaultfieldset)

            let component = <div key = '__default__'>
                {this.defaultfieldset}
            </div>

            displaycomponents.push(component)

        }

        if (this.fieldsetprops) {

            for (let fieldsetobj of this.fieldsetprops) {
                let { group } = fieldsetobj
                this.fieldsets[fieldsetobj.name] = this.getFieldsetValues(this.fieldsets[fieldsetobj.name])

                let component = <fieldset 
                    key = {fieldsetobj.name} 
                    className = {classes.fieldset}
                    disabled = {this.props.disabled}
                >
                    {fieldsetobj.legend && <legend>{fieldsetobj.legend}</legend>}
                    {this.fieldsets[fieldsetobj.name]}
                </fieldset>
                if (group) {
                    groupcomponents[group].push(component)
                } else {
                    displaycomponents.push(component)
                }
            }
        }

        for (let groupobj of this.groupprops) {
            let component = <ContentGroup key = {'group-' + groupobj.name} open = {groupobj.open} title = {groupobj.title}>
                {groupcomponents[groupobj.name]}
            </ContentGroup>
            displaycomponents.push(component)
        }

        return displaycomponents
    }

    getFieldsetValues = fieldlist => {
        if (!fieldlist) return null
        let newchildren = []
        // update changed element values
        for (let element of fieldlist) {
            if (!element.props.readonly && !element.props['data-static']) {
                let statevalue = this.state.values[element.props.name]
                let elementvalue = element.props.value
                if (!Object.is(elementvalue,statevalue)) {
                    element = React.cloneElement(element,{value:statevalue})
                }
            }
            newchildren.push(element)
        }
        return newchildren
    }

    onSubmit = () => {

        // console.log('onSubmit',this.state, this.formcontext, this.props.context)
        // let document = merge({},this.formcontext.document)
        let document = this.formcontext.document

        for (let valueindex in this.state.values) {
            // console.log('valueindex, documentmap, state.values',valueindex,this.documentmap, this.state.values)
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
        // console.log('event onChangeValue',event.target.name,event.target.value, values)
        this.setState({ values, dirty:true })    

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
                {this.getDisplayComponents(classes)}
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
