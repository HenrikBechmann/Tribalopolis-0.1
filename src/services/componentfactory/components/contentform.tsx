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
import utilities from '../../../utilities/utilities'

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
    },
    titlebar: {
        border:'none',
    },
    standardbar: {
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
}

class ContentForm extends React.Component<ContentFormProps,any> {

    constructor(props) {
        super(props)

        console.log('ContentForm:props',this.props)

        // initialize instance values
        let { namespace, documentmap, fieldsets, groups }:{namespace:FactoryNamespace,documentmap:any,fieldsets:any,groups:any} = props

        let localnamespace = namespace && Object.assign({},namespace)
        if (localnamespace) {
            localnamespace.caller = {
                toggleEditMode:this.toggleEditMode,
                resetValues:this.resetValues,
            }
            localnamespace.local = this
        }
        this.localnamespace = localnamespace

        // reserve for later
        this.fieldsetspecs = fieldsets || []
        this.groupspecs = groups || []

        let registerCalldowns = localnamespace && localnamespace.agent.registerCalldowns
        let monitorEditState = localnamespace && localnamespace.agent.callbacks.monitorEditState
        // to participate in multiple concurrent postings (transaction wrapped)
        registerCalldowns && registerCalldowns(
            {
                getEditingState:this.getEditingState, 
                getPostMessage:this.getPostMessage,
                refresh:this.refresh,
                instanceid:localnamespace.docproxy.instanceid,
            }
        )

        let instanceid = this.instanceid = localnamespace && localnamespace.docproxy.instanceid
        monitorEditState && monitorEditState(instanceid,this.state.isediting)
        
        // anticipate posting as an option for caller
        this.formcontext = {
            documentmap,
            namespace:localnamespace,
            form:this,
        }

        this.monitorEditState = monitorEditState

        // this.formref = React.createRef()

    }

    state = {
        values:{}, // see onChange -- maintains state of editable fields
        dirty:false,
        isediting:false,
        isprocessing:false,
    }

    // instantiation properties

    localnamespace
    monitorEditState
    instanceid

    fieldsetspecs // defailts to []
    groupspecs // defaults to []

    // processing properties
    fieldsetchildren = {}
    // defaultfieldsetchildren = []
    groupchildren = {}

    formcontext // as initialized in the constructor
    // formref

    originaleditablevalues

    // ---------------------------------[ preparation ]--------------------------

    componentDidMount() {
        // preprocess fieldsets
        this.initialize()
    }

    refresh = () => {
        console.log('refreshing form',this.localnamespace)
        this.forceUpdate()
    }

    initialize = () => {

        for (let fieldset of this.fieldsetspecs) {
            this.fieldsetchildren[fieldset.name] = []
        }
        // console.log('fieldsetchildren',this.fieldsetchildren)

        let editablevalues = this.integrateChildren(this.props.children)

        this.originaleditablevalues = Object.assign({},editablevalues)
        // initialize state
        this.setState({
            values:editablevalues,
        })

    }

    // add onChange to editable children
    // sort fields by fieldsets
    // return list of editable values
    integrateChildren = children => {

        // initialize field values for state
        let editablevalues = {} as any

        // normalize to array
        if (!Array.isArray(children)) {
            children = [ children ]
        }

        children = utilities.integrateComponents(children,this.localnamespace)

        // get list of editable values, by name of field (therefore names must be unique)
        for (let child of children) {
            let attributes = child.props && child.props['data-attributes']
            if (attributes && attributes.setup) {
                let setup = attributes.setup
                let instructions = setup.instructions
                if (instructions) {
                    let setvalue = (instructions.indexOf('setvalue') > -1)
                    if (setvalue) {
                        editablevalues[child.props.name] = child.props.value
                    }
                }
                child = this.integrateNode(child, setup)
            }

            this.assignNodeToFieldset(child, attributes)

        }

        // editablevalues = return set of fields for assignment to this.state
        return editablevalues
    }
    // add onChange event handler to editable nodes
    integrateNode = (node,setup) => {
        let localnode = node
        let instructions = setup.instructions
        if (instructions) {
            let trackvalue = (instructions.indexOf('trackvalue') > -1)
            if (trackvalue) {
                localnode = React.cloneElement(
                    localnode,
                    {onChange:this.onChangeValue}
                )
            }
        }

        return localnode

    }

