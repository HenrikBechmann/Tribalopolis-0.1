// contentspan.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

import utilities from '../../../utilities/utilities'

class ContentSpan extends React.Component<any,any> {

    constructor(props) {
        super(props)

        let { style, classes, children, namespace } = this.props
        if (namespace) {
            let localnamespace = Object.assign({},namespace)
            localnamespace.local = this
            this.localnamespace = localnamespace
        }
        // this.importedstyles = style || {}
        // this.classes = props.classes || {}
        this.localchildren = children

        // console.log('contentspan:props',this.props)

    }

    state = {
        generation:0
    }

    // importedstyles
    // classes
    localchildren
    localnamespace

    componentDidMount() {
        this.localchildren = utilities.integrateComponents(this.localchildren,this.localnamespace)
        this.setState((state)=>{
            return {
                generation:++state.generation
            }
        })
    }

    render() { 

        return <span>

            {this.localchildren}
            
        </span>

    }

}

export default ContentSpan