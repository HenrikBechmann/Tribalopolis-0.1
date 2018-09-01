// databox.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
import BoxIdentifier from './databox/identitybar.view';
import BoxTypebar from './databox/typebar.view';
import DirectoryBar from './databox/directorybar.view';
import DirectoryList from './databox/directorylist.view';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
const styles = theme => ({
    button: {
        marginRight: theme.spacing.unit
    },
});
const BaseFloatingAddButton = (props) => {
    const { classes } = props;
    return <Button variant='fab' mini color='secondary' aria-label='Add' className={classes.button}>
      <AddIcon />
    </Button>;
};
const FloatingAddButton = withStyles(styles)(BaseFloatingAddButton);
class DataBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // opacity:1,
            boxProxy: this.props.boxProxy,
            highlightrefuid: this.props.highlightrefuid
        };
        this.doHighlights = (collapseBoxProxyForTarget) => {
            this.props.highlightBox(this.boxframe);
            if (collapseBoxProxyForTarget.action == 'expand' ||
                collapseBoxProxyForTarget.action == 'splay') {
                let dataref = collapseBoxProxyForTarget.liststack[collapseBoxProxyForTarget.liststack.length - 1];
                if (dataref) {
                    setTimeout(() => {
                        this.setState({
                            highlightrefuid: dataref.uid,
                        }, () => {
                            this.setState({
                                highlightrefuid: null
                            });
                        });
                    });
                }
            }
        };
        this.collapseDirectoryItem = () => {
            this.props.collapseDirectoryItem(this.state.boxProxy);
        };
        this.splayBox = (domSource) => {
            return this.props.splayBox(domSource, this.listcomponent);
        };
        this.highlightItem = (itemref) => {
            let itemelement = itemref.current;
            itemelement.classList.add('highlight');
            setTimeout(() => {
                itemelement.classList.remove('highlight');
            }, 2000);
        };
        this.modifybuttons = (listItemType) => {
            let outgoing = listItemType.properties.is.outgoing;
            let retval = outgoing ?
                <div style={{ position: 'absolute', bottom: '-8px', right: '0' }}>
                <FloatingAddButton />
            </div>
                :
                    null;
            return retval;
        };
        this.indexmarker = () => {
            return this.props.haspeers ?
                <div style={{
                    position: 'absolute',
                    bottom: '-16px',
                    left: '0',
                    fontSize: 'smaller',
                    color: 'gray',
                }}>{this.props.index + 1}</div>
                : null;
        };
        this.boxframe = React.createRef();
        this.listcomponent = React.createRef();
    }
    componentDidMount() {
        let { collapseBoxProxyForTarget } = this.props;
        // console.log('collapsing from componentdidMOUNT',collapseBoxProxyForTarget)
        // console.log('box componentdidMOUNT', this.state)
        if (!collapseBoxProxyForTarget)
            return;
        // console.log('didMOUNT collapseBoxProxyForTarget',collapseBoxProxyForTarget)
        this.collapseBoxProxyForTarget = collapseBoxProxyForTarget;
        setTimeout(() => {
            this.doHighlights(collapseBoxProxyForTarget);
            setTimeout(() => {
                this.collapseBoxProxyForTarget = null;
            }, 2000);
        });
    }
    componentDidUpdate() {
        let { collapseBoxProxyForTarget } = this.props;
        // console.log('box componentdidUPDATE', this.state)
        if (!collapseBoxProxyForTarget)
            return;
        // console.log('didupdate collapseBoxProxyForTarget',collapseBoxProxyForTarget)
        if (this.collapseBoxProxyForTarget)
            return; // avoid infinite recursion, triggered by list highlight
        this.collapseBoxProxyForTarget = collapseBoxProxyForTarget;
        setTimeout(() => {
            this.doHighlights(collapseBoxProxyForTarget);
            setTimeout(() => {
                this.collapseBoxProxyForTarget = null;
            }, 2000);
        });
    }
    componentWillReceiveProps(newProps) {
        // console.log('old and new boxProxy',this.state.boxProxy,newProps.boxProxy)
        if (this.state.boxProxy !== newProps.boxProxy) {
            this.setState({
                boxProxy: newProps.boxProxy,
            });
        }
    }
    render() {
        let { item, getList, haspeers } = this.props;
        let listStack = this.state.boxProxy.liststack;
        let { list: listroot } = item;
        let listref;
        if (listStack.length) {
            listref = listStack[listStack.length - 1];
        }
        else {
            listref = listroot;
        }
        let listobject = getList(listref);
        let frameStyle = {
            width: '300px',
            backgroundColor: 'white',
            border: this.collapseBoxProxyForTarget ? '1px solid blue' : '1px solid silver',
            maxHeight: '96%',
            minHeight: '60%',
            boxSizing: 'border-box',
            borderRadius: '8px',
            fontSize: 'smaller',
            boxShadow: haspeers ? 'none' : '0 0 12px black',
            margin: haspeers ? 'none' : 'auto',
        };
        let scrollboxstyle = {
            height: (this.props.containerHeight - 172) + 'px',
            overflow: 'auto',
            position: 'relative',
            paddingLeft: '6px',
            paddingBottom: '32px',
        };
        let listcount = listobject.list.length;
        let listItemType = this.props.getType(listobject.type);
        // placeholder logic for showing add button
        return <div style={{
            float: haspeers ? 'left' : 'none',
            padding: '16px',
        }}>
            <div style={frameStyle} ref={this.boxframe}>
            <BoxTypebar item={item} listcount={listcount} splayBox={this.splayBox} haspeers={this.props.haspeers} selectFromSplay={this.props.selectFromSplay}/>
            <BoxIdentifier item={item}/>
            <div style={{
            height: 'calc(100% - 70px)',
            position: 'relative',
        }}>
                <div>
                    <DirectoryBar item={item} getList={this.props.getList} listStack={this.state.boxProxy.liststack} collapseDirectoryItem={this.collapseDirectoryItem} haspeers={this.props.haspeers}/>
                </div>
                <div style={scrollboxstyle}>
                    <DirectoryList ref={this.listcomponent} listobject={listobject} highlightrefuid={this.state.highlightrefuid} getList={this.props.getList} expandDirectoryItem={this.props.expandDirectoryItem} highlightItem={this.highlightItem}/>
                </div>
                {this.modifybuttons(listItemType)}
                {this.indexmarker()}
            </div>
        </div>
        </div>;
    }
}
// <ProfileBar item = {item} />
// <ProfileForm item = {item} />
// <ScanBar item = {item} />
export default DataBox;
//# sourceMappingURL=databox.controller.jsx.map