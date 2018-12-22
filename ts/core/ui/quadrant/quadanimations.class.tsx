// quadanimations.utilities.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

const highlightBox = ({boxElement}) => {

    boxElement.classList.add('outlinehighlight')
    setTimeout(() => {
        boxElement.classList.remove('outlinehighlight')
    },1100)

}

const _animateMask = ({sourceElement,containerElement,maskAnimationElement}) => {

    let sourcePack = _getAnimationElementVars(sourceElement, containerElement)
    _animateMaskDrill(sourcePack, maskAnimationElement)

}

const _animateOriginToDataBox = ({sourceElement, targetElement, containerElement, drillAnimationElement, boxwidth}) => {

    let { domSourcePack:drillSourcePack, domTargetPack:drillTargetPack } = 
        _getAnimationSelectDrillVars( sourceElement, targetElement, containerElement, boxwidth )

    _animateFromOriginDrill( drillSourcePack, drillTargetPack, drillAnimationElement )
   
}

const _animateOriginToDataBoxList = ({sourceElement, targetElement, containerElement, drillAnimationElement}) => {

    let {domSourcePack:drillSourcePack,domTargetPack:drillTargetPack} = 
        _getAnimationDrillVars(sourceElement,targetElement, containerElement)

    _animateFromOriginDrill(drillSourcePack, drillTargetPack, drillAnimationElement)

}

const _animateToOrigin = ({sourceElement, originElement, containerElement, originAnimationElement, maskAnimationElement}) => {

    let sourcePack = _getAnimationElementVars(sourceElement, containerElement)
    let targetPack = _getAnimationElementVars(originElement, containerElement)

    _animateMaskDrill(sourcePack, maskAnimationElement)
    _animateOriginDrill( sourcePack, targetPack, originAnimationElement )

}

const _animateToDatabox = ({sourceElement, targetElement, containerElement, drillAnimationElement, boxwidth}) => {

    let { domSourcePack:drillSourcePack, domTargetPack:drillTargetPack } = 
        _getAnimationSelectDrillVars( sourceElement, targetElement, containerElement, boxwidth )

    _animateBlockDrill( drillSourcePack, drillTargetPack, drillAnimationElement )

}

const _animateToDataboxList = ({sourceElement, targetElement, containerElement, drillAnimationElement }) => {

    let {domSourcePack:drillSourcePack,domTargetPack:drillTargetPack} = 
        _getAnimationDrillVars(sourceElement,targetElement, containerElement)

    _animateBlockDrill(drillSourcePack, drillTargetPack, drillAnimationElement)

}

// --------------------[ supporting functions ]-----------------------------

const _animateMaskDrill = (sourceStyle, maskBlock) => {
    let maskanimationBlock:HTMLElement = maskBlock

    for (let property in sourceStyle) {
        maskanimationBlock.style.setProperty('--'+property,sourceStyle[property] + 'px')
    }

    maskanimationBlock.classList.add('maskdrill')

    setTimeout(() => {
        maskanimationBlock.classList.remove('maskdrill')
    },2000)

}

const _getAnimationDrillVars = (domSource:HTMLElement,domTarget:HTMLElement, containerelement) => {
    let varpack = {
        domSourcePack:null,
        domTargetPack:null,
    }

    varpack.domSourcePack = _getAnimationElementVars(domSource, containerelement)
    varpack.domTargetPack = _getAnimationElementVars(domTarget, containerelement)

    return varpack
}

const _getAnimationSelectDrillVars = (domSource:HTMLElement,domReference:HTMLElement, containerelement, boxwidth) => {
    let varpack = {
        domSourcePack:null,
        domTargetPack:null,
    }

    let targetPack = {
        top:domReference.offsetTop + (domReference.clientHeight * .12),
        left:(domReference.offsetWidth / 2) - ((boxwidth/2) - 10 ),
        height:domReference.clientHeight - (domReference.clientHeight * .1),
        width:boxwidth,
    }

    varpack.domSourcePack = _getAnimationElementVars(domSource, containerelement)
    varpack.domTargetPack = targetPack

    return varpack
}

const _getAnimationElementVars = (domelement:HTMLElement,containerelement) => {

    let containerRect = containerelement.getBoundingClientRect()
    let elementRect = domelement.getBoundingClientRect()

    let topOffset = elementRect.top - containerRect.top
    let leftOffset = elementRect.left - containerRect.left
    let height = domelement.clientHeight
    let width = domelement.clientWidth

    return {
        top:topOffset,
        left:leftOffset,
        height,
        width,
    }
}

