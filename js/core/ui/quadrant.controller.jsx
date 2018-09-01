// quadrant.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
/*
    TODO: keep scrollbox pos in settings when navigating stack levels
*/
'use strict';
import * as React from 'react';
import QuadOrigin from './quadrant/quadorigin.view';
import QuadTitleBar from './quadrant/quadtitlebar.view';
import DataBox from './databox.controller';
import { METATYPES } from '../constants';
import { serializer } from '../../core/utilities/serializer';
import Lister from 'react-list';
class Quadrant extends React.Component {
    /********************************************************
    ----------------------[ initialize ]---------------------
    *********************************************************/
    constructor(props) {
        super(props);
        this.state = {
            datastack: null,
            stackpointer: 0,
            collapseBoxProxyForTarget: null
        };
        // trigger for animation and reset
        this.collapseBoxProxyForTarget = null;
        // for reset of containerHeight
        this.onResize = () => {
            this.forceUpdate();
        };
        this._findlinkIndex = (instanceid) => {
            return (item) => {
                return item.instanceid == instanceid;
            };
        };
        /********************************************************
        ----------------------[ operations ]---------------------
        *********************************************************/
        //-------------------------------[ forward ]----------------------------
        this.expandDirectoryItem = (boxptr, dataref, domSource) => {
            this.animateToOrigin();
            this.animateToDatabox(domSource);
            let { datastack, stackpointer } = this.state;
            this._captureSettings(stackpointer, datastack);
            let boxProxy = datastack[stackpointer].items[boxptr];
            stackpointer++;
            let newstacklayer = { items: [], settings: {}, source: {
                    instanceid: boxProxy.instanceid,
                    dataref: boxProxy.dataref,
                    action: 'expand',
                } };
            // replace forward stack items
            datastack.splice(stackpointer, datastack.length, newstacklayer);
            let newBoxProxy = JSON.parse(JSON.stringify(boxProxy));
            newBoxProxy.instanceid = serializer.getid();
            newBoxProxy.liststack.push(dataref);
            newstacklayer.items.push(newBoxProxy);
            setTimeout(() => {
                this.setState({
                    stackpointer,
                    datastack,
                });
            });
        };
        this.splayBox = (boxptr, domSource, sourcelistcomponent) => {
            let visiblerange = sourcelistcomponent.current.getVisibleRange();
            this.animateToOrigin();
            this.animateToDataboxList(domSource);
            let { datastack, stackpointer } = this.state;
            this._captureSettings(stackpointer, datastack);
            let boxProxy = datastack[stackpointer].items[boxptr];
            let item = this.getDataItem(boxProxy.dataref);
            let liststack = boxProxy.liststack;
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
            let newstacklayer = { items: [], settings: {}, source: {
                    instanceid: boxProxy.instanceid,
                    dataref: boxProxy.dataref,
                    action: 'splay',
                    visiblerange,
                } };
            // console.log('new stack pointer',stackpointer)
            // replace forward stack items
            datastack.splice(stackpointer, datastack.length, newstacklayer);
            let template = JSON.stringify(boxProxy);
            for (let dataref of linkitems) {
                let newBoxProxy = JSON.parse(template);
                newBoxProxy.instanceid = serializer.getid();
                newBoxProxy.liststack.push(dataref);
                newstacklayer.items.push(newBoxProxy);
            }
            setTimeout(() => {
                this.setState({
                    stackpointer,
                    datastack,
                }, () => {
                    setTimeout(() => {
                        this.listcomponent.current.scrollTo(visiblerange[0]);
                    });
                });
            }, 250);
        };
        this.selectFromSplay = (boxptr, domSource) => {
            // console.log('selectFromSplay boxptr,domSource',boxptr,domSource)
            this.animateToOrigin();
            this.animateToDatabox(domSource);
            let { datastack, stackpointer } = this.state;
            this._captureSettings(stackpointer, datastack);
            let boxProxy = datastack[stackpointer].items[boxptr];
            stackpointer++;
            let newstacklayer = { items: [], settings: {}, source: {
                    instanceid: boxProxy.instanceid,
                    dataref: boxProxy.dataref,
                    action: 'select',
                } };
            // replace forward stack items
            datastack.splice(stackpointer, datastack.length, newstacklayer);
            let newBoxProxy = JSON.parse(JSON.stringify(boxProxy));
            newBoxProxy.instanceid = serializer.getid();
            newstacklayer.items.push(newBoxProxy);
            setTimeout(() => {
                this.setState({
                    stackpointer,
                    datastack,
                });
            });
        };
        this.incrementStackSelector = () => {
            let { stackpointer, datastack } = this.state;
            this._captureSettings(stackpointer, datastack);
            let depth = this.state.datastack.length;
            if (stackpointer < (depth - 1)) {
                stackpointer++;
                this.setState({
                    stackpointer,
                    datastack,
                }, () => {
                    this._applySettings(stackpointer, datastack);
                });
            }
        };
        //-------------------------------[ backward ]----------------------------
        this.collapseDirectoryItem = (boxProxy) => {
            this.collapseBoxProxyForTarget = Object.assign({}, boxProxy);
            this.decrementStackSelector();
        };
        this.decrementStackSelector = () => {
            let { stackpointer, datastack } = this.state;
            this._captureSettings(stackpointer, datastack);
            this._updateCollapseSettings(stackpointer, datastack);
            if (stackpointer > 0) {
                stackpointer--;
                this.setState({
                    stackpointer,
                    datastack,
                }, () => {
                    this._applySettings(stackpointer, datastack);
                });
            }
        };
        this._updateCollapseSettings = (stackpointer, datastack) => {
            let stacksource = null;
            if (this.collapseBoxProxyForTarget) {
                let sourcelayer = datastack[this.state.stackpointer];
                if (sourcelayer) {
                    stacksource = sourcelayer.source;
                    if (stacksource) {
                        this.collapseBoxProxyForTarget.action = stacksource.action;
                        this.collapseBoxProxyForTarget.sourceinstanceid = stacksource.instanceid;
                    }
                }
                if (stackpointer > 0) {
                    datastack[stackpointer - 1].settings.scrollOffset = null;
                }
            }
        };
        this._captureSettings = (stackpointer, datastack) => {
            let stacklayer = datastack[stackpointer];
            let { items } = stacklayer;
            stacklayer.settings.scrollOffset =
                (items.length > 1) ? this.scrollboxelement.current.scrollLeft : 0;
        };
        this._applySettings = (stackpointer, datastack) => {
            let stacklayer = datastack[stackpointer];
            let { items } = stacklayer;
            if ((items.length > 1) && (!this.collapseBoxProxyForTarget)) {
                if (stacklayer.settings.scrollOffset !== null) {
                    setTimeout(() => {
                        this.scrollboxelement.current.scrollLeft = stacklayer.settings.scrollOffset;
                    });
                }
            }
        };
        /********************************************************
        ----------------------[ animations ]---------------------
        *********************************************************/
        this.highlightBox = (boxdomref) => {
            let boxelement = boxdomref.current;
            boxelement.classList.add('outlinehighlight');
            setTimeout(() => {
                boxelement.classList.remove('outlinehighlight');
            }, 1100);
        };
        this.animateToOrigin = () => {
            let sourceelement = this.scrollboxelement.current;
            let targetelement = this.originelement.current;
            let sourcePack = this._getAnimationElementVars(sourceelement);
            let targetPack = this._getAnimationElementVars(targetelement);
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
            let targetReference = this.scrollboxelement.current;
            let { domSourcePack: drillSourcePack, domTargetPack: drillTargetPack } = this._getAnimationSelectDrillVars(domSource.current, targetReference);
            this._animateBlockDrill(drillSourcePack, drillTargetPack);
        };
        this.animateToDataboxList = (domSource) => {
            let targetElement = this.scrollboxelement.current;
            let { domSourcePack: drillSourcePack, domTargetPack: drillTargetPack } = this._getAnimationDrillVars(domSource.current, targetElement);
            this._animateBlockDrill(drillSourcePack, drillTargetPack);
        };
        this._getAnimationDrillVars = (domSource, domTarget) => {
            let varpack = {
                domSourcePack: null,
                domTargetPack: null,
            };
            varpack.domSourcePack = this._getAnimationElementVars(domSource);
            varpack.domTargetPack = this._getAnimationElementVars(domTarget);
            return varpack;
        };
        this._getAnimationSelectDrillVars = (domSource, domReference) => {
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
            varpack.domSourcePack = this._getAnimationElementVars(domSource);
            varpack.domTargetPack = targetPack;
            return varpack;
        };
        this._getAnimationElementVars = (domelement) => {
            let containerelement = this.quadcontentelement.current;
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
        /********************************************************
        -------------------[ assembly support ]------------------
        *********************************************************/
        this.getListItemType = (metatype) => {
            return (dataref) => {
                return this.getTypeItem(metatype, dataref);
            };
        };
        // Lister item renderer
        this.getBox = (index, key) => {
            let { datastack, stackpointer } = this.state;
            if (!datastack)
                return null;
            if (!this.scrollboxelement.current)
                return null;
            let boxProxy = datastack[stackpointer].items[index];
            let stacklayer = datastack[stackpointer];
            let haspeers = (stacklayer && (stacklayer.items.length > 1));
            return this.getBoxComponent(boxProxy, index, haspeers, key);
        };
        this.getBoxComponent = (boxProxy, index, haspeers, key) => {
            // console.log('getBoxComponent', boxProxy, index, haspeers, key)
            let item = this.getDataItem(boxProxy.dataref);
            let itemType = this.getTypeItem(METATYPES.item, item.type);
            let containerHeight = this.scrollboxelement.current.offsetHeight;
            let matchForTarget = false;
            let { collapseBoxProxyForTarget } = this.state;
            if (collapseBoxProxyForTarget) {
                matchForTarget = (collapseBoxProxyForTarget.index == index);
            }
            // console.log('match',matchForTarget,collapseBoxProxyForTarget,index)
            return (<DataBox key={boxProxy.instanceid} item={item} itemType={itemType} collapseBoxProxyForTarget={matchForTarget ? collapseBoxProxyForTarget : null} getListItem={this.getListItem} getListItemType={this.getListItemType(METATYPES.list)} boxProxy={boxProxy} highlightBox={this.highlightBox} haspeers={haspeers} index={index} containerHeight={containerHeight} splayBox={(domSource, listcomponent) => {
                this.splayBox(index, domSource, listcomponent);
            }} selectFromSplay={(domSource) => {
                this.selectFromSplay(index, domSource);
            }} expandDirectoryItem={(dataref, domSource) => {
                this.expandDirectoryItem(index, dataref, domSource);
            }} collapseDirectoryItem={this.collapseDirectoryItem}/>);
        };
        this.quadcontentelement = React.createRef();
        // animation dom elements
        this.drillanimationblock = React.createRef();
        this.originanimationblock = React.createRef();
        this.maskanimationblock = React.createRef();
        // structure dom elements
        this.originelement = React.createRef();
        this.scrollboxelement = React.createRef();
        this.listcomponent = React.createRef();
    }
    /********************************************************
    ------------------[ lifecycle methods ]------------------
    *********************************************************/
    componentWillMount() {
        this.getDataItem = this.props.callbacks.getDataItem;
        this.getListItem = this.props.callbacks.getListItem;
        this.getTypeItem = this.props.callbacks.getTypeItem;
        window.addEventListener('resize', this.onResize);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize);
    }
    componentDidMount() {
        // setting of datastack delayed because
        // scrollbox height must be available to set height of content items
        this.setState({
            datastack: this.props.datastack,
        });
    }
    componentDidUpdate() {
        if (!this.collapseBoxProxyForTarget)
            return;
        // keep; value will be purged
        let collapseBoxProxyForTarget = this.collapseBoxProxyForTarget;
        this.collapseBoxProxyForTarget = null;
        // get index for Lister
        let index = this.state.datastack[this.state.stackpointer].items.findIndex(this._findlinkIndex(collapseBoxProxyForTarget.sourceinstanceid));
        // update scroll display with selected highlight item
        collapseBoxProxyForTarget.index = index;
        setTimeout(() => {
            if (this.listcomponent && (this.state.datastack[this.state.stackpointer].items.length > 1)) {
                this.listcomponent.current.scrollAround(index);
            }
            setTimeout(() => {
                this.setState({
                    collapseBoxProxyForTarget,
                }, () => {
                    setTimeout(() => {
                        this.setState({
                            collapseBoxProxyForTarget: null
                        });
                    });
                });
            }, 300);
        });
    }
    /********************************************************
    ------------------------[ render ]-----------------------
    *********************************************************/
    // TODO: move style blocks out of render code
    render() {
        let { color } = this.props;
        let { datastack } = this.state;
        let haspeers = datastack ? (this.state.datastack[this.state.stackpointer].items.length > 1) : false;
        // Safari keeps scrollleft with content changes
        if (!haspeers && this.scrollboxelement.current && (this.scrollboxelement.current.scrollLeft != 0)) {
            this.scrollboxelement.current.scrollLeft = 0;
        }
        let quadcontentstyle = {
            boxSizing: 'border-box',
            border: '3px outset gray',
            position: 'relative',
            backgroundColor: color,
            borderRadius: '8px',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
        };
        let viewportFrameStyle = {
            position: 'absolute',
            top: 'calc(25px + 2%)',
            left: '2%',
            bottom: '2%',
            right: '2%',
            borderRadius: '8px',
            overflow: 'hidden',
        };
        let viewportStyle = {
            width: '100%',
            height: '100%',
            overflow: 'auto',
            backgroundColor: haspeers ? '#e8e8e8' : 'lightblue',
            border: '1px solid gray',
            boxSizing: 'border-box',
            borderRadius: '8px',
            position: 'relative',
        };
        return (<div style={quadcontentstyle} ref={this.quadcontentelement}>
                <div ref={this.drillanimationblock}>
                </div>
                <div ref={this.originanimationblock}>
                </div>
                <div ref={this.maskanimationblock}>
                </div>
                <QuadTitleBar title={'title'} quadidentifier={this.props.quadidentifier}/>
                <QuadOrigin stackpointer={this.state.stackpointer} stackdepth={datastack ? datastack.length : 0} incrementStackSelector={this.incrementStackSelector} decrementStackSelector={this.decrementStackSelector} ref={this.originelement}/>
                <div style={viewportFrameStyle}>
                    <div style={viewportStyle} ref={this.scrollboxelement}>
                        {haspeers
            ? <Lister axis='x' itemRenderer={this.getBox} length={datastack ? datastack[this.state.stackpointer].items.length : 0} type='uniform' ref={this.listcomponent}/>
            : this.getBox(0, 'singleton')}
                    </div>
                </div>
            </div>);
    }
}
export default Quadrant;
//# sourceMappingURL=quadrant.controller.jsx.map