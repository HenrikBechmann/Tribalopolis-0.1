// quadamimations.wrapper.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
/*
    THOUGHT: the div can be pushed down to a view component to use withStyles
    can't be used here as the layer hides methods accessed by parent

    THOUGHT: this is likely an antipattern. Find another way, like operations class

    TODO: move the elements back up to quadrant; move the methods into
    quadanimations.utilities, and make animations a class rather than an object
*/
'use strict';
import React from 'react';
import animations from './quadanimations.utilities';
let styles = {
    quadcontent: {
        boxSizing: 'border-box',
        border: '3px outset gray',
        position: 'relative',
        borderRadius: '8px',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    },
};
class QuadAnimationWrapper extends React.Component {
    constructor(props) {
        super(props);
        /********************************************************
        ----------------------[ animation ]---------------------
        *********************************************************/
        // animation calls
        this.animateToOrigin = () => {
            animations.animateToOrigin({
                sourceElement: this.scrollboxelement.current,
                originElement: this.originelement.current,
                containerElement: this.quadcontentelement.current,
                originAnimationElement: this.originanimationblock.current,
                maskAnimationElement: this.maskanimationblock.current,
            });
        };
        this.animateToDataBox = (domSource) => {
            animations.animateToDatabox({
                sourceElement: domSource,
                targetElement: this.scrollboxelement.current,
                containerElement: this.quadcontentelement.current,
                drillAnimationElement: this.drillanimationblock.current,
                boxwidth: this.props.boxwidth,
            });
        };
        this.animateToDataBoxList = (domSource) => {
            animations.animateToDataboxList({
                sourceElement: domSource,
                targetElement: this.scrollboxelement.current,
                containerElement: this.quadcontentelement.current,
                drillAnimationElement: this.drillanimationblock.current,
            });
        };
        this.animateOriginToDatabox = () => {
            animations.animateMask({
                sourceElement: this.scrollboxelement.current,
                containerElement: this.quadcontentelement.current,
                maskAnimationElement: this.maskanimationblock.current,
            });
            animations.animateOriginToDataBox({
                sourceElement: this.originelement.current,
                targetElement: this.scrollboxelement.current,
                containerElement: this.quadcontentelement.current,
                drillAnimationElement: this.drillanimationblock.current,
                boxwidth: this.props.boxwidth,
            });
        };
        this.animateOriginToDataBoxList = () => {
            animations.animateMask({
                sourceElement: this.scrollboxelement.current,
                containerElement: this.quadcontentelement.current,
                maskAnimationElement: this.maskanimationblock.current,
            });
            animations.animateOriginToDataBoxList({
                sourceElement: this.originelement.current,
                targetElement: this.scrollboxelement.current,
                containerElement: this.quadcontentelement.current,
                drillAnimationElement: this.drillanimationblock.current,
            });
        };
        this.quadcontentelement = React.createRef();
        // animation dom elements
        this.drillanimationblock = React.createRef();
        this.originanimationblock = React.createRef();
        this.maskanimationblock = React.createRef();
        this.scrollboxelement = this.props.scrollboxelement;
        this.originelement = this.props.originelement;
    }
    render() {
        let { classes, quadcontentStyle } = this.props;
        return (<div style={Object.assign({}, styles.quadcontent, quadcontentStyle)} ref={this.quadcontentelement}>
                <div ref={this.drillanimationblock}></div>
                <div ref={this.originanimationblock}></div>
                <div ref={this.maskanimationblock}></div>

                {this.props.children}

            </div>);
    }
}
export default QuadAnimationWrapper;
//# sourceMappingURL=quadamimation.wrapper.jsx.map