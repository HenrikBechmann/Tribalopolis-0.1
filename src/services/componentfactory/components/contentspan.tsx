// contentspan.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

class ContentSpan extends React.Component<any,any> {

    constructor(props) {
        super(props)

        let { style, classes, children } = this.props
        this.importedstyles = style || {}
        this.localstyles = {border:'2px solid blue',padding:'3px'}
        this.classes = props.classes || {}
        this.localchildren = children

    }

    importedstyles
    localstyles
    classes
    localchildren

    render() { 

        return <span>

            {this.props.children}
            
        </span>

    }

}

export default ContentSpan