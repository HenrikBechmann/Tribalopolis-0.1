// baseform.view.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

// import merge from 'deepmerge'
import utlities from '../../../utilities/utilities'

import { withStyles, createStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

import { PostFormMessage } from '../../interfaces'

import application from '../../application'
import ContentGroup from './contentgroup'

import { toast } from 'react-toastify'

/*
    TODO:
    add setupPostDocument message to send to contentbase form, to configure 
    responses to user.
    reconcile with registerCalldowns
*/
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
        let { children, context, documentmap, fieldsets, groups, registerCallbacks, setupPostDocument } = props

        // save props to class
        if (context) {this.documentcontext = context}
        this.documentmap = documentmap
        this.fieldsetprops = fieldsets || []
        this.groupprops = groups || []

        registerCallbacks && registerCallbacks({getPostMessage:this.getPostMessage})

        this.formcontext = {
            documentmap:this.documentmap,
            state:this.state,
            documentcontext:this.documentcontext,
            form:this,
        }

    }

    state = {
        values:{},
        dirty:false,
    }

    localchildren
    documentcontext
    documentmap
    formcontext
    fieldsetprops
    fieldsets = {}
    defaultfieldset = []
    groupprops
    groups = {}
    defaultgroup = []

    iseditable = false

    length = Array.isArray(this.props.children)?this.props.children.length:this.props.children?1:0

    componentDidMount() {

        // add onChange to editable children
        // sort fields by fieldsets

        let children:any = this.props.children

        // initialize field values for state
        let values = {} as any
        if (!Array.isArray(children)) {
            let props:any = children.props
            values[children.props.name] = children.props.value
        } else {
            // console.log('constructor children',children)
            for (let child of children) {
                if (!child.props.readonly && !child.props['data-static']) {
                    values[child.props.name] = child.props.value
                }
            }
        }

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
        this.setState({
            values,
        })

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

    getPostMessage = () => {
        this.formcontext.state = this.state
        let message:PostFormMessage = {
            formcontext:this.formcontext,
            success:this.onSubmitSuccess,
            failure:this.onSubmitFailure,
        }
        return message
    }

    onSubmit = () => {

        // let document = merge({},this.documentcontext.document)
        let { document, type } = this.documentcontext

        for (let valueindex in this.state.values) {
            // console.log('valueindex, documentmap, state.values',valueindex,this.documentmap, this.state.values)
            let path = this.documentmap[valueindex].split('.')
            // console.log('document, path',document, path)
            let nodespecs = utlities.getNodePosition(document,path)
            let value = this.state.values[valueindex]
            let datatype
            if (value === undefined) value = null;
            [value,datatype] = application.filterDataOutgoingValue(value, path, type)
            nodespecs.nodeproperty[nodespecs.nodeindex] = value
        } 

        let message = {
            document,
            reference:this.documentcontext.props.reference,
            success:this.onSubmitSuccess,
            failure:this.onSubmitFailure,
        }

        application.setDocument(message)
        this.setState({
            dirty:false
        })

    }

    onSubmitSuccess = () => {
        toast.success('document has been posted')
        return true
    }

    onSubmitFailure = () => {
        toast.error('document posting has failed')
        return true
    }

    onChangeValue = event => {
        let { values } = this.state
        values[event.target.name] = event.target.value

        this.setState({ values, dirty:true })    

    }

    render() {
        const { classes, context, disabled } = this.props

        return (
            <form 
                onSubmit = {event => {

                    event.preventDefault()

                    if (!disabled) {

                        context && context.controller.callbacks.submit 
                        && context.controller.callbacks.submit(this.getPostMessage())

                    }

                }}
                className = { classes && classes.root } 
                autoComplete = "off" 
            > 
                {this.getDisplayComponents(classes)}
            </form>
        )
    }

}

// {false && this.iseditable?<Button 
//     onClick = {this.onSubmit}
//     disabled = {!this.state.dirty}
//     className = {classes.button}
//     color = "primary" 
//     variant = "contained" 
//     type="submit">
//         Save
//     </Button>
// :null}

export default withStyles( styles )( ContentBaseForm )
