// build.controller.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence

'use strict'

import React from 'react'

import StandardToolbar from './common/standardtoolbar.view'

import BaseForm from './input/baseform.view'
import SelectField from './input/selectfield.view'
import TextField from './input/textfield.view'
import BasicEditor from './input/basiceditor.view'

class BuildController extends React.Component<any,any> {

    state = {
        values:{
            collection:'types',
            alias:'',
        }
    }

    onChangeValue = event => {
        let { values } = this.state
        values[event.target.name] = event.target.value
        console.log('onchange values',values)
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
            <BasicEditor />
        </div>
    }
}

export default BuildController