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
}

class ToggleComponent extends React.Component<ToggleComponentProps,any> {
    constructor(props) {
        super(props)
        let { firstcomponent, secondcomponent, formcontext } = this.props
        this.firstcomponent = firstcomponent
        this.secondcomponent = secondcomponent
        this.formcontext = formcontext
    }

    state = {
        condition:this.props.condition
    }

    firstcomponent
    secondcomponent
    formcontext

    render() {
        return (
            this.props.condition
                // ?<span>first</span>
                // :<span>second</span>
                ?this.firstcomponent
                :this.secondcomponent
        )
    }
}

export default ToggleComponent
