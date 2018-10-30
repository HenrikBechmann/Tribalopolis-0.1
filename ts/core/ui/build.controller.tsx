// build.controller.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence

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

import UserContext from '../services/user.context'

import application from '../services/application'

import ActionButton from './common/actionbutton.view'
import DataDrawer from './common/datadrawer.view'
import BuildDataPane from './build/builddatapane.view'

const styles = theme => (createStyles({
  button: {
    margin: theme.spacing.unit,
  },
}))

class BuildController extends React.Component<any,any> {

    constructor(props) {
        super(props)
        this.contentelement = React.createRef()
        window.addEventListener('resize',this.onResize)
    }

    state = {
        values:{
            collection:'types',
            id:'',
        },
        doc:{
            data:{},
            id:null,
        },
        draweropen:false,
    }
    savejson = null

    latestjson = {}

    drawerdatapackage
    contentelement

    onResize = () => {
        this.forceUpdate()
    }

    componentWillUnmount() {
        window.removeEventListener('resize',this.onResize)
    }

    fetchObject = () => {

        if (!this.savejson || (confirm('replace current object?'))) {
            application.getDocument(
                `/${this.state.values.collection}/${this.state.values.id}`,
                this.getCallback,
                this.getErrorCallback
            )
        }
    }

    getCallback = (data,id) => {

        if (!data) {
            data = {}
            toast.warn('new object')
        }
        this.latestjson = data
        this.savejson = data
        this.setState({
            doc:{
                data:data,
                id:id
            }
        })

    }

    getErrorCallback = (error) => {
        toast.error(error)
    }

    saveObject = () => {
        this.savejson = this.latestjson
        toast.info('object saved')
    }

    rollbackObject = () => {
        this.latestjson = this.savejson
        this.forceUpdate()
        toast.info('object was rolled back from most recent save')
    }

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

    clearObject = () => {
        this.savejson = null
        this.latestjson = {}
        this.setState({
            doc:{
                data:{},
                id:null,
            }
        })
        toast.info('object was cleared')
    }

    onChangeValue = event => {
        // console.log('event',event)
        let { values } = this.state
        values[event.target.name] = event.target.value
        this.setState({ values })    
    }

    closeDrawer = () => {
        this.drawerdatapackage = null
        this.setState({
            draweropen:false,
        })
    }

    callDataDrawer = (proxy,opcode) => {
        if (this.state.draweropen) {
            toast.info('The data shelf is in use. Close the shelf and try again.')
            return
        }
        this.drawerdatapackage = {proxy, opcode}
        this.setState({
            draweropen:true,
        })
    }

    render() {
        return <div 
            style = {
                {
                    overflow:'hidden',
                    position:'relative',
                    height:'100vh',
                }
            }
            ref = {this.contentelement}
        >
            <StandardToolbar />
            <DataDrawer open = {this.state.draweropen}
                handleClose = {this.closeDrawer}
                containerelement = {this.contentelement}
            >
                <BuildDataPane
                    drawerDataPackage = {this.drawerdatapackage}
                />
            </DataDrawer>

            {!application.properties.ismobile?<UserContext.Consumer>
            { user => {
            let superuser = !!(user && (user.uid == '112979797407042560714'))
            // console.log('user',superuser,user)
            return <div>
            <div>The build utility is currently only available to Henrik Bechmann, the author.</div>
            <BaseForm onSubmit = {this.fetchObject} disabled = {!superuser}>
                <SelectField
                    label = {'Collection'}
                    name = 'collection'
                    value = {this.state.values.collection}
                    onChange = {this.onChangeValue}
                    helperText = {'select an object to build'}
                    options = {[
                        {
                            value:'sourcetypes',
                            text:'Source Types',
                        },
                        {
                            value:'types',
                            text:'Type',
                        },
                        {
                            value:'schemes',
                            text:'Scheme',
                        },
                        {
                            value:'system',
                            text:'System',
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
                            this.callDataDrawer({},'search')
                        }
                    }
                />
            </BaseForm>
            <div>
                <Button 
                    type = 'submit'
                    variant = 'contained'
                    onClick = {this.fetchObject}
                    className = {this.props.classes.button}
                    disabled = {!superuser}
                >
                    Fetch
                </Button>
                <Button 
                    variant = 'contained'
                    onClick = {this.saveObject}
                    className = {this.props.classes.button}
                >
                    Save for Rollback
                </Button>
                <Button 
                    variant = 'contained'
                    onClick = {this.rollbackObject}
                    className = {this.props.classes.button}
                >
                    Rollback
                </Button>
                <Button 
                    variant = 'contained'
                    onClick = {this.postObject}
                    className = {this.props.classes.button}
                    disabled = {(!superuser) || (!this.savejson)}
                >
                    Post
                </Button>
                <Button 
                    variant = 'contained'
                    onClick = {this.clearObject}
                    className = {this.props.classes.button}
                >
                    Clear
                </Button>
            </div>
            <div>
                <ReactJson 
                    src = {this.state.doc.data} 
                    onEdit = {props => {
                        this.latestjson = props.updated_src
                    }}
                    onAdd = {props => {
                        this.latestjson = props.updated_src
                    }}
                    onDelete = {props => {
                        this.latestjson = props.updated_src
                    }}
                />
            </div>
            </div>
            }}
            </UserContext.Consumer>
            :<div>The build utility is only available on desktops</div>}
        </div>
        
    }
}

export default withStyles(styles)(BuildController)
