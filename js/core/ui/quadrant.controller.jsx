// quadrant.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
/*
    TODO: keep scrollbox pos in settings when navigating stack levels
    TODO: rationalize render hierarchy
*/
'use strict';
import React from 'react';
import { withStyles, createStyles } from '@material-ui/core/styles';
import QuadOrigin from './quadrant/quadorigin.view';
import QuadTitleBar from './quadrant/quadtitlebar.view';
import DataBox from './databox.controller';
import Lister from 'react-list';
import quadanimations from './quadrant/quadanimations.utilities';
import quadoperations from './quadrant/quadoperations.class';
let styles = createStyles({
    quadcontent: {
        boxSizing: 'border-box',
        border: '3px outset gray',
        position: 'relative',
        borderRadius: '8px',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    },
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
            activeTargetProxy: null,
            boxwidth: 300
        };
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
        ----------------------[ animation ]---------------------
        *********************************************************/
        // animation calls
        this.animateToOrigin = () => {
            this.animations.animateToOrigin({
                sourceElement: this.scrollboxelement.current,
                originElement: this.originelement.current,
                containerElement: this.quadcontentelement.current,
                originAnimationElement: this.originanimationblock.current,
                maskAnimationElement: this.maskanimationblock.current,
            });
        };
        this.animateToDataBox = (domSource) => {
            this.animations.animateToDatabox({
                sourceElement: domSource,
                targetElement: this.scrollboxelement.current,
                containerElement: this.quadcontentelement.current,
                drillAnimationElement: this.drillanimationblock.current,
                boxwidth: this.props.boxwidth,
            });
        };
        this.animateToDataBoxList = (domSource) => {
            this.animations.animateToDataboxList({
                sourceElement: domSource,
                targetElement: this.scrollboxelement.current,
                containerElement: this.quadcontentelement.current,
                drillAnimationElement: this.drillanimationblock.current,
            });
        };
        this.animateOriginToDatabox = () => {
            this.animations.animateMask({
                sourceElement: this.scrollboxelement.current,
                containerElement: this.quadcontentelement.current,
                maskAnimationElement: this.maskanimationblock.current,
            });
            this.animations.animateOriginToDataBox({
                sourceElement: this.originelement.current,
                targetElement: this.scrollboxelement.current,
                containerElement: this.quadcontentelement.current,
                drillAnimationElement: this.drillanimationblock.current,
                boxwidth: this.props.boxwidth,
            });
        };
        this.animateOriginToDataBoxList = () => {
            this.animations.animateMask({
                sourceElement: this.scrollboxelement.current,
                containerElement: this.quadcontentelement.current,
                maskAnimationElement: this.maskanimationblock.current,
            });
            this.animations.animateOriginToDataBoxList({
                sourceElement: this.originelement.current,
                targetElement: this.scrollboxelement.current,
                containerElement: this.quadcontentelement.current,
                drillAnimationElement: this.drillanimationblock.current,
            });
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
            let { activeTargetProxy } = this.state;
            if (activeTargetProxy) {
                matchForTarget = (activeTargetProxy.index == index);
            }
            let boxcallbacks = {
                // data fulfillment
                setListListener: this.setListListener,
                setItemListener: this.setItemListener,
                removeItemListener: this.removeItemListener,
                removeListListener: this.removeListListener,
                // animations and operations
                highlightBox: this.animations.highlightBox,
                splayBox: (domSource, listcomponent, listdoctoken) => {
                    this.operations.splayBox(index, domSource, listcomponent, listdoctoken);
                },
                selectFromSplay: (domSource) => {
                    this.operations.selectFromSplay(index, domSource);
                },
                expandDirectoryItem: (token, domSource) => {
                    this.operations.expandDirectoryItem(index, token, domSource);
                },
                collapseDirectoryItem: this.operations.collapseDirectoryItem,
                setBoxWidth: this.setBoxWidth,
            };
            return (<DataBox key={itemProxy.instanceid} itemProxy={itemProxy} collapseTargetProxy={matchForTarget ? activeTargetProxy : null} haspeers={haspeers} index={index} containerHeight={containerHeight} boxwidth={this.state.boxwidth} callbacks={boxcallbacks}/>);
        };
        this.setBoxWidth = (width) => {
            this.setState({
                boxwidth: width,
            });
        };
        this.quadcontentelement = React.createRef();
        // animation dom elements
        this.drillanimationblock = React.createRef();
        this.originanimationblock = React.createRef();
        this.maskanimationblock = React.createRef();
        this.scrollboxelement = this.props.scrollboxelement;
        this.originelement = this.props.originelement;
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
        // delegate methods to a class
        this.operations = new quadoperations({
            quadrant: this,
            listcomponent: this.listcomponent,
            scrollboxelement: this.scrollboxelement,
        });
        this.animations = new quadanimations(null);
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
        if (!this.operations.isTargetProxy())
            return;
        // keep; value will be purged
        let activeTargetProxy = this.operations.getTargetProxy();
        this.operations.setTargetProxy(null);
        // get index for Lister
        let index = this.state.datastack[this.state.stackpointer].items
            .findIndex(this._findlinkIndex(activeTargetProxy.sourceinstanceid));
        // update scroll display with selected highlight item
        activeTargetProxy.index = index;
        setTimeout(() => {
            if (this.listcomponent && (this.state.datastack[this.state.stackpointer].items.length > 1)) {
                this.listcomponent.current.scrollAround(index);
            }
            setTimeout(() => {
                this.setState({
                    activeTargetProxy,
                }, () => {
                    setTimeout(() => {
                        this.setState({
                            activeTargetProxy: null
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
        return (<div style={Object.assign({}, styles.quadcontent, quadcontentStyle)} ref={this.quadcontentelement}>
            <div ref={this.drillanimationblock}></div>
            <div ref={this.originanimationblock}></div>
            <div ref={this.maskanimationblock}></div>

            <QuadTitleBar title={'Account:'} quadidentifier={this.props.quadidentifier}/>
            <QuadOrigin stackpointer={this.state.stackpointer} stackdepth={datastack ? datastack.length : 0} incrementStackSelector={this.operations.incrementStackSelector} decrementStackSelector={this.operations.decrementStackSelector} ref={this.originelement}/>
            <div className={classes.viewportFrame}>
                <div className={classes.viewport} style={viewportStyle} ref={this.scrollboxelement}>
                    {haspeers
            ? <Lister axis='x' itemRenderer={this.getBox} length={datastack ? datastack[this.state.stackpointer].items.length : 0} type='uniform' ref={this.listcomponent} useStaticSize/>
            : this.getBox(0, 'singleton')}
                </div>
            </div>

        </div>);
    }
}
export default withStyles(styles)(Quadrant);
//# sourceMappingURL=quadrant.controller.jsx.map