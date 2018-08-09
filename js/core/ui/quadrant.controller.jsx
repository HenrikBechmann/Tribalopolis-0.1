// quadrant.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
import QuadOrigin from './views/quadspace/quadorigin.view';
import QuadTitleBar from './views/quadspace/quadtitlebar.view';
import InfiniteScroll from './views/common/infinitescroll.view';
import SwapMenu from './views/quadspace/quadswapmenu.view';
import DataBox from './databox.controller';
import QuadSelector from './views/quadspace/quadselector.view';
import { METATYPES } from '../constants';
import { serializer } from '../../core/utilities/serializer';
class Quadrant extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            quadrant: this.props.quadrant,
            datastack: this.props.datastack,
            stackpointer: 0,
            startquadrant: this.props.quadrant,
        };
        this.sessionid = this.props.sessionid;
        this.calculateTransitionPosition = (quadrant) => {
            let top = 'auto';
            let left = 'auto';
            let bottom = 'auto';
            let right = 'auto';
            let quadelement = this.quadelement.current;
            switch (quadrant) {
                case "topleft": {
                    top = 0;
                    left = 0;
                    break;
                }
                case "topright": {
                    top = 0;
                    left = (quadelement.parentElement.offsetWidth / 2) + 'px';
                    break;
                }
                case "bottomleft": {
                    top = (quadelement.parentElement.offsetHeight / 2) + 'px';
                    left = 0;
                    break;
                }
                case "bottomright": {
                    top = (quadelement.parentElement.offsetHeight / 2) + 'px';
                    left = (quadelement.parentElement.offsetWidth / 2) + 'px';
                    break;
                }
            }
            this.position = {
                top,
                left,
                bottom,
                right,
            };
        };
        this.calculatePosition = (quadrant) => {
            let top = 'auto';
            let left = 'auto';
            let bottom = 'auto';
            let right = 'auto';
            switch (quadrant) {
                case "topleft": {
                    top = 0;
                    left = 0;
                    break;
                }
                case "topright": {
                    top = 0;
                    right = 0;
                    break;
                }
                case "bottomleft": {
                    bottom = 0;
                    left = 0;
                    break;
                }
                case "bottomright": {
                    bottom = 0;
                    right = 0;
                    break;
                }
            }
            this.position = {
                top,
                left,
                bottom,
                right,
            };
        };
        this.position = null;
        this.expandCategory = (boxptr, listItemRef, domSource) => {
            this.animateToOrigin();
            this.animateToDatabox(domSource);
            let { datastack, stackpointer } = this.state;
            let boxconfig = datastack[stackpointer].items[boxptr];
            stackpointer++;
            let newstacklayer = { items: [], settings: {} };
            // replace forward stack items
            datastack.splice(stackpointer, datastack.length, newstacklayer);
            let newboxconfig = JSON.parse(JSON.stringify(boxconfig));
            newboxconfig.instanceid = serializer.getid();
            newboxconfig.liststack.push(listItemRef);
            newstacklayer.items.push(newboxconfig);
            setTimeout(() => {
                this.setState({
                    stackpointer,
                    datastack,
                });
            });
        };
        this.collapseCategory = (boxConfig) => {
            console.log('quadrant collapseCategory boxConfig', boxConfig);
            this.decrementStackSelector();
        };
        this.splayBox = (boxptr, domSource) => {
            this.animateToOrigin();
            this.animateToDataboxList(domSource);
            let { datastack, stackpointer } = this.state;
            let boxconfig = datastack[stackpointer].items[boxptr];
            let item = this.getItem(boxconfig.ref);
            let liststack = boxconfig.liststack;
            let listref;
            if (liststack.length) {
                listref = liststack[liststack.length - 1];
            }
            else {
                listref = item.listref;
            }
            let listitem = this.getListItem(listref);
            let linkitems = listitem.links;
            if (!linkitems || !linkitems.length)
                return;
            stackpointer++;
            let newstacklayer = { items: [], settings: {} };
            // console.log('new stack pointer',stackpointer)
            // replace forward stack items
            datastack.splice(stackpointer, datastack.length, newstacklayer);
            let template = JSON.stringify(boxconfig);
            for (let ref of linkitems) {
                let newboxconfig = JSON.parse(template);
                newboxconfig.instanceid = serializer.getid();
                newboxconfig.liststack.push(ref);
                newstacklayer.items.push(newboxconfig);
            }
            setTimeout(() => {
                this.setState({
                    stackpointer,
                    datastack,
                });
            }, 250);
        };
        this.selectFromSplay = (boxptr, domSource) => {
            // console.log('selectFromSplay boxptr,domSource',boxptr,domSource)
            this.animateToOrigin();
            this.animateToDatabox(domSource);
            let { datastack, stackpointer } = this.state;
            let boxconfig = datastack[stackpointer].items[boxptr];
            stackpointer++;
            let newstacklayer = { items: [], settings: {} };
            // replace forward stack items
            datastack.splice(stackpointer, datastack.length, newstacklayer);
            let newboxconfig = JSON.parse(JSON.stringify(boxconfig));
            newboxconfig.instanceid = serializer.getid();
            newstacklayer.items.push(newboxconfig);
            setTimeout(() => {
                this.setState({
                    stackpointer,
                    datastack,
                });
            });
        };
        this.animateToOrigin = () => {
            let sourceelement = this.listelement.current;
            let targetelement = this.originelement.current;
            let sourcePack = this._getAnimationElementVars(sourceelement, 'quadelement');
            let targetPack = this._getAnimationElementVars(targetelement, 'quadelement');
            this._animateMaskDrill(sourcePack);
            this._animateOriginDrill(sourcePack, targetPack);
        };
        this._animateMaskDrill = (sourceStyle) => {
            let maskanimationBlock = this.maskanimationblock.current;
            for (let property in sourceStyle) {
                maskanimationBlock.style.setProperty('--' + property, sourceStyle[property] + 'px');
            }
            maskanimationBlock.classList.add('maskdrill');
            setTimeout(() => {
                maskanimationBlock.classList.remove('maskdrill');
            }, 1250);
        };
        this.animateToDatabox = (domSource) => {
            let targetReference = this.listelement.current;
            let { domSourcePack: drillSourcePack, domTargetPack: drillTargetPack } = this._getAnimationSelectDrillVars(domSource.current, targetReference, 'quadelement');
            let scrollBoxOffset = this.listelement.current.scrollLeft;
            drillSourcePack.left -= scrollBoxOffset;
            this._animateBlockDrill(drillSourcePack, drillTargetPack);
        };
        this.animateToDataboxList = (domSource) => {
            let targetElement = this.listelement.current;
            let { domSourcePack: drillSourcePack, domTargetPack: drillTargetPack } = this._getAnimationDrillVars(domSource.current, targetElement, 'quadelement');
            let scrollBoxOffset = this.listelement.current.scrollLeft;
            drillSourcePack.left -= scrollBoxOffset;
            this._animateBlockDrill(drillSourcePack, drillTargetPack);
        };
        this._getAnimationDrillVars = (domSource, domTarget, referenceMarker) => {
            let varpack = {
                domSourcePack: null,
                domTargetPack: null,
            };
            varpack.domSourcePack = this._getAnimationElementVars(domSource, referenceMarker);
            varpack.domTargetPack = this._getAnimationElementVars(domTarget, referenceMarker);
            return varpack;
        };
        this._getAnimationSelectDrillVars = (domSource, domReference, referenceMarker) => {
            let varpack = {
                domSourcePack: null,
                domTargetPack: null,
            };
            let targetPack = {
                top: domReference.offsetTop + (domReference.clientHeight * .1),
                left: (domReference.offsetWidth / 2) - 130,
                height: domReference.clientHeight - (domReference.clientHeight * .06),
                width: 300,
            };
            varpack.domSourcePack = this._getAnimationElementVars(domSource, referenceMarker);
            varpack.domTargetPack = targetPack;
            return varpack;
        };
        this._getAnimationElementVars = (domelement, referenceMarker) => {
            let topOffset = 0;
            let leftOffset = 0;
            let height = domelement.clientHeight;
            let width = domelement.clientWidth;
            let searchelement = domelement;
            while (searchelement && (searchelement.getAttribute('data-marker') != referenceMarker)) {
                topOffset += searchelement.offsetTop;
                leftOffset += searchelement.offsetLeft;
                searchelement = searchelement.offsetParent;
            }
            return {
                top: topOffset,
                left: leftOffset,
                height,
                width,
            };
        };
        // selectforward
        this._animateBlockDrill = (sourceStyle, targetStyle) => {
            // console.log('sourceStyle,targetStyle',sourceStyle,targetStyle)
            let drillanimationBlock = this.drillanimationblock.current;
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
        this._animateOriginDrill = (sourceStyle, targetStyle) => {
            // console.log('sourceStyle,targetStyle',sourceStyle,targetStyle)
            let originanimationBlock = this.originanimationblock.current;
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
        // // selectbackward
        // animateBlockUnwind = (sourceStyle, targetStyle, adnimationBlock) => {
        // }
        // // selectforward
        // animateOriginDrill = () => {
        // }
        // // selectbackward
        // animateOriginUnwind = () => {
        // }
        this.decrementStackSelector = () => {
            let { stackpointer } = this.state;
            if (stackpointer > 0) {
                stackpointer--;
                this.setState({
                    stackpointer,
                });
            }
        };
        this.incrementStackSelector = () => {
            let { stackpointer } = this.state;
            let depth = this.state.datastack.length;
            if (stackpointer < (depth - 1)) {
                stackpointer++;
                this.setState({
                    stackpointer,
                });
            }
        };
        this.getListItemType = (metatype) => {
            return (ref) => {
                return this.getTypeItem(metatype, ref);
            };
        };
        this.getBoxes = () => {
            let boxes = [];
            // console.log('getBoxes quadrant state',this.state)
            let { datastack, stackpointer } = this.state;
            if (datastack) {
                let haspeers = (datastack[stackpointer] && (datastack[stackpointer].items.length > 1));
                boxes = datastack[stackpointer].items.map((boxconfig, index) => {
                    let item = this.getItem(boxconfig.ref);
                    let itemType = this.getTypeItem(METATYPES.item, item.type);
                    return (<DataBox key={boxconfig.instanceid} item={item} itemType={itemType} getListItem={this.getListItem} getListItemType={this.getListItemType(METATYPES.list)} boxConfig={boxconfig} haspeers={haspeers} splayBox={(domSource) => {
                        this.splayBox(index, domSource);
                    }} selectFromSplay={(domSource) => {
                        this.selectFromSplay(index, domSource);
                    }} expandCategory={(ref, domSource) => {
                        this.expandCategory(index, ref, domSource);
                    }} collapseCategory={this.collapseCategory}/>);
                });
            }
            // console.log('getBoxes box list',boxes)
            return boxes;
        };
        this.drillanimationblock = React.createRef();
        this.originanimationblock = React.createRef();
        this.maskanimationblock = React.createRef();
        this.quadelement = React.createRef();
        this.originelement = React.createRef();
        this.listelement = React.createRef();
    }
    componentWillMount() {
        this.calculatePosition(this.state.quadrant);
        this.getItem = this.props.getItem;
        this.getListItem = this.props.getListItem;
        this.getTypeItem = this.props.getTypeItem;
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.quadrant != this.state.quadrant) {
            let self = this;
            this.calculateTransitionPosition(this.state.quadrant);
            this.forceUpdate(() => {
                setTimeout(() => {
                    self.calculateTransitionPosition(nextProps.quadrant);
                    self.setState({
                        quadrant: nextProps.quadrant
                    }, () => {
                        setTimeout(() => {
                            self.calculatePosition(this.state.quadrant);
                            self.forceUpdate();
                        }, 600);
                    });
                });
            });
        }
    }
    // TODO: move style blocks out of render code
    render() {
        // console.log('quadrant state',this.state)
        let { color } = this.props;
        let { quadrant } = this.state;
        let { top, left, bottom, right } = this.position;
        let boxlist = this.getBoxes();
        return (<div data-marker='quadelement' style={{
            position: 'absolute',
            boxSizing: 'border-box',
            width: '50%',
            height: '50%',
            padding: '3px',
            top,
            left,
            bottom,
            right,
            border: '1px solid transparent',
            transition: 'all .5s ease'
        }} ref={this.quadelement}>
                <div ref={this.drillanimationblock}>
                </div>
                <div ref={this.originanimationblock}>
                </div>
                <div ref={this.maskanimationblock}>
                </div>
                <div style={{
            boxSizing: 'border-box',
            border: '3px outset gray',
            position: 'relative',
            backgroundColor: color,
            borderRadius: '8px',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
        }}>
                    <SwapMenu quadrant={this.state.quadrant} handleswap={this.props.handleswap}/>
                    <QuadTitleBar title={this.props.title} uid={this.state.startquadrant}/>
                    <QuadOrigin stackpointer={this.state.stackpointer} stackdepth={this.state.datastack.length} incrementStackSelector={this.incrementStackSelector} decrementStackSelector={this.decrementStackSelector} ref={this.originelement}/>
                    <InfiniteScroll items={boxlist} ref={this.listelement}/>
                    <QuadSelector quadrant={this.state.quadrant} split={this.props.split} quadselection={this.props.quadselection}/>
                </div>
            </div>);
    }
}
export default Quadrant;
//# sourceMappingURL=quadrant.controller.jsx.map