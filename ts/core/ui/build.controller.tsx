// build.controller.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence

'use strict'

import React from 'react'

import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'

import ReactJson from 'react-json-view'

import StandardToolbar from './common/standardtoolbar.view'

import BaseForm from './input/baseform.view'
import SelectField from './input/selectfield.view'
import TextField from './input/textfield.view'
import BasicEditor from './input/basiceditor.view'

import UserContext from '../services/user.context'

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
})

let testJson = {
    one:{
        first:1,
        second:"second"
    },
    two:"two",
    three:[
        "first",
        2,
        "third"
    ]
}

class BuildController extends React.Component<any,any> {

    state = {
        values:{
            collection:'types',
            alias:'',
        },
        json:{},
    }

    savejson = {}

    latestjson = {}

    fetchObject = () => {
        console.log('fetching', this.state.values)
    }

    saveObject = () => {
        this.savejson = this.latestjson
    }

    rollbackObject = () => {
        this.setState({
            json:this.savejson
        })
    }

    postObject = () => {
        console.log('posting', this.state.values)
    }

    clearObject = () => {
        this.savejson = {}
        this.setState({
            json:{},
        })
    }

    onChangeValue = event => {
        let { values } = this.state
        values[event.target.name] = event.target.value
        this.setState({ values })    
    }

    render() {

        return <div>
            <StandardToolbar />
            <UserContext.Consumer>
            { user => {
            let superuser = !!(user && (user.uid == '112979797407042560714'))
            // console.log('user',superuser,user)
            return <div>
            <BaseForm>
                <SelectField
                    label = {'Collection'}
                    name = 'collection'
                    value = {this.state.values.collection}
                    onChange = {this.onChangeValue}
                    helperText = {'select an object to build'}
                    options = {[
                        {
                            value:'types',
                            text:'Type',
                        },
                        {
                            value:'schemes',
                            text:'Scheme',
                        },
                    ]}
                />

                <TextField 
                    label = 'Handle'
                    name = 'handle'
                    value = {this.state.values.alias}
                    onChange = { this.onChangeValue }
                    helperText = 'enter the handle of the requested object'
                />
            </BaseForm>
            <div>
                <Button 
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
                    Save
                </Button>
                <Button 
                    variant = 'contained'
                    onClick = {this.rollbackObject}
                    className = {this.props.classes.button}
                >
                    Roll Back
                </Button>
                <Button 
                    variant = 'contained'
                    onClick = {this.postObject}
                    className = {this.props.classes.button}
                    disabled = {!superuser}
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
                    src = {this.state.json} 
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
            {/*<BasicEditor />*/}
        </div>
    }
}

export default withStyles(styles)(BuildController)
