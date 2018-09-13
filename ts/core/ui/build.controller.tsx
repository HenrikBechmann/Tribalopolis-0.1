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
        json:{}
    }

    fetchObject = () => {
        console.log('fetching', this.state.values)
    }

    saveObject = () => {
        console.log('saving', this.state.values)
    }

    rollbackObject = () => {
        console.log('saving', this.state.values)
    }

    postObject = () => {
        console.log('posting', this.state.values)
    }

    clearObject = () => {
        this.setState({
            json:{},
        })
    }

    onChangeValue = event => {
        let { values } = this.state
        values[event.target.name] = event.target.value
        // console.log('onchange values',values)
        this.setState({ values })    
    }

    render() {

        return <div>
            <StandardToolbar />
            <BaseForm>
                <SelectField
                    label = {'Collection'}
                    name = 'collection'
                    value = {this.state.values.collection}
                    onChange = {this.onChangeValue}
                    helperText = {'select a collection for the object'}
                    options = {[
                        {
                            value:'types',
                            text:'types',
                        },
                        {
                            value:'schemas',
                            text:'schemas',
                        },
                        {
                            value:'items',
                            text:'items',
                        },
                        {
                            value:'lists',
                            text:'lists',
                        },
                        {
                            value:'links',
                            text:'links',
                        },
                        {
                            value:'folders',
                            text:'folders',
                        },
                        {
                            value:'accounts',
                            text:'accounts',
                        },
                    ]}
                />

                <TextField 
                    label = 'Alias'
                    name = 'alias'
                    value = {this.state.values.alias}
                    onChange = { this.onChangeValue }
                    helperText = 'enter the alias of the requested object'
                />
            </BaseForm>
            <div>
                <Button 
                    variant = 'contained'
                    onClick = {this.fetchObject}
                    className = {this.props.classes.button}
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

                    }}
                    onAdd = {props => {
                        
                    }}
                    onDelete = {props => {
                        
                    }}
                />
            </div>
            <BasicEditor />
        </div>
    }
}

export default withStyles(styles)(BuildController)
