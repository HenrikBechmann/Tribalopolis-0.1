// togglecomponent.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

import { GenericObject } from '../../interfaces'

interface ToggleComponentProps {
    firstcomponent:any,
    secondcomponent:any,
    condition:boolean,
    formcontext:GenericObject,
    namespace:GenericObject,
}

class ToggleComponent extends React.Component<ToggleComponentProps,any> {
    constructor(props) {
        super(props)
        console.log('toggleComponent: props',props)
        let { firstcomponent, secondcomponent, formcontext, namespace } = this.props
        this.firstcomponent = firstcomponent
        this.secondcomponent = secondcomponent
        this.formcontext = formcontext
        this.namespace = namespace
    }

    state = {
        condition:this.props.condition
    }

    firstcomponent
    secondcomponent
    formcontext
    namespace

    render() {
        // console.log('togglecomponenbt:condition, firstcomponent, secondcomponent',this.props.condition,this.firstcomponent, this.secondcomponent)
        return (
            this.props.condition
                ?this.firstcomponent
                :this.secondcomponent
        )
    }
}

export default ToggleComponent
