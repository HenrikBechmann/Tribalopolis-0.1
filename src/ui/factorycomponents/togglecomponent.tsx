// togglecomponent.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

import utilities from '../../utilities/utilities'
import { GenericObject } from '../../services/interfaces'

interface ToggleComponentProps {
    firstcomponent:any,
    secondcomponent:any,
    condition:boolean,
    istransitioning?:boolean,
    formcontext:GenericObject,
    namespace:GenericObject,
    locked?:boolean,
}

class ToggleComponent extends React.Component<ToggleComponentProps,any> {
    constructor(props) {
        super(props)
        // console.log('toggleComponent: props',props)
        let { firstcomponent, secondcomponent, formcontext, namespace } = this.props
        let localnamespace = Object.assign({},namespace)
        localnamespace.local = this
        this.localnamespace = localnamespace
        this.firstcomponent = firstcomponent
        this.secondcomponent = secondcomponent
        this.formcontext = formcontext
        this.namespace = namespace
    }

    state = {
        generation:0
    }

    firstcomponent
    secondcomponent
    formcontext
    namespace
    localnamespace
    // localchildren

    componentDidMount() {
        // console.log('componentDidMount togglecomponent', this.props)
        this.firstcomponent = utilities.integrateComponents(this.firstcomponent,this.localnamespace)
        this.secondcomponent = utilities.integrateComponents(this.secondcomponent,this.localnamespace)
        this.setState((state)=> {
            return {generation:++state.generation}
        })
    }

    render() {
        // console.log('togglecomponent:condition, istransitioning, firstcomponent, secondcomponent',this.props.condition,this.props.istransitioning, this.firstcomponent, this.secondcomponent)
        this.props.condition
            ?this.firstcomponent = utilities.updateComponents(this.firstcomponent,this.localnamespace)
            :this.secondcomponent = utilities.updateComponents(this.secondcomponent,this.localnamespace)
        return (
            this.props.condition
                ?this.firstcomponent
                :this.secondcomponent
        )
    }
}

export default ToggleComponent
