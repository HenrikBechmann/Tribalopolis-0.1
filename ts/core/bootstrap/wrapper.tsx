import * as React from 'react'
var { Component } = React
//import { ReactCssTransitionGroup } from 'react-addons-css-transition-group'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

class Wrapper extends Component<any, any> {
    render() {
        console.log(this.props.location, this.props.children)
        return (
            <ReactCSSTransitionGroup
                component = "div"
                transitionName="base"
                transitionAppear={true}
                transitionAppearTimeout={1000}
                transitionEnter={false}
                transitionLeave={false} >
                {
                    React.cloneElement(this.props.children, {
                        key: this.props.location.pathname
                    })
                }
            </ReactCSSTransitionGroup>
        )
    }
}

export default Wrapper