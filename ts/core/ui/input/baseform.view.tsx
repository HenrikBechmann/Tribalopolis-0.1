// baseform.view.tsx

// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence

'use strict'

import React from 'react'
/*
    patterned after first demo https://material-ui.com/demos/selects/ for 3.03
*/
class BaseForm extends React.Component<any,any> {

    render() {
        return (
            <form style = {{display:'flex',flexWrap:'wrap'}} autoComplete="off">
                {this.props.children}
            </form>
        )
    }
}

export default BaseForm

