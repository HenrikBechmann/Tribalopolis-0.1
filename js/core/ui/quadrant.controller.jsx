// quadrant.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
/*
    TODO: keep scrollbox pos in settings when navigating stack levels
*/
'use strict';
import React from 'react';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { toast } from 'react-toastify';
import QuadOrigin from './quadrant/quadorigin.view';
import QuadContextBar from './quadrant/quadcontextbar.view';
import DataDrawer from './common/datadrawer.view';
import DataPane from './common/datapane.view';
import DataBox from './databox.controller';
import Lister from 'react-list';
import quadanimations from './quadrant/quadanimations.class';
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
        top: 'calc(32px + 2%)',
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
        webkitOverflowSrolling: 'touch',
        border: '1px solid gray',
        boxSizing: 'border-box',
        borderRadius: '8px',
        position: 'relative',
    },
    startscreen: {
        display: 'flex',
        position: 'absolute',
        height: '100%',
        width: '100%',
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 'larger',
        fontStyle: 'italic',
        fontWeight: 'bold',
        opacity: .54,
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
            boxwidth: 300,
            draweropen: false,
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
        -------------------[ databox assembly ]------------------
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
            let containerHeight = this.scrollboxelement.current.offsetHeight;
            let matchForTarget = false;
            let { activeTargetProxy } = this.state;
            if (activeTargetProxy) {
                matchForTarget = (activeTargetProxy.index == index);
            }
            let boxcallbacks = {
                // data fulfillment
                setDocumentListener: this.setDocumentListener,
                removeDocumentListener: this.removeDocumentListener,
                // animations and operations
                highlightBox: this.animations.highlightBox,
                splayBox: (domSource, listcomponent, listdoctoken) => {
                    this.operations.splayBox(index, domSource, listcomponent, listdoctoken);
                },
                selectFromSplay: (domSource) => {
                    this.operations.selectFromSplay(index, domSource);
                },
                expandDirectoryItem: (doctoken, domSource) => {
                    this.operations.expandDirectoryItem(index, doctoken, domSource);
                },
                collapseDirectoryItem: this.operations.collapseDirectoryItem,
                setBoxWidth: this.setBoxWidth,
                callDataDrawer: this.callDataDrawer,
            };
            let databox = <DataBox key={itemProxy.instanceid} itemProxy={itemProxy} collapseTargetProxy={matchForTarget ? activeTargetProxy : null} haspeers={haspeers} index={index} containerHeight={containerHeight - 1} boxwidth={this.state.boxwidth} callbacks={boxcallbacks}/>;
            return databox;
            // return haspeers?<div key = {key} data-key = {key} style = {{
            //     width:(this.state.boxwidth + 80) + 'px',
            //     height:'480px',
            //     border:'1px solid green',
            //     float:'left',
            //     overflow:'hidden',
            // }}>{databox}</div>:databox
        };
        this.setBoxWidth = (width) => {
            this.setState({
                boxwidth: width,
            });
        };
        this.closeDrawer = () => {
            this.drawerdatapackage = null;
            this.setState({
                draweropen: false,
            });
        };
        this.callDataDrawer = (docproxy, opcode) => {
            if (this.state.draweropen) {
                toast.info('The data shelf is in use. Close the shelf and try again.');
                return;
            }
            this.drawerdatapackage = { docproxy, opcode };
            this.setState({
                draweropen: true,
            });
        };
        this.setDefault = () => {
            let { datastack } = this.state;
            datastack[this.state.stackpointer].items = datastack[this.state.stackpointer].defaultitems;
            this.setState({
                datastack,
            });
        };
        // ----------[ refs ]----------
        this.drillanimationblock = React.createRef();
        this.originanimationblock = React.createRef();
        this.maskanimationblock = React.createRef();
        // animation source elements
        this.quadcontentelement = React.createRef();
        this.scrollboxelement = React.createRef();
        this.originelement = React.createRef();
        // components
        this.listcomponent = React.createRef();
        this.datadrawerelement = React.createRef();
        // ----------[ callbacks ]----------
        this.setDocumentListener = this.props.callbacks.setDocumentListener;
        this.removeDocumentListener = this.props.callbacks.removeDocumentListener;
        // ------[ delegation classes ]------
        this.animations = new quadanimations({
            scrollboxelement: this.scrollboxelement,
            originelement: this.originelement,
            quadcontentelement: this.quadcontentelement,
            originanimationblock: this.originanimationblock,
            maskanimationblock: this.maskanimationblock,
            drillanimationblock: this.drillanimationblock,
        });
        this.operations = new quadoperations({
            quadrant: this,
            animations: this.animations,
            listcomponent: this.listcomponent,
            scrollboxelement: this.scrollboxelement,
        });
        // -----------[ window listener ]-----------
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
        let isempty = datastack ? !(this.state.datastack[this.state.stackpointer].items.length) : true;
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
        return (<div className={classes.quadcontent} style={quadcontentStyle} ref={this.quadcontentelement}>
            <div ref={this.drillanimationblock}></div>
            <div ref={this.originanimationblock}></div>
            <div ref={this.maskanimationblock}></div>

            <QuadContextBar quadidentifier={this.props.quadidentifier} datastack={this.state.datastack} stackpointer={this.state.stackpointer} callbacks={this.props.callbacks} callDataDrawer={this.callDataDrawer}/>
            <QuadOrigin haspeers={haspeers} stackpointer={this.state.stackpointer} stackdepth={datastack ? datastack.length : 0} itemdepth={datastack ? datastack[this.state.stackpointer].items.length : 0} incrementStackSelector={this.operations.incrementStackSelector} decrementStackSelector={this.operations.decrementStackSelector} ref={this.originelement}/>
            <div className={classes.viewportFrame}>
                <DataDrawer open={this.state.draweropen} handleClose={this.closeDrawer} containerelement={this.quadcontentelement}>
                    <DataPane drawerDataPackage={this.drawerdatapackage}/>
                </DataDrawer>
                <div className={classes.viewport} style={viewportStyle} ref={this.scrollboxelement}>{!isempty ?
            haspeers
                ? <Lister axis='x' itemRenderer={this.getBox} length={datastack ? datastack[this.state.stackpointer].items.length : 0} type='uniform' ref={this.listcomponent} useStaticSize threshold={800}/>
                : this.getBox(0, 'singleton')
            :
                <div className={classes.startscreen} onClick={this.setDefault}>
                        <div>Tap to start</div>
                    </div>}
                </div>
            }
            </div>

        </div>);
    }
}
export default withStyles(styles)(Quadrant);
//# sourceMappingURL=quadrant.controller.jsx.map