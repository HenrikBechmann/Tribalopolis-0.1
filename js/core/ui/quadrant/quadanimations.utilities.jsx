// quadanimations.utilities.tsx
const highlightBox = ({ boxElement }) => {
    boxElement.classList.add('outlinehighlight');
    setTimeout(() => {
        boxElement.classList.remove('outlinehighlight');
    }, 1100);
};
const animateMask = ({ sourceElement, containerElement, maskAnimationElement }) => {
    let sourcePack = _getAnimationElementVars(sourceElement, containerElement);
    _animateMaskDrill(sourcePack, maskAnimationElement);
};
const animateOriginToDataBox = ({ sourceElement, targetElement, containerElement, drillAnimationElement, boxwidth }) => {
    let { domSourcePack: drillSourcePack, domTargetPack: drillTargetPack } = _getAnimationSelectDrillVars(sourceElement, targetElement, containerElement, boxwidth);
    _animateFromOriginDrill(drillSourcePack, drillTargetPack, drillAnimationElement);
};
const animateOriginToDataBoxList = ({ sourceElement, targetElement, containerElement, drillAnimationElement }) => {
    let { domSourcePack: drillSourcePack, domTargetPack: drillTargetPack } = _getAnimationDrillVars(sourceElement, targetElement, containerElement);
    _animateFromOriginDrill(drillSourcePack, drillTargetPack, drillAnimationElement);
};
const animateToOrigin = ({ sourceElement, originElement, containerElement, originAnimationElement, maskAnimationElement }) => {
    let sourcePack = _getAnimationElementVars(sourceElement, containerElement);
    let targetPack = _getAnimationElementVars(originElement, containerElement);
    _animateMaskDrill(sourcePack, maskAnimationElement);
    _animateOriginDrill(sourcePack, targetPack, originAnimationElement);
};
const animateToDatabox = ({ sourceElement, targetElement, containerElement, drillAnimationElement, boxwidth }) => {
    let { domSourcePack: drillSourcePack, domTargetPack: drillTargetPack } = _getAnimationSelectDrillVars(sourceElement, targetElement, containerElement, boxwidth);
    _animateBlockDrill(drillSourcePack, drillTargetPack, drillAnimationElement);
};
const animateToDataboxList = ({ sourceElement, targetElement, containerElement, drillAnimationElement }) => {
    let { domSourcePack: drillSourcePack, domTargetPack: drillTargetPack } = _getAnimationDrillVars(sourceElement, targetElement, containerElement);
    _animateBlockDrill(drillSourcePack, drillTargetPack, drillAnimationElement);
};
// --------------------[ supporting functions ]-----------------------------
const _animateMaskDrill = (sourceStyle, maskBlock) => {
    let maskanimationBlock = maskBlock;
    for (let property in sourceStyle) {
        maskanimationBlock.style.setProperty('--' + property, sourceStyle[property] + 'px');
    }
    maskanimationBlock.classList.add('maskdrill');
    setTimeout(() => {
        maskanimationBlock.classList.remove('maskdrill');
    }, 1250);
};
const _getAnimationDrillVars = (domSource, domTarget, containerelement) => {
    let varpack = {
        domSourcePack: null,
        domTargetPack: null,
    };
    varpack.domSourcePack = _getAnimationElementVars(domSource, containerelement);
    varpack.domTargetPack = _getAnimationElementVars(domTarget, containerelement);
    return varpack;
};
const _getAnimationSelectDrillVars = (domSource, domReference, containerelement, boxwidth) => {
    let varpack = {
        domSourcePack: null,
        domTargetPack: null,
    };
    let targetPack = {
        top: domReference.offsetTop + (domReference.clientHeight * .1),
        left: (domReference.offsetWidth / 2) - ((boxwidth / 2) - 10),
        height: domReference.clientHeight - (domReference.clientHeight * .06),
        width: boxwidth,
    };
    varpack.domSourcePack = _getAnimationElementVars(domSource, containerelement);
    varpack.domTargetPack = targetPack;
    return varpack;
};
const _getAnimationElementVars = (domelement, containerelement) => {
    let containerRect = containerelement.getBoundingClientRect();
    let elementRect = domelement.getBoundingClientRect();
    let topOffset = elementRect.top - containerRect.top;
    let leftOffset = elementRect.left - containerRect.left;
    let height = domelement.clientHeight;
    let width = domelement.clientWidth;
    return {
        top: topOffset,
        left: leftOffset,
        height,
        width,
    };
};
// selectforward
const _animateBlockDrill = (sourceStyle, targetStyle, drillBlock) => {
    let drillanimationBlock = drillBlock;
    for (let property in sourceStyle) {
        drillanimationBlock.style.setProperty('--source' + property, sourceStyle[property] + 'px');
    }
    for (let property in targetStyle) {
        drillanimationBlock.style.setProperty('--target' + property, targetStyle[property] + 'px');
    }
    drillanimationBlock.classList.add('elementdrill');
    setTimeout(() => {
        drillanimationBlock.classList.remove('elementdrill');
    }, 1100);
};
const _animateFromOriginDrill = (sourceStyle, targetStyle, targetElement) => {
    let originanimationBlock = targetElement;
    for (let property in sourceStyle) {
        originanimationBlock.style.setProperty('--source' + property, sourceStyle[property] + 'px');
    }
    for (let property in targetStyle) {
        originanimationBlock.style.setProperty('--target' + property, targetStyle[property] + 'px');
    }
    originanimationBlock.classList.add('fromorigindrill');
    setTimeout(() => {
        originanimationBlock.classList.remove('fromorigindrill');
    }, 600);
};
const _animateOriginDrill = (sourceStyle, targetStyle, targetElement) => {
    let originanimationBlock = targetElement;
    for (let property in sourceStyle) {
        originanimationBlock.style.setProperty('--source' + property, sourceStyle[property] + 'px');
    }
    for (let property in targetStyle) {
        originanimationBlock.style.setProperty('--target' + property, targetStyle[property] + 'px');
    }
    originanimationBlock.classList.add('origindrill');
    setTimeout(() => {
        originanimationBlock.classList.remove('origindrill');
    }, 600);
};
let animations = {
    highlightBox,
    animateToOrigin,
    animateToDatabox,
    animateToDataboxList,
    animateMask,
    animateOriginToDataBox,
    animateOriginToDataBoxList,
};
export default animations;
//# sourceMappingURL=quadanimations.utilities.jsx.map