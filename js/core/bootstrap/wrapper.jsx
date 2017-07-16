import * as React from 'react';
var { Component } = React;
//import { ReactCssTransitionGroup } from 'react-addons-css-transition-group'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
class Wrapper extends Component {
    render() {
        // console.log(this.props)
        return (<ReactCSSTransitionGroup component="div" transitionName="base" transitionAppear={true} transitionAppearTimeout={1000} transitionEnter={false} transitionLeave={false}>
                {React.cloneElement(this.props.children, {
            key: this.props.children.path
        })}
            </ReactCSSTransitionGroup>);
    }
}
export default Wrapper;
//# sourceMappingURL=wrapper.jsx.map