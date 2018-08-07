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
            let element = this.element.current;
            switch (quadrant) {
                case "topleft": {
                    top = 0;
                    left = 0;
                    break;
                }
                case "topright": {
                    top = 0;
                    left = (element.parentElement.offsetWidth / 2) + 'px';
                    break;
                }
                case "bottomleft": {
                    top = (element.parentElement.offsetHeight / 2) + 'px';
                    left = 0;
                    break;
                }
                case "bottomright": {
                    top = (element.parentElement.offsetHeight / 2) + 'px';
                    left = (element.parentElement.offsetWidth / 2) + 'px';
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
        this.element = null;
        this.expandCategory = (boxptr, listItemRef) => {
            // console.log('expandCategory',boxptr,listItemRef)
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
            this.setState({
                stackpointer,
                datastack,
            });
        };
        this.collapseCategory = () => {
            this.decrementStackSelector();
        };
        this.splayBox = (boxptr, domSource, domTarget) => {
            console.log('splayBox boxptr,domSource, domTarget', boxptr, domSource, domTarget);
            let animationblock = this.animationblock.current;
            animationblock.style.setProperty('--width', '200px');
            animationblock.classList.add('elementdrill');
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
            // console.log('datastack',datastack[stackpointer])
            this.setState({
                stackpointer,
                datastack,
            });
            // console.log('splay box for ptr, boxconfig, item, listitem', boxptr, boxconfig, item, listitem)
        };
        this.selectFromSplay = (boxptr, domSource) => {
            console.log('selectFromSplay boxptr,domSource', boxptr, domSource);
            let { datastack, stackpointer } = this.state;
            let boxconfig = datastack[stackpointer].items[boxptr];
            stackpointer++;
            let newstacklayer = { items: [], settings: {} };
            // replace forward stack items
            datastack.splice(stackpointer, datastack.length, newstacklayer);
            let newboxconfig = JSON.parse(JSON.stringify(boxconfig));
            newboxconfig.instanceid = serializer.getid();
            newstacklayer.items.push(newboxconfig);
            this.setState({
                stackpointer,
                datastack,
            });
        };
        // selectforward
        this.animateElementDrill = (sourceStyle, targetStyle, animationBlock) => {
        };
        // selectbackward
        this.animateElementUnwind = (sourceStyle, targetStyle, adnimationBlock) => {
        };
        // selectforward
        this.animateOriginDrill = () => {
        };
        // selectbackward
        this.animateOriginUnwind = () => {
        };
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
                        this.splayBox(index, domSource, this.listviewport);
                    }} selectFromSplay={(domSource) => {
                        this.selectFromSplay(index, domSource);
                    }} expandCategory={(ref) => {
                        this.expandCategory(index, ref);
                    }} collapseCategory={this.collapseCategory}/>);
                });
            }
            // console.log('getBoxes box list',boxes)
            return boxes;
        };
        this.animationblock = React.createRef();
        this.listviewport = React.createRef();
        this.element = React.createRef();
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
        // console.log('render box list',boxlist)
        return (<div style={{
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
        }} ref={this.element}>
                <div ref={this.animationblock}>
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
        }} ref={this.listviewport}>
                    <SwapMenu quadrant={this.state.quadrant} handleswap={this.props.handleswap}/>
                    <QuadTitleBar title={this.props.title} uid={this.state.startquadrant}/>
                    <QuadOrigin stackpointer={this.state.stackpointer} stackdepth={this.state.datastack.length} incrementStackSelector={this.incrementStackSelector} decrementStackSelector={this.decrementStackSelector}/>
                    <InfiniteScroll items={boxlist}/>
                    <QuadSelector quadrant={this.state.quadrant} split={this.props.split} quadselection={this.props.quadselection}/>
                </div>
            </div>);
    }
}
export default Quadrant;
//# sourceMappingURL=quadrant.controller.jsx.map