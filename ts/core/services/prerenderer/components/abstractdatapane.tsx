// abstractdatapane.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

import PreRenderer from '../../prerenderer'
import Proxy from '../../../utilities/docproxy'

class AbstractDataPane extends React.Component<any,any> {

    constructor(props) {

        super(props)

        this.prerenderer = new PreRenderer()

        let { reference, options, data } = this.props
        this.reference = reference
        this.options = options
        this.data = data
        this.proxy = new Proxy({doctoken:{reference}})

    }

    prerenderer
    reference
    options
    data
    proxy

    componentDidMount() {
        // subscribe to reference
        
    }

    render() {

        return <div>
        
            {this.props.children}
        
        </div>

   }

}

export default AbstractDataPane

// if ( !this.prerenderer ) {
//     this.prerenderer = new PreRenderer()
// }

// // reformat for prerenderer
// this.renderMessage = 
//     this.prerenderer.getRenderMessage(
//         docpack,
//         typepack,
//         this.state.options,
//         containerdata
//     )

// this.prerenderer.updateRenderMessage(this.renderMessage)
// this.renderContent = this.prerenderer.assemble()
