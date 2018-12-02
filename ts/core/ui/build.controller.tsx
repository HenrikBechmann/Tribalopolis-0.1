// build.controller.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence

/*
    TODO: straighten out dom tree; currently data drawer scrolls a bit
*/

'use strict'

import React from 'react'

import Button from '@material-ui/core/Button'
import { withStyles, createStyles } from '@material-ui/core/styles'

import ReactJson from 'react-json-view'

import { toast } from 'react-toastify'

import StandardToolbar from './common/standardtoolbar.view'

import BaseForm from './input/baseform.view'
import SelectField from './input/selectfield.view'
import TextField from './input/textfield.view'

import UserDataContext from '../services/userdata.context'

import application from '../services/application'
import typefilter from '../services/type.filter'

import ActionButton from './common/actionbutton.view'
import DataDrawer from './common/datadrawer.view'
import BuildDataPane from './build/builddatapane.view'

const styles = theme => (createStyles({
    button: {
        margin: theme.spacing.unit,
    },
    panewrapper: {
        position:'absolute',
        top:'0',
        left:'0',
        paddingTop:'48px',
        overflow:'auto',
        height:'100vh',
        width:'100%'
    },
    pagewrapper: {
        position:'relative',
        height:'100vh',
    },
    jsoninput: {
        border:'1px solid gray',
        padding:'3px',
        margin:'6px',
    }

}))

class BuildController extends React.Component<any,any> {

    constructor(props) {
        super(props)
        this.buildelement = React.createRef()
        window.addEventListener('resize',this.onResize) // to reacalc datadrawer maxwidth. There may be a better way
    }

    state = {
        values:{
            collection:'types',
            id:'',
            json:'',
        },
        docpack:{
            document:{},
            id:null,
        },
        draweropen:false,
    }

    savejson = null
    latestjson = {}

    drawerdatapackage
    buildelement

    doctypepack

    onResize = () => {
        this.forceUpdate()
    }

    componentWillUnmount() {
        window.removeEventListener('resize',this.onResize)
    }

    // =================[ apply ]=========================

    applyJson = () => {

        if (!this.savejson || (confirm('replace current object?'))) {

            let data:any = this.state.values.json
            try {
                data = JSON.parse(data)
            } catch(e) {
                alert('invalid json')
                return
            }
            this.latestjson = data
            this.savejson = data
            this.setState({
                docpack:{
                    document:data,
                    id:this.state.values.id
                }
            },() => {
                if (data.identity) {
                    let typetoken = data.identity.type 
                    if (typetoken) {
                        let typeref = typetoken.reference
                        if (typeref) {
                            application.getDocument(
                                typeref,
                                this.fetchTypeSuccessCallback,
                                this.fetchTypeErrorCallback
                            )
                        }
                    }
                }
            })
        }

    }

    // =================[ fetch ]==========================

    fetchObject = () => {

        if (!this.savejson || (confirm('replace current object?'))) {

            if (!this.state.values.collection) {
                toast.error('collection required')
                return
            }

            if (this.state.values.collection && (!this.state.values.id)) {

                application.getNewDocument(
                    this.state.values.collection,
                    this.fetchSuccessCallback,
                    this.fetchErrorCallback
                )

            } else {

                application.getDocument(
                    `/${this.state.values.collection}/${this.state.values.id}`,
                    this.fetchSuccessCallback,
                    this.fetchErrorCallback
                )

            }
        }
    }

    fetchSuccessCallback = (data,id) => {

        let newobject = false
        if (!data) {
            data = {}
            toast.warn('new object')
            newobject = true
        }
        // console.log('data,id',data,id)
        this.latestjson = data
        this.savejson = data
        let values = this.state.values
        if (newobject) {
            values.id = id
        }
        this.setState({
            values,
            docpack:{
                document:data,
                id,
            }
        },() => {
            // console.log('fetch document type', id, data)
            if (data.identity) {
                let typetoken = data.identity.type 
                if (typetoken) {
                    let typeref = typetoken.reference
                    if (typeref) {
                        // console.log('typeref',typeref)
                        application.getDocument(
                            typeref,
                            this.fetchTypeSuccessCallback,
                            this.fetchTypeErrorCallback
                        )
                    }
                }
            }
        })

    }

    fetchErrorCallback = error => {
        toast.error(error)
    }

    // apply type template to document
    fetchTypeSuccessCallback = (data, id) => {
        let typepack = {
            document:data,
            id
        }
        // console.log('fetchTypeSuccessCallback', typepack)
        this.doctypepack = typepack
        toast.info('type has also been loaded (' + id + ')')

        let results = typefilter.assertType(this.state.docpack,this.doctypepack)
        // console.log('returned from assertType',results)
        if (results.changed) {
            this.latestjson = results.docpack.document
            this.savejson = results.docpack.document
            this.setState({
                docpack:results.docpack,
            })
            results.changed && toast.info('document data has been upgraded by type (' + id + ')' )
        }
        // console.log('type loaded',type)
    }

    fetchTypeErrorCallback = error => {
        toast.error('error getting type' + error)
    }

    // =================[ save/rollback ]==========================

    saveObject = () => {
        this.savejson = this.latestjson
        toast.info('object saved')
    }

    rollbackObject = () => {
        this.latestjson = this.savejson
        this.forceUpdate()
        toast.info('object was rolled back from most recent save')
    }

    // =================[ post ]==========================

    postObject = () => {
        if (confirm('Post this object?')) {
            application.setDocument(
                `/${this.state.values.collection}/${this.state.values.id}`,
                this.latestjson,
                this.postSuccessCallback,
                this.postFailureCallback
            )
        }
    }

    postSuccessCallback = () => {
        toast.info('object was successfully posted')
    }

