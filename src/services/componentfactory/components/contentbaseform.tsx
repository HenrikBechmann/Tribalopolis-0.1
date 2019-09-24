// baseform.view.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

// import merge from 'deepmerge'
import utlities from '../../../utilities/utilities'

import { withStyles, createStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

import { 
    PostFormMessage,
    GenericObject,
    FactoryNamespace,
} from '../../interfaces'

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
    This is created in componentFactory based on data in type ui json
    See import of forms in componentFactory module
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

interface ContentBaseFormProps {
    children:any, 
    namespace:FactoryNamespace, 
    documentmap:GenericObject, 
    groups:GenericObject, 
    fieldsets:GenericObject, 
    classes?:any,
    disabled?:boolean,
}

class ContentBaseForm extends React.Component<ContentBaseFormProps,any> {

    constructor(props) {
        super(props)

        // console.log('ContentBaseForm:props',props)
        // initialize instance values
        let { namespace, documentmap, fieldsets, groups } = props
        let registerCallbacks = namespace && namespace.registerCallbacks

        // reserve for later
        this.fieldsetspecs = fieldsets || []
        this.groupspecs = groups || []

        registerCallbacks && registerCallbacks({getPostMessage:this.getPostMessage, instanceid:namespace.docproxy.instanceid})

        // anticipate posting as an option for caller
        this.formcontext = {
            documentmap:documentmap,
            namespace:namespace,
            form:this,
        }

    }

    state = {
        values:{},
        dirty:false,
    }

    // instantiation class properties
    fieldsetspecs
    groupspecs
    formcontext

    // processing class properties
    fieldsets = {}
    defaultfieldset = []
    groups = {}

    componentDidMount() {

        // preprocess fieldsets and groups
        this.organizefieldsets()
        // add onChange to editable children
        // sort fields by fieldsets
        let values = this.processChildren(this.props.children)

        this.setState({
            values,
        })

    }

    organizefieldsets = () => {

    }

    processChildren = children => {

        // initialize field values for state
        let values = {} as any
        if (!Array.isArray(children)) {
            children = [ children ]
        }

        for (let child of children) {

            if (child.props['data-attributes'] && child.props['data-attributes'].trackvalue) {
                values[child.props.name] = child.props.value
            }

        }

        for (let node of children as Array<React.ReactElement>) {

            node = this.assignOnChangeToNode(node)
            this.assignNodeToFieldsets(node)

        }

        return values
    }

    // add onChange event handler to editable nodes
    assignOnChangeToNode = node => {
        let localnode = node

        if (localnode.props['data-attributes'] && localnode.props['data-attributes'].trackvalue) {

            localnode = React.cloneElement(localnode,{
                onChange:this.onChangeValue})

        }

        return localnode

    }

    // assign nodes to named fieldsets
    assignNodeToFieldsets = node => {

        let fieldset = node.props['data-attributes'] && node.props['data-attributes'].fieldset

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
        for (let group of this.groupspecs) {
            groupcomponents[group.name] = []
        }

        if (this.defaultfieldset.length) {

            this.defaultfieldset = this.getFieldsetValues(this.defaultfieldset)

            let component = <div key = '__default__'>
                {this.defaultfieldset}
            </div>

            displaycomponents.push(component)

        }

        if (this.fieldsetspecs) {

            for (let fieldset of this.fieldsetspecs) {
                let { group } = fieldset
                this.fieldsets[fieldset.name] = this.getFieldsetValues(this.fieldsets[fieldset.name])

                let component = <fieldset 
                    key = {fieldset.name} 
                    className = {classes.fieldset}
                    disabled = {this.props.disabled}
                >
                    {fieldset.legend && <legend>{fieldset.legend}</legend>}
                    {this.fieldsets[fieldset.name]}
                </fieldset>
                if (group) {
                    groupcomponents[group].push(component)
                } else {
                    displaycomponents.push(component)
                }
            }
        }

        for (let group of this.groupspecs) {
            let component = <ContentGroup key = {'group-' + group.name} open = {group.open} title = {group.title}>
                {groupcomponents[group.name]}
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
            if (element.props['data-attributes'] && element.props['data-attributes'].trackvalue) {
            // if (!element.props.readonly && !element.props['data-static']) {
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

    onSubmitSuccess = () => {
        toast.success('document has been posted')
        return true
    }

    onSubmitFailure = () => {
        toast.error('document posting has failed')
        return false
    }

    onChangeValue = event => {
        let { values } = this.state
        values[event.target.name] = event.target.value

        this.setState({ values, dirty:true })    

    }

    render() {
        const { classes, namespace, disabled } = this.props

        return (
            <form 
                onSubmit = {event => {

                    event.preventDefault()

                    if (!disabled) {

                        namespace && 
                        namespace.controller && 
                        namespace.controller.callbacks && 
                        namespace.controller.callbacks.submit && 
                        namespace.controller.callbacks.submit(this.getPostMessage())

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

export default withStyles( styles )( ContentBaseForm )
