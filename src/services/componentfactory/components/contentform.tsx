// baseform.view.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

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
    This is created in componentFactory based on data in type ui json
    See import of forms in componentFactory module
*/

const styles = (theme) => createStyles({ // export ??
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

const styleselections = {
    controlbar:{
        border:'none',
    }
}

interface ContentFormProps {
    children:any, 
    namespace:FactoryNamespace, // document details and controller resources
    documentmap:GenericObject, // maps form values to document properties
    groups:GenericObject, // high level of fieldset grouping (optional)
    fieldsets:GenericObject, // immediate fieldset groupings of fields (optional)
    classes?:any, // contributed by HOC withStyles (see bottom of file)
    disabled?:boolean,
}

class ContentForm extends React.Component<ContentFormProps,any> {

    constructor(props) {
        super(props)

        // initialize instance values
        let { namespace, documentmap, fieldsets, groups }:{namespace:FactoryNamespace,documentmap:any,fieldsets:any,groups:any} = props
        // namespace.local = this
        let registerCallbacks = namespace && namespace.controller.registercalldowns
        let registerGetEditingState = namespace && namespace.controller.registerGetEditingState

        // reserve for later
        this.fieldsetspecs = fieldsets || []
        this.groupspecs = groups || []

        // to participate in multiple concurrent postings (transaction wrapped)
        registerCallbacks && registerCallbacks({getPostMessage:this.getPostMessage, instanceid:namespace.docproxy.instanceid})
        registerGetEditingState && registerGetEditingState({getEditingState:this.getEditingState, instanceid:namespace.docproxy.instanceid})
        // anticipate posting as an option for caller
        this.formcontext = {
            documentmap,
            namespace,
            form:this,
        }

    }

    state = {
        values:{}, // see onChange -- maintains state of editable fields
        dirty:false,
        isediting:false,
    }

    // instantiation properties

    fieldsetspecs // defailts to []
    groupspecs // defaults to []

    // processing properties
    fieldsetchildren = {}
    defaultfieldsetchildren = []
    groupchildren = {}

    formcontext // as initialized in the constructor

    methods = {
        
    }

    // ---------------------------------[ preparation ]--------------------------

    componentDidMount() {

        // preprocess fieldsets
        for (let fieldset of this.fieldsetspecs) {
            this.fieldsetchildren[fieldset.name] = []
        }

        let editablevalues = this.processChildren(this.props.children)

        // initialize state
        this.setState({
            values:editablevalues,
        })

        // setTimeout(()=> {
        //     console.log('contentform componentDidMount:this.formcontext', this.formcontext)
        // })

    }

    // add onChange to editable children
    // sort fields by fieldsets
    // return list of editable values
    processChildren = children => {

        // initialize field values for state
        let editablevalues = {} as any

        // normalize to array
        if (!Array.isArray(children)) {
            children = [ children ]
        }

        // get list of editable values, by name of field (therefore names must be unique)
        for (let child of children) {

            if (child.props['data-attributes'] && child.props['data-attributes'].setvalue) {
                editablevalues[child.props.name] = child.props.value
            }
            child = this.integrateNode(child)

            this.assignNodeToFieldset(child)

        }

        // editablevalues = return set of fields for assignment to this.state
        return editablevalues
    }

    getDirtyState = () => {
        return this.state.dirty
    }

    // add onChange event handler to editable nodes
    integrateNode = node => {
        let localnode = node

        if (localnode.props['data-attributes']) {
            
            if (localnode.props['data-attributes'].trackvalue) {

                localnode = React.cloneElement(localnode,{
                    onChange:this.onChangeValue})

            }

        }

        return localnode

    }

    // assign nodes to named fieldsets
    assignNodeToFieldset = node => {

        let fieldset = node.props['data-attributes'] && node.props['data-attributes'].fieldset

        if (!fieldset) {

            this.defaultfieldsetchildren.push(node)

        } else {

            if (!this.fieldsetchildren[fieldset]) {

                console.log('assignNodeToFieldset: fieldset not found; assigning to default',fieldset, this.fieldsetchildren)
                this.defaultfieldsetchildren.push(node)

            } else {

                this.fieldsetchildren[fieldset].push(node)

            }

        }

    }

    // ----------------------------[ render resources ]----------------------------------

    // refresh fieldset component values by
    // stepping through components by fieldset
    assembleDisplayComponents = (classes) => {

        let displaycomponents = []
        let groupcomponents = {}
        for (let group of this.groupspecs) {
            groupcomponents[group.name] = []
        }

        // update default area field values
        if (this.defaultfieldsetchildren.length) {

            this.defaultfieldsetchildren = this.updateFieldsetElementValues(this.defaultfieldsetchildren)

            let component = <div key = '__default__'>
                {this.defaultfieldsetchildren}
            </div>

            displaycomponents.push(component)

        }

        // update fieldset field values
        if (this.fieldsetspecs) {

            for (let fieldsetspec of this.fieldsetspecs) {
                this.fieldsetchildren[fieldsetspec.name] = this.updateFieldsetElementValues(this.fieldsetchildren[fieldsetspec.name])
                let styleselection = fieldsetspec.styleselection
                let component = <fieldset 
                    key = {fieldsetspec.name} 
                    className = {classes && classes.fieldset}
                    disabled = {this.props.disabled}
                    style = {styleselections[styleselection] || null}
                >
                    {fieldsetspec.legend && <legend>{fieldsetspec.legend}</legend>}
                    {this.fieldsetchildren[fieldsetspec.name]}
                </fieldset>

                let { group } = fieldsetspec
                if (group) {
                    groupcomponents[group].push(component)
                } else {
                    displaycomponents.push(component)
                }
            }
        }

        // add group components (assigned above)
        for (let group of this.groupspecs) {
            let component = <ContentGroup key = {'group-' + group.name} open = {group.open} title = {group.title}>
                {groupcomponents[group.name]}
            </ContentGroup>
            displaycomponents.push(component)
        }

        return displaycomponents
    }

    updateFieldsetElementValues = fieldlist => {

        if (!fieldlist) return null

        let newchildren = []

        // update changed element values
        for (let element of fieldlist) {
            if (element.props['data-attributes'] && element.props['data-attributes'].trackvalue) {

                let statevalue = this.state.values[element.props.name]
                let elementvalue = element.props.value
                if (!Object.is(elementvalue,statevalue)) {
                    element = React.cloneElement(element,{value:statevalue})
                }

            }

            if (element.props['data-attributes'] && 
                element.props['data-attributes'].assignments) {
                let assignments = element.props['data-attributes'].assignments
                let properties = {}
                for (let property in assignments) {
                    let instruction = assignments[property]
                    let value
                    switch (instruction) {
                        case 'notdirtyflag':{
                            value = !this.state.dirty
                            break
                        }
                        case 'isediting': {
                            value = this.state.isediting
                            break
                        }
                        properties[property] = value
                    }
                }
                element = React.cloneElement(element,properties)
                // if (element.props['data-attributes'].assignments.disabled) {
                //     let instruction = element.props['data-attributes'].assignments.disabled
                //     if (instruction == 'notdirtyflag') {
                //         element = React.cloneElement(element,{disabled:!this.state.dirty})
                //     }
                // }
                // }
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

    getEditingState = () => {
        return this.state.dirty
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

    doSubmit = event => {

        const { namespace, disabled } = this.props
        event.preventDefault()

        if (!disabled) {
            try { // ... try = lazy :-(
                namespace.controller.callbacks.submit && 
                namespace.controller.callbacks.submit(this.getPostMessage())
            } catch(e) {
                // no action - simplifies checks above
                console.log('onSubmit namespace parsing for callback failed', this)
            }

        }
    }

    render() {
        const { classes } = this.props

        return (
            <form 
                onSubmit = {this.doSubmit}
                className = { classes.root } 
                autoComplete = "off" 
            > 

                {this.assembleDisplayComponents(classes)}

            </form>
        )
    }

}

export default withStyles( styles )( ContentForm )
// export default ContentForm
