// copyright (c) 2016 Henrik Bechmann, Toronto, MIT Licence
// app.tsx
// import * as Addins from '../../addins/addins'
import * as React from 'react';
var { Component } = React;
//import { ReactCssTransitionGroup } from 'react-addons-css-transition-group'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
class Wrapper extends Component {
    render() {
        console.log(this.props.location, this.props.children);
        return (<ReactCSSTransitionGroup component="div" transitionName="base" transitionAppear={true} transitionAppearTimeout={1000} transitionEnter={false} transitionLeave={false}>
                {React.cloneElement(this.props.children, {
            key: this.props.location.pathname
        })}
            </ReactCSSTransitionGroup>);
    }
}
export default Wrapper;
//# sourceMappingURL=wrapper.jsx.map