    // assign nodes to named fieldsets
    assignNodeToFieldset = (node, attributes) => {

        let fieldsetname = attributes && attributes.fieldset

        // console.log('assignNodeToFieldset:node, attributes',node,attributes,fieldsetname)

        if (!fieldsetname) {

            console.log('error: no fieldsetname',node, attributes)
            return
            // this.defaultfieldsetchildren.push(node)

        } else {

            if (!this.fieldsetchildren[fieldsetname]) {

                console.log('assignNodeToFieldset: fieldset not found; ',fieldsetname, this.fieldsetchildren)
                return
                // this.defaultfieldsetchildren.push(node)

            } else {

                this.fieldsetchildren[fieldsetname].push(node)
                // console.log('fieldsetname matched',fieldsetname, this.fieldsetchildren)

            }

        }

    }

    resetValues = () => {
        if (!this.state.dirty) {
            toast.info('no values were changed, so none were reset')
        } else {
            this.setState((state) => {

                return {
                    values:this.originaleditablevalues,
                    dirty:false,
                }

            })
            toast.info('changed values have been reset')
        }
        this.toggleEditMode()
    }

    toggleEditMode = () => {
        this.setState((state) => {
            return {
                isediting:!state.isediting
            }
        }, () => {
            this.monitorEditState(this.instanceid,this.state.isediting)
        })
    }

    // getDirtyState = () => {
    //     return this.state.dirty
    // }

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

    // ----------------------------[ render resources ]----------------------------------

    // refresh fieldset component values by
    // stepping through components by fieldset
    assembleDisplayComponents = (classes) => {

        let displaycomponents = []
        let groupcomponents = {}
        for (let group of this.groupspecs) {
            groupcomponents[group.name] = []
        }

        // update fieldset field values
        if (this.fieldsetspecs) {

            for (let fieldsetspec of this.fieldsetspecs) {
                // console.log('assembleDisplayComponents: fieldsetspec,this.fieldsetchildren',fieldsetspec, this.fieldsetchildren)
                this.fieldsetchildren[fieldsetspec.name] = this.updateFieldsetElementValues(this.fieldsetchildren[fieldsetspec.name])
                let styleselection = fieldsetspec.styleselection
                let component = <fieldset 
                    key = {fieldsetspec.name} 
                    className = {classes && classes.fieldset}
                    disabled = {fieldsetspec.candisable && !this.state.isediting}
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

        // console.log('assembleDisplayComponents: displaycomponents',displaycomponents)

        return displaycomponents
    }

    updateFieldsetElementValues = fieldlist => {

        if (!fieldlist) return null

        // let newchildren = []

        let newchildren = utilities.updateComponents(fieldlist,this.localnamespace)

        return newchildren

    }

    onSubmitSuccess = () => {
        this.setState({
            isprocessing:false,
        })
        this.toggleEditMode()
        this.originaleditablevalues = Object.assign({},this.state.values)
        toast.success('document has been posted')
        return true
    }

    onSubmitFailure = () => {
        toast.error('document posting has failed')
        this.setState({
            isprocessing:false,
        })
        return false
    }

    onChangeValue = event => {
        let { values } = this.state
        values[event.target.name] = event.target.value

        this.setState({ values, dirty:true })    

    }

    doSubmit = event => {

        event.preventDefault()
        let namespace = this.localnamespace

        if (this.state.dirty) {
            this.setState({
                isprocessing:true,
            })
            try { // ... try = lazy :-(
                // setTimeout(() => { // for testing!
                    namespace.controller.callbacks.submit && 
                    namespace.controller.callbacks.submit(this.getPostMessage())
                // },2000)
            } catch(e) {
                // no action - simplifies checks above
                console.log('onSubmit namespace parsing for callback failed', this)
            }

        } else {
            this.toggleEditMode()
            toast.info('nothing has changed')
        }
    }

    render() {
        const { classes } = this.props

        console.log('contentform namespace',this.localnamespace)

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
