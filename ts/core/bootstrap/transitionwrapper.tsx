import * as React from 'react'
var { Component } = React

import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

class TransitionWrapper extends Component<any, any> {
    render() {
        // console.log(this.props)
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
                        key: this.props.children.path
                    })
                }
            </ReactCSSTransitionGroup>
        )
    }
}

export default TransitionWrapper