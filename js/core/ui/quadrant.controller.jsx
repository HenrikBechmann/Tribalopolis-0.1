// quadrant.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
/*
    TODO: keep scrollbox pos in settings when navigating stack levels
*/
'use strict';
import React from 'react';
import { withStyles, createStyles } from '@material-ui/core/styles';
import QuadOrigin from './quadrant/quadorigin.view';
import QuadTitleBar from './quadrant/quadtitlebar.view';
import proxy from '../../core/utilities/proxy';
import DataBox from './databox.controller';
import Lister from 'react-list';
import animations from './quadrant/quadanimations.utilities';
import AnimationWrapper from './quadrant/quadamimation.wrapper';
let styles = createStyles({
    viewportFrame: {
        position: 'absolute',
        top: 'calc(25px + 2%)',
        left: '2%',
        bottom: '2%',
        right: '2%',
        borderRadius: '8px',
        overflow: 'hidden',
    },
    viewport: {
        width: '100%',
        height: '100%',
        overflow: 'auto',
        border: '1px solid gray',
        boxSizing: 'border-box',
        borderRadius: '8px',
        position: 'relative',
    }
});
class Quadrant extends React.Component {
    /********************************************************
    ----------------------[ initialize ]---------------------
    *********************************************************/
    constructor(props) {
        super(props);
        this.state = {
            datastack: null,
            stackpointer: 0,
            collapseTargetProxy: null,
            boxwidth: 300
        };
        // trigger for animation and reset
        this.collapseTargetProxy = null;
        this._findlinkIndex = (instanceid) => {
            return (itemDocumentProxy) => {
                return itemDocumentProxy.instanceid == instanceid;
            };
        };
        // for reset of containerHeight
        this.onResize = () => {
            this.forceUpdate();
        };
        /********************************************************
        ----------------------[ operations ]---------------------
        *********************************************************/
        //-------------------------------[ forward ]---------------------------
        this.expandDirectoryItem = (boxptr, listtoken, domSource) => {
            this.animationwrapper.current.animateToOrigin();
            this.animationwrapper.current.animateToDataBox(domSource);
            let { datastack, stackpointer } = this.state;
            this._captureSettings(stackpointer, datastack);
            let itemProxy = datastack[stackpointer].items[boxptr];
            stackpointer++;
            let newstacklayer = { items: [], settings: {}, source: {
                    instanceid: itemProxy.instanceid,
                    token: itemProxy.token,
                    action: 'expand',
                } };
            // replace forward stack items
            datastack.splice(stackpointer, datastack.length, newstacklayer);
            let newItemProxy = new proxy({ token: itemProxy.token });
            newItemProxy.liststack.push(listtoken);
            newstacklayer.items.push(newItemProxy);
            setTimeout(() => {
                this.setState({
                    stackpointer,
                    datastack,
                });
            }, 100);
        };
        this.splayBox = (boxptr, domSource, sourcelistcomponent, listDocument) => {
            let visiblerange = sourcelistcomponent.current.getVisibleRange();
            this.animationwrapper.current.animateToOrigin();
            this.animationwrapper.current.animateToDataBoxList(domSource);
            let { datastack, stackpointer } = this.state;
            this._captureSettings(stackpointer, datastack);
            let itemProxy = datastack[stackpointer].items[boxptr];
            let itemToken = itemProxy.token;
            let listtokens = listDocument.data.lists;
            if (!listtokens || !listtokens.length)
                return;
            stackpointer++;
            let newstacklayer = { items: [], settings: {}, source: {
                    instanceid: itemProxy.instanceid,
                    token: itemProxy.token,
                    action: 'splay',
                    visiblerange,
                } };
            // replace forward stack items
            datastack.splice(stackpointer, datastack.length, newstacklayer);
            for (let token of listtokens) {
                let newItemProxy = new proxy({ token: itemToken });
                newItemProxy.liststack = itemProxy.liststack.slice(); // copy
                newItemProxy.liststack.push(token);
                newstacklayer.items.push(newItemProxy);
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
            }, 100);
        };
        this.selectFromSplay = (boxptr, domSource) => {
            this.animationwrapper.current.animateToOrigin();
            this.animationwrapper.current.animateToDataBox(domSource);
            let { datastack, stackpointer } = this.state;
            this._captureSettings(stackpointer, datastack);
            let itemProxy = datastack[stackpointer].items[boxptr];
            let itemToken = itemProxy.token;
            stackpointer++;
            let newstacklayer = { items: [], settings: {}, source: {
                    instanceid: itemProxy.instanceid,
                    token: itemProxy.token,
                    action: 'select',
                } };
            // replace forward stack items
            datastack.splice(stackpointer, datastack.length, newstacklayer);
            let newItemProxy = new proxy({ token: itemToken });
            newItemProxy.liststack = itemProxy.liststack.slice(); // copy
            newstacklayer.items.push(newItemProxy);
            setTimeout(() => {
                this.setState({
                    stackpointer,
                    datastack,
                });
            }, 100);
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
        this.collapseDirectoryItem = (itemProxy) => {
            if (this.state.stackpointer) {
                let targetStackLayer = this.state.datastack[this.state.stackpointer - 1];
                if (targetStackLayer.items.length > 1) {
                    this.animationwrapper.current.animateOriginToDataBoxList();
                }
                else {
                    this.animationwrapper.current.animateOriginToDatabox();
                }
                // console.log('collapseDirectoryItem',itemProxy,this.state.datastack)
            }
            setTimeout(() => {
                this.collapseTargetProxy = Object.assign({}, itemProxy);
                this.decrementStackSelector();
            }, 100);
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
            if (this.collapseTargetProxy) {
                let sourcelayer = datastack[this.state.stackpointer];
                if (sourcelayer) {
                    let stacksource = sourcelayer.source;
                    if (stacksource) {
                        this.collapseTargetProxy.action = stacksource.action;
                        this.collapseTargetProxy.sourceinstanceid = stacksource.instanceid;
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
            if ((items.length > 1) && (!this.collapseTargetProxy)) {
                if (stacklayer.settings.scrollOffset !== null) {
                    setTimeout(() => {
                        this.scrollboxelement.current.scrollLeft = stacklayer.settings.scrollOffset;
                    });
                }
            }
        };
        /********************************************************
        -------------------[ assembly support ]------------------
        *********************************************************/
        // Lister item renderer
        this.getBox = (index, key) => {
            let { datastack, stackpointer } = this.state;
            if (!datastack)
                return null;
            if (!this.scrollboxelement.current)
                return null;
            let itemProxy = datastack[stackpointer].items[index];
            if (!itemProxy)
                return null;
            let stacklayer = datastack[stackpointer];
            let haspeers = (stacklayer && (stacklayer.items.length > 1));
            return this.getBoxComponent(itemProxy, index, haspeers, key);
        };
        this.getBoxComponent = (itemProxy, index, haspeers, key) => {
            // console.log('instanceid, index, key, path',itemProxy.instanceid,index,key, itemProxy.path)
            let containerHeight = this.scrollboxelement.current.offsetHeight;
            let matchForTarget = false;
            let { collapseTargetProxy } = this.state;
            if (collapseTargetProxy) {
                matchForTarget = (collapseTargetProxy.index == index);
            }
            let boxcallbacks = {
                // data fulfillment
                setListListener: this.setListListener,
                setItemListener: this.setItemListener,
                removeItemListener: this.removeItemListener,
                removeListListener: this.removeListListener,
                // animations and operations
                highlightBox: animations.highlightBox,
                splayBox: (domSource, listcomponent, listdoctoken) => {
                    this.splayBox(index, domSource, listcomponent, listdoctoken);
                },
                selectFromSplay: (domSource) => {
                    this.selectFromSplay(index, domSource);
                },
                expandDirectoryItem: (token, domSource) => {
                    this.expandDirectoryItem(index, token, domSource);
                },
                collapseDirectoryItem: this.collapseDirectoryItem,
                setBoxWidth: this.setBoxWidth,
            };
            return (<DataBox key={itemProxy.instanceid} itemProxy={itemProxy} collapseTargetProxy={matchForTarget ? collapseTargetProxy : null} haspeers={haspeers} index={index} containerHeight={containerHeight} boxwidth={this.state.boxwidth} callbacks={boxcallbacks}/>);
        };
        this.setBoxWidth = (width) => {
            this.setState({
                boxwidth: width,
            });
        };
        // this.quadcontentelement = React.createRef()
        // // animation dom elements
        // this.drillanimationblock = React.createRef()
        // this.originanimationblock = React.createRef()
        // this.maskanimationblock = React.createRef()
        // structure dom elements
        this.originelement = React.createRef();
        this.scrollboxelement = React.createRef();
        // components
        this.listcomponent = React.createRef();
        this.animationwrapper = React.createRef();
        // callbacks
        this.setItemListener = this.props.callbacks.setItemListener;
        this.setListListener = this.props.callbacks.setListListener;
        this.removeItemListener = this.props.callbacks.removeItemListener;
        this.removeListListener = this.props.callbacks.removeListListener;
        window.addEventListener('resize', this.onResize);
    }
    /********************************************************
    ------------------[ lifecycle methods ]------------------
    *********************************************************/
    componentDidMount() {
        // setting of datastack delayed because
        // scrollbox height must be available to set height of content items
        this.setState({
            datastack: this.props.datastack,
        });
    }
    componentDidUpdate() {
        // animation and visibilit based on return from descendant stack level
        if (!this.collapseTargetProxy)
            return;
        // keep; value will be purged
        let collapseTargetProxy = this.collapseTargetProxy;
        this.collapseTargetProxy = null;
        // get index for Lister
        let index = this.state.datastack[this.state.stackpointer].items
            .findIndex(this._findlinkIndex(collapseTargetProxy.sourceinstanceid));
        // update scroll display with selected highlight item
        collapseTargetProxy.index = index;
        setTimeout(() => {
            if (this.listcomponent && (this.state.datastack[this.state.stackpointer].items.length > 1)) {
                this.listcomponent.current.scrollAround(index);
            }
            setTimeout(() => {
                this.setState({
                    collapseTargetProxy,
                }, () => {
                    setTimeout(() => {
                        this.setState({
                            collapseTargetProxy: null
                        });
                    });
                });
            }, 300);
        });
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize);
    }
    /********************************************************
    ------------------------[ render ]-----------------------
    *********************************************************/
    render() {
        let { color, classes } = this.props;
        let { datastack } = this.state;
        let haspeers = datastack ? (this.state.datastack[this.state.stackpointer].items.length > 1) : false;
        let quadcontentStyle = {
            backgroundColor: color,
        };
        let viewportStyle = {
            backgroundColor: haspeers ? '#e8e8e8' : 'lightblue',
        };
        // Safari keeps scrollleft with content changes
        if (!haspeers && this.scrollboxelement.current && (this.scrollboxelement.current.scrollLeft != 0)) {
            this.scrollboxelement.current.scrollLeft = 0;
        }
        // useStaticSize Lister attribute below is required to avoid setState 
        // recursion overload and crash
        return (<AnimationWrapper ref={this.animationwrapper} quadcontentStyle={quadcontentStyle} scrollboxelement={this.scrollboxelement} originelement={this.originelement} boxwidth={this.state.boxwidth}>

            <QuadTitleBar title={'Account:'} quadidentifier={this.props.quadidentifier}/>
            <QuadOrigin stackpointer={this.state.stackpointer} stackdepth={datastack ? datastack.length : 0} incrementStackSelector={this.incrementStackSelector} decrementStackSelector={this.decrementStackSelector} ref={this.originelement}/>
            <div className={classes.viewportFrame}>
                <div className={classes.viewport} style={viewportStyle} ref={this.scrollboxelement}>
                    {haspeers
            ? <Lister axis='x' itemRenderer={this.getBox} length={datastack ? datastack[this.state.stackpointer].items.length : 0} type='uniform' ref={this.listcomponent} useStaticSize/>
            : this.getBox(0, 'singleton')}
                </div>
            </div>

        </AnimationWrapper>);
    }
}
export default withStyles(styles)(Quadrant);
//# sourceMappingURL=quadrant.controller.jsx.map