// selectforward
const _animateBlockDrill = (sourceStyle, targetStyle, drillBlock) => {

    let drillanimationBlock:HTMLElement = drillBlock

    for (let property in sourceStyle) {
        drillanimationBlock.style.setProperty('--source'+property,sourceStyle[property] + 'px')
    }
    for (let property in targetStyle) {
        drillanimationBlock.style.setProperty('--target'+property,targetStyle[property] + 'px')
    }

    drillanimationBlock.classList.add('elementdrill')

    setTimeout(() => {
        drillanimationBlock.classList.remove('elementdrill')
    },2000)
}

const _animateFromOriginDrill = (sourceStyle, targetStyle, targetElement) => {

    let originanimationBlock:HTMLElement = targetElement

    for (let property in sourceStyle) {
        originanimationBlock.style.setProperty('--source'+property,sourceStyle[property] + 'px')
    }
    for (let property in targetStyle) {
        originanimationBlock.style.setProperty('--target'+property,targetStyle[property] + 'px')
    }

    originanimationBlock.classList.add('fromorigindrill')

    setTimeout(() => {
        originanimationBlock.classList.remove('fromorigindrill')
    },2000)
}

const _animateOriginDrill = (sourceStyle, targetStyle, targetElement) => {

    let originanimationBlock:HTMLElement = targetElement

    for (let property in sourceStyle) {
        originanimationBlock.style.setProperty('--source'+property,sourceStyle[property] + 'px')
    }
    for (let property in targetStyle) {
        originanimationBlock.style.setProperty('--target'+property,targetStyle[property] + 'px')
    }

    originanimationBlock.classList.add('origindrill')

    setTimeout(() => {
        originanimationBlock.classList.remove('origindrill')
    },2000)
}

class animations {
    constructor({
        scrollboxelement,
        originelement,
        quadcontentelement,
        originanimationblock,
        maskanimationblock,
        drillanimationblock
    }) {
        this.highlightBox = highlightBox
        this._animateToOrigin = _animateToOrigin
        this._animateToDatabox = _animateToDatabox
        this._animateToDataboxList = _animateToDataboxList
        this._animateMask = _animateMask
        this._animateOriginToDataBox = _animateOriginToDataBox
        this._animateOriginToDataBoxList = _animateOriginToDataBoxList

        this.scrollboxelement = scrollboxelement
        this.originelement = originelement
        this.quadcontentelement = quadcontentelement
        this.originanimationblock = originanimationblock
        this.maskanimationblock = maskanimationblock
        this.drillanimationblock = drillanimationblock
    }

    // arguments -- animation elements
    scrollboxelement
    originelement
    quadcontentelement
    originanimationblock
    maskanimationblock
    drillanimationblock

    // source methods
    highlightBox
    _animateToOrigin
    _animateToDatabox
    _animateToDataboxList
    _animateMask
    _animateOriginToDataBox
    _animateOriginToDataBoxList


/********************************************************
----------------------[ animation ]---------------------
*********************************************************/

    // animation calls

    animateToOrigin = () => {
        this._animateToOrigin({
            sourceElement:this.scrollboxelement.current, 
            originElement:this.originelement.current,  
            containerElement:this.quadcontentelement.current, 
            originAnimationElement:this.originanimationblock.current,
            maskAnimationElement:this.maskanimationblock.current,
        })        
    }

    animateToDataBox = (domSource,boxwidth) => {
        this._animateToDatabox({
            sourceElement:domSource,
            targetElement:this.scrollboxelement.current,
            containerElement:this.quadcontentelement.current,
            drillAnimationElement:this.drillanimationblock.current,
            boxwidth,
        })        
    }

    animateToDataBoxList = (domSource) => {
        this._animateToDataboxList({
            sourceElement:domSource,
            targetElement:this.scrollboxelement.current,
            containerElement:this.quadcontentelement.current,
            drillAnimationElement:this.drillanimationblock.current,  
        })        
    }

    animateOriginToDatabox = (boxwidth) => {
        this._animateMask({
            sourceElement:this.scrollboxelement.current,
            containerElement:this.quadcontentelement.current,
            maskAnimationElement:this.maskanimationblock.current,
        })
        this._animateOriginToDataBox({
            sourceElement:this.originelement.current,
            targetElement:this.scrollboxelement.current,
            containerElement:this.quadcontentelement.current,
            drillAnimationElement:this.drillanimationblock.current,
            boxwidth,
        })        
    }

    animateOriginToDataBoxList = () => {
        this._animateMask({
            sourceElement:this.scrollboxelement.current,
            containerElement:this.quadcontentelement.current,
            maskAnimationElement:this.maskanimationblock.current,
        })
        this._animateOriginToDataBoxList({
            sourceElement:this.originelement.current,
            targetElement:this.scrollboxelement.current,
            containerElement:this.quadcontentelement.current,
            drillAnimationElement:this.drillanimationblock.current,
        })
    }

}

export default animations
