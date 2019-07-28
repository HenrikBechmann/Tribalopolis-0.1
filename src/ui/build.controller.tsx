// build.controller.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

/*
    TODO: straighten out dom tree; currently data drawer scrolls a bit
    allow update of data drawer for benign requests
*/

'use strict'

import React from 'react'

import Button from '@material-ui/core/Button'
import { withStyles, createStyles } from '@material-ui/core/styles'

import ReactJson from 'react-json-view'

import { toast } from 'react-toastify'

// import merge from 'deepmerge'

import StandardToolbar from './common/standardtoolbar.view'

import BaseForm from './input/baseform.view'
import SelectField from './input/selectfield.view'
import TextField from './input/textfield.view'

// import UserDataContext from '../services/userdata.context'
import UserAccountControlData from '../services/useraccount.controldata'

import application from '../services/application'
import typefilter from '../services/type.filter'

import ActionButton from './common/actionbutton.view'
import DataDrawer from './common/datadrawer.view'
import BuildDataPane from './build/builddatapane.view'

import { 
    GetDocumentMessage, 
    SetDocumentMessage, 
    DocpackPayloadMessage,
    DataPaneContext } from '../services/interfaces'

const styles = theme => (createStyles({
    button: {
        margin: theme.spacing(1),
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
            reference:null,
        },
        draweropen:false,
        generation:0,
    }

    savejson = null
    latestjson = {}

    drawerdatapackage
    buildelement

    doctypepack
    docpackoriginal

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
                    refernce:this.state.values.collection + '/' + this.state.values.id
                }
            },() => {
                if (data.control) {
                    // let typetoken = data.control.type 
                    // if (typetoken) {
                        // let typeref = typetoken.reference
                        let typeref = data.control_type_reference
                        if (typeref) {
                            let parmblock: GetDocumentMessage = {
                                reference:typeref,
                                success:this.fetchTypeSuccessCallback,
                                failure:this.fetchTypeErrorCallback,
                            }
                            application.getDocument(parmblock)
                        }
                    // }
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

                let parm:GetDocumentMessage = {
                    reference:this.state.values.collection,
                    success:this.fetchSuccessCallback,
                    failure:this.fetchErrorCallback,
                }

                application.getNewDocument(parm)

            } else {

                let parm:GetDocumentMessage = {
                    reference:`/${this.state.values.collection}/${this.state.values.id}`,
                    success:this.fetchSuccessCallback,
                    failure:this.fetchErrorCallback,
                }
                application.getDocument(parm)

            }
        }
    }

    fetchSuccessCallback = ({docpack, reason}:DocpackPayloadMessage) => {

        this.docpackoriginal = docpack

        let newobject = false
        let data:any = docpack.document
        if (!data) {
            data = {}
            toast.warn('new object')
            newobject = true
        }
        this.latestjson = data
        this.savejson = data
        let values = this.state.values
        if (newobject) {
            values.id = docpack.reference.split('/').slice(-1)[0] // last element
        }
        this.setState({
            values,
            docpack
        },() => {
            let typeref = data.control_type_reference
            if (typeref) {
                let parm:GetDocumentMessage = {
                    reference:typeref,
                    success:this.fetchTypeSuccessCallback,
                    failure:this.fetchTypeErrorCallback,
                }
                application.getDocument(parm)
            }
        })

    }

    fetchErrorCallback = error => {
        toast.error(error)
    }

    // apply type template to document
    fetchTypeSuccessCallback = ({docpack,reason}:DocpackPayloadMessage) => {
        let typepack = docpack
        this.doctypepack = typepack
        toast.info('type has also been loaded (' + docpack.reference + ')')

        let results = typefilter.assertType(this.state.docpack.document,this.doctypepack.document)

        if (results && results.document) {
            let filtereddocpack:any = application.filterDataIncomingDocpack(
                {
                    reference:this.docpackoriginal.reference,
                    document:results.document,
                },
                typepack,
            )

            results.document = filtereddocpack.document
        }

        if (results) {// && results.changed) {
            this.latestjson = results.document
            this.savejson = results.document
            this.setState((state) => ({
                // generation:++state.generation
                docpack:{
                    document:results.document,
                    reference:this.state.docpack.reference,
                }
            }))
            results.changed && toast.info('document data has been upgraded by type (' + docpack.reference + ')' )
        }
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
        this.latestjson = Object.assign({},this.savejson) // for react to recognize new object
        this.forceUpdate()
        toast.info('object was rolled back from most recent save')
    }

    // =================[ post ]==========================

    postObject = () => {
        if (confirm('Post this object?')) {
            let reference = `/${this.state.values.collection}/${this.state.values.id}`
            let newdocpack:any = application.filterDataOutgoingDocpack({reference,document:this.latestjson},this.doctypepack)
            let parm:SetDocumentMessage = {
                reference,
                document:newdocpack.document,
                success:this.postSuccessCallback,
                failure:this.postFailureCallback,
            }
            application.setDocument(parm)
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
        let values = this.state.values
        values.id = ''
        values.json = ''
        this.setState({
            docpack:{
                data:{},
                reference:null,
            },
            values,
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

    callDataDrawer = ({docproxy, options}:DataPaneContext) => {
        if (this.state.draweropen) {
            this.setState({
                draweropen:false
            },() => {
                this.drawerdatapackage = {docproxy,options}
                this.setState({
                    draweropen:true
                })
            })
            // toast.info('The data shelf is in use. Close the shelf and try again.')
            return
        }
        this.drawerdatapackage = {docproxy,options}
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

    // --------[ sections of the renderpage follow ]--------

    datadrawer = (login, systemdata) => (
        <DataDrawer open = {this.state.draweropen}
            handleClose = {this.closeDrawer}
            containerelement = {this.buildelement}
        >
            <BuildDataPane
                dataPaneContext = {this.drawerdatapackage}
                open = {this.state.draweropen}
                user = {login}
                systemdata = {systemdata}
            />
        </DataDrawer>
    )

    inputcontrols = (superuser,classes) => (
        <BaseForm onSubmit = {this.fetchObject} disabled = {!superuser}>
            <SelectField
                label = {'Collection'}
                name = 'collection'
                value = {this.state.values.collection}
                onChange = {this.onChangeValue}
                helperText = {'select an object to build'}
                options = {[
                    {
                        value:'system',
                        text:'System',
                    },
                    {
                        value:'types',
                        text:'Types',
                    },
                    {
                        value:'users',
                        text:'Users',
                    },
                    {
                        value:'userclaims',
                        text:'Userclaims',
                    },
                    {
                        value:'handles',
                        text:'Handles',
                    },
                    {
                        value:'accounts',
                        text:'Accounts',
                    },
                    {
                        value:'members',
                        text:'Members',
                    },
                    // {
                    //     value:'organization',
                    //     text:'Organization',
                    // },
                    {
                        value:'items',
                        text:'Items',
                    },
                    // {
                    //     value:'groupings',
                    //     text:'Groupings',
                    // },
                    {
                        value:'links',
                        text:'Links',
                    },
                    {
                        value:'websites',
                        text:'Websites',
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
                        this.callDataDrawer(
                            {
                                docproxy:null,
                                options:{specs:{collection:this.state.values.collection}},
                                callbacks:{},
                            }
                        )
                    }
                }
            />
        </BaseForm> 
    ) //--end

    datacontrols = (superuser,classes) => (
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

    jsoneditor = () => {
        return <div>

            <ReactJson 
                src = {this.latestjson} 
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
    }

    jsoninput = (superuser,classes) => (
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

    render() {

        const { classes } = this.props

        // --------------[ return component ]--------------

        const components = <div 
            className = { classes.pagewrapper }
            ref = {this.buildelement}
        >
            <StandardToolbar />

            {!application.properties.ismobile?

            <UserAccountControlData>

                { (systemdata, userdata, activeaccountdata, activememberdata) => {

                    // console.log('build useraccountcontroldata',systemdata, userdata, activeaccountdata, activememberdata)

                    let login = userdata?userdata.login:null

                    let superuserid = null
                    if (systemdata && systemdata.parameters && systemdata.parameters.properties) {
                        superuserid = systemdata.parameters.properties.superuserid
                    }

                    let superuser = !!(login && (login.uid == superuserid)) // '0RLrSksoCeYcmnInICk0ia4D40u1'))

                    return (

                    <div>

                        { this.datadrawer(login, systemdata) }

                        <div className = { classes.panewrapper } >

                            <div>This build utility is currently only available to Henrik Bechmann, the author.</div>

                            { this.inputcontrols( superuser, classes ) }

                            { this.datacontrols( superuser, classes ) }

                            { this.jsoneditor() }

                            { this.jsoninput(superuser,classes) }

                        </div>

                    </div> )
                }}

            </UserAccountControlData>

            :<div>The build utility is only available on desktops</div>

            }

        </div>

        return components
        
    }
}

export default withStyles(styles)(BuildController)
