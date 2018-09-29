// quadamimations.wrapper.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence

/*
    TODO: the div can be pushed down to a view component to use withStyles
    can't be used here as the layer hides methods accessed by parent

    TODO: this is likely an antipattern. Find another way, like operations class
*/

'use strict'

import React from 'react'

import animations from './quadanimations.utilities'

let styles = {
   quadcontent: {
        boxSizing: 'border-box',
        border: '3px outset gray',
        position:'relative',
        borderRadius:'8px',
        width:'100%',
        height:'100%',
        overflow:'hidden',
    },
}

class QuadAnimationWrapper extends React.Component<any,any>  {

    constructor(props) {
        super(props)

        this.quadcontentelement = React.createRef()

        // animation dom elements
        this.drillanimationblock = React.createRef()
        this.originanimationblock = React.createRef()
        this.maskanimationblock = React.createRef()

        this.scrollboxelement = this.props.scrollboxelement
        this.originelement = this.props.originelement

    }

    drillanimationblock
    originanimationblock
    maskanimationblock
    quadcontentelement

    scrollboxelement
    originelement

/********************************************************
----------------------[ animation ]---------------------
*********************************************************/

    // animation calls

    animateToOrigin = () => {
        animations.animateToOrigin({
            sourceElement:this.scrollboxelement.current, 
            originElement:this.originelement.current,  
            containerElement:this.quadcontentelement.current, 
            originAnimationElement:this.originanimationblock.current,
            maskAnimationElement:this.maskanimationblock.current,
        })        
    }

    animateToDataBox = (domSource) => {
        animations.animateToDatabox({
            sourceElement:domSource,
            targetElement:this.scrollboxelement.current,
            containerElement:this.quadcontentelement.current,
            drillAnimationElement:this.drillanimationblock.current,
            boxwidth:this.props.boxwidth,
        })        
    }

    animateToDataBoxList = (domSource) => {
        animations.animateToDataboxList({
            sourceElement:domSource,
            targetElement:this.scrollboxelement.current,
            containerElement:this.quadcontentelement.current,
            drillAnimationElement:this.drillanimationblock.current,  
        })        
    }

    animateOriginToDatabox = () => {
        animations.animateMask({
            sourceElement:this.scrollboxelement.current,
            containerElement:this.quadcontentelement.current,
            maskAnimationElement:this.maskanimationblock.current,
        })
        animations.animateOriginToDataBox({
            sourceElement:this.originelement.current,
            targetElement:this.scrollboxelement.current,
            containerElement:this.quadcontentelement.current,
            drillAnimationElement:this.drillanimationblock.current,
            boxwidth:this.props.boxwidth,
        })        
    }

    animateOriginToDataBoxList = () => {
        animations.animateMask({
            sourceElement:this.scrollboxelement.current,
            containerElement:this.quadcontentelement.current,
            maskAnimationElement:this.maskanimationblock.current,
        })
        animations.animateOriginToDataBoxList({
            sourceElement:this.originelement.current,
            targetElement:this.scrollboxelement.current,
            containerElement:this.quadcontentelement.current,
            drillAnimationElement:this.drillanimationblock.current,
        })
    }

    render() {

        let { classes, quadcontentStyle } = this.props

        return (
            <div
                style = {{...styles.quadcontent,...quadcontentStyle}}
                ref = {this.quadcontentelement}
            >
                <div ref = {this.drillanimationblock} ></div>
                <div ref = {this.originanimationblock} ></div>
                <div ref = {this.maskanimationblock} ></div>

                {this.props.children}

            </div> 
        )       
    }

}

export default QuadAnimationWrapper
