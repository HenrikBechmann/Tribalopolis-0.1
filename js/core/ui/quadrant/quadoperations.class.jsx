// quadoperations.class.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
import proxy from '../../../core/utilities/proxy';
class quadoperations {
    constructor({ quadrant, animations, listcomponent, scrollboxelement }) {
        // set from callback
        this.collapseTargetProxy = null;
        /********************************************************
        ----------------------[ operations ]---------------------
        *********************************************************/
        // for calls from quadrant.controller component
        this.isTargetProxy = () => {
            return !!this.collapseTargetProxy;
        };
        this.getTargetProxy = () => {
            return this.collapseTargetProxy;
        };
        this.setTargetProxy = value => {
            this.collapseTargetProxy = value;
        };
        //-------------------------------[ forward ]---------------------------
        this.expandDirectoryItem = (boxptr, listtoken, domSource) => {
            this.animations.animateToOrigin();
            this.animations.animateToDataBox(domSource, this.quadrant.state.boxwidth);
            let { datastack, stackpointer } = this.quadrant.state;
            this._captureSettings(stackpointer, datastack);
            let itemProxy = datastack[stackpointer].items[boxptr];
            stackpointer++;
            let newstacklayer = { items: [], settings: {}, source: {
                    instanceid: itemProxy.instanceid,
                    itemProxy,
                    token: itemProxy.token,
                    action: 'expand',
                } };
            // replace forward stack items
            datastack.splice(stackpointer, datastack.length, newstacklayer);
            let newItemProxy = new proxy({ token: itemProxy.token });
            newItemProxy.liststack.push(listtoken);
            newstacklayer.items.push(newItemProxy);
            setTimeout(() => {
                this.quadrant.setState({
                    stackpointer,
                    datastack,
                });
            }, 100);
        };
        this.splayBox = (boxptr, domSource, sourcelistcomponent, listDocument) => {
            let visiblerange = sourcelistcomponent.current.getVisibleRange();
            this.animations.animateToOrigin();
            this.animations.animateToDataBoxList(domSource);
            let { datastack, stackpointer } = this.quadrant.state;
            this._captureSettings(stackpointer, datastack);
            let itemProxy = datastack[stackpointer].items[boxptr];
            let itemToken = itemProxy.token;
            let listtokens = listDocument.data.lists;
            if (!listtokens || !listtokens.length)
                return;
            stackpointer++;
            let newstacklayer = { items: [], settings: {}, source: {
                    instanceid: itemProxy.instanceid,
                    itemProxy,
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
                this.quadrant.setState({
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
            this.animations.animateToOrigin();
            this.animations.animateToDataBox(domSource, this.quadrant.state.boxwidth);
            let { datastack, stackpointer } = this.quadrant.state;
            this._captureSettings(stackpointer, datastack);
            let itemProxy = datastack[stackpointer].items[boxptr];
            let itemToken = itemProxy.token;
            stackpointer++;
            let newstacklayer = { items: [], settings: {}, source: {
                    instanceid: itemProxy.instanceid,
                    itemProxy,
                    token: itemProxy.token,
                    action: 'select',
                } };
            // replace forward stack items
            datastack.splice(stackpointer, datastack.length, newstacklayer);
            let newItemProxy = new proxy({ token: itemToken });
            newItemProxy.liststack = itemProxy.liststack.slice(); // copy
            newstacklayer.items.push(newItemProxy);
            setTimeout(() => {
                this.quadrant.setState({
                    stackpointer,
                    datastack,
                });
            }, 100);
        };
        this.incrementStackSelector = () => {
            let { stackpointer, datastack } = this.quadrant.state;
            this._captureSettings(stackpointer, datastack);
            let depth = datastack.length;
            if (stackpointer < (depth - 1)) {
                stackpointer++;
                this.quadrant.setState({
                    stackpointer,
                    datastack,
                }, () => {
                    this._applySettings(stackpointer, datastack);
                });
            }
        };
        //-------------------------------[ backward ]----------------------------
        this.collapseDirectoryItem = (itemProxy) => {
            if (this.quadrant.state.stackpointer) {
                let targetStackLayer = this.quadrant.state.datastack[this.quadrant.state.stackpointer - 1];
                if (targetStackLayer.items.length > 1) {
                    this.animations.animateOriginToDataBoxList();
                }
                else {
                    this.animations.animateOriginToDatabox(this.quadrant.state.boxwidth);
                }
            }
            setTimeout(() => {
                this.collapseTargetProxy = Object.assign({}, itemProxy);
                this.decrementStackSelector();
            }, 100);
        };
        this.decrementStackSelector = () => {
            let { stackpointer, datastack } = this.quadrant.state;
            this._captureSettings(stackpointer, datastack);
            this._updateCollapseSettings(stackpointer, datastack);
            if (stackpointer > 0) {
                stackpointer--;
                this.quadrant.setState({
                    stackpointer,
                    datastack,
                }, () => {
                    this._applySettings(stackpointer, datastack);
                });
            }
        };
        this._updateCollapseSettings = (stackpointer, datastack) => {
            if (this.collapseTargetProxy) {
                let sourcelayer = datastack[this.quadrant.state.stackpointer];
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
        this.quadrant = quadrant;
        this.listcomponent = listcomponent;
        this.scrollboxelement = scrollboxelement;
        this.animations = animations;
    }
}
export default quadoperations;
//# sourceMappingURL=quadoperations.class.jsx.map