    postFailureCallback = (error) => {
        toast.error(error)
    }

    // =================[ clear ]==========================

    clearObject = () => {
        this.savejson = null
        this.latestjson = {}
        this.setState({
            docpack:{
                data:{},
                id:null,
            }
        })
        toast.info('object was cleared')
    }

    // ==============[ ui field change responses ]================

    onChangeValue = event => {

        let { values } = this.state
        values[event.target.name] = event.target.value
        this.setState({ values })    

    }

    // ============[ data drawer responses ]=================

    callDataDrawer = (opcode, specs) => {
        if (this.state.draweropen) {
            toast.info('The data shelf is in use. Close the shelf and try again.')
            return
        }
        this.drawerdatapackage = {specs, opcode}
        this.setState({
            draweropen:true,
        })
    }

    closeDrawer = () => {
        this.drawerdatapackage = null
        this.setState({
            draweropen:false,
        })
    }

    // ===============[ render ]==================

    render() {

        // --------[ sections of the page follow ]--------

        const datadrawer = login => (
            <DataDrawer open = {this.state.draweropen}
                handleClose = {this.closeDrawer}
                containerelement = {this.buildelement}
            >
                <BuildDataPane
                    dataPack = {this.drawerdatapackage}
                    open = {this.state.draweropen}
                    user = {login}
                />
            </DataDrawer>
        )

        const inputcontrols = (superuser,classes) => (
            <BaseForm onSubmit = {this.fetchObject} disabled = {!superuser}>
                <SelectField
                    label = {'Collection'}
                    name = 'collection'
                    value = {this.state.values.collection}
                    onChange = {this.onChangeValue}
                    helperText = {'select an object to build'}
                    options = {[
                        {
                            value:'types',
                            text:'Types',
                        },
                        {
                            value:'schemes',
                            text:'Schemes',
                        },
                        {
                            value:'system',
                            text:'System',
                        },
                        {
                            value:'accounts',
                            text:'Accounts',
                        },
                        {
                            value:'users',
                            text:'Users',
                        },
                        {
                            value:'handles',
                            text:'Handles',
                        },
                        {
                            value:'pages',
                            text:'Pages',
                        },
                        {
                            value:'links',
                            text:'Links',
                        },
                    ]}
                />

                <TextField 
                    label = 'Id'
                    name = 'id'
                    value = {this.state.values.id}
                    onChange = { this.onChangeValue }
                    helperText = 'enter the id of the requested object'
                />
                <ActionButton 
                    icon = 'list'
                    action = {() => {
                            this.callDataDrawer('list',{collection:this.state.values.collection})
                        }
                    }
                />
            </BaseForm> 
        ) //--end

        const datacontrols = (superuser,classes) => (
            <React.Fragment>
            <div>
                <p>For a new object, fetch without an id</p>
                <Button 
                    type = 'submit'
                    variant = 'contained'
                    onClick = {this.fetchObject}
                    className = {classes.button}
                    disabled = {!superuser}
                >
                    Fetch
                </Button>
                <Button 
                    variant = 'contained'
                    onClick = {this.saveObject}
                    className = {classes.button}
                >
                    Save for Rollback
                </Button>
                <Button 
                    variant = 'contained'
                    onClick = {this.rollbackObject}
                    className = {classes.button}
                >
                    Rollback
                </Button>
                <Button 
                    variant = 'contained'
                    onClick = {this.postObject}
                    className = {classes.button}
                    disabled = {((!superuser) || (!this.savejson))}
                >
                    Post
                </Button>
                <Button 
                    variant = 'contained'
                    onClick = {this.clearObject}
                    className = {classes.button}
                >
                    Clear
                </Button>
            </div>
            </React.Fragment>
        )

        const jsoneditor = (
            <div>

                <ReactJson 
                    src = {this.state.docpack.document} 
                    onEdit = {props => {
                        this.latestjson = props.updated_src
                    }}
                    onAdd = {props => {
                        this.latestjson = props.updated_src
                    }}
                    onDelete = {props => {
                        this.latestjson = props.updated_src
                    }}
                    name = 'document'
                />

            </div>
        )

        const jsoninput = (superuser,classes) => (
            <div className = {classes.jsoninput}>
            <Button 
                type = 'submit'
                variant = 'contained'
                onClick = {this.applyJson}
                className = {classes.button}
                disabled = {!superuser}
            >
                Apply Json
            </Button>
            <BaseForm onSubmit = {this.applyJson} disabled = {!superuser}>
                <TextField 
                    label = 'Json'
                    name = 'json'
                    value = {this.state.values.json}
                    onChange = { this.onChangeValue }
                    multiline
                    helperText = 'paste in or create json'
                />
            </BaseForm> 
            </div>
        )

        const { classes } = this.props

        // --------------[ return component ]--------------

        return <div 
            className = { classes.pagewrapper }
            ref = {this.buildelement}
        >
            <StandardToolbar />
            {!application.properties.ismobile?
            <UserDataContext.Consumer>

                { userdata => {

                    let { login } = userdata

                    let superuser = !!(login && (login.uid == '112979797407042560714'))

                    return (

                    <div>

                        { datadrawer(login) }

                        <div className = { classes.panewrapper } >

                            <div>This build utility is currently only available to Henrik Bechmann, the author.</div>

                            {inputcontrols(superuser,classes)}

                            {datacontrols(superuser,classes)}

                            { jsoneditor }

                            {jsoninput(superuser,classes)}

                        </div>

                    </div> )
                }}

            </UserDataContext.Consumer>

            :<div>The build utility is only available on desktops</div>

            }
        </div>
        
    }
}

export default withStyles(styles)(BuildController)
