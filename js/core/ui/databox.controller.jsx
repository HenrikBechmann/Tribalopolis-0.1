// databox.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
import BoxIdentifier from './views/databox/identitybar.view';
import BoxTypebar from './views/databox/typebar.view';
import CategoriesBar from './views/databox/categoriesbar.view';
import CategoryList from './views/databox/categorylist.view';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
class DataBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            opacity: 0,
            boxconfig: this.props.boxConfig,
            highlightrefuid: this.props.highlightrefuid
        };
        this.collapseCategory = () => {
            this.props.collapseCategory(this.state.boxconfig);
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
            let retval = (outgoing) ? <div style={{ position: 'absolute', bottom: '-8px', right: '0' }}>
            <FloatingActionButton secondary={true} mini={true} style={{ marginRight: '12px' }}>
              <ContentAdd />
            </FloatingActionButton>
        </div> : null;
            return retval;
        };
        this.boxframe = React.createRef();
    }
    componentDidMount() {
        this.setState({
            opacity: 1,
        }, () => {
            let { collapseBoxConfigForTarget } = this.props;
            if (collapseBoxConfigForTarget) {
                this.props.highlightBox(this.boxframe);
                if (collapseBoxConfigForTarget.action == 'expand' ||
                    collapseBoxConfigForTarget.action == 'splay') {
                    let dataref = collapseBoxConfigForTarget.liststack[collapseBoxConfigForTarget.liststack.length - 1];
                    if (dataref) {
                        this.setState({
                            highlightrefuid: dataref.uid,
                        }, () => {
                            this.setState({
                                highlightrefuid: null
                            });
                        });
                    }
                }
            }
        });
    }
    componentWillReceiveProps(newProps) {
        // console.log('old and new boxconfig',this.state.boxconfig,newProps.boxConfig)
        if (this.state.boxconfig !== newProps.boxConfig) {
            this.setState({
                boxconfig: newProps.boxConfig,
            });
        }
    }
    render() {
        let { item, getListItem, haspeers } = this.props;
        let listStack = this.state.boxconfig.liststack;
        let { listref: listroot } = item;
        let listref;
        if (listStack.length) {
            listref = listStack[listStack.length - 1];
        }
        else {
            listref = listroot;
        }
        let listobject = getListItem(listref);
        let frameStyle = {
            width: '300px',
            backgroundColor: 'white',
            border: '1px solid silver',
            maxHeight: '96%',
            minHeight: '60%',
            boxSizing: 'border-box',
            borderRadius: '8px',
            fontSize: 'smaller',
            opacity: this.state.opacity,
            transition: 'opacity .5s ease-in',
            boxShadow: haspeers ? 'none' : '0 0 12px black',
        };
        let scrollboxstyle = {
            height: (this.props.containerHeight - 172) + 'px',
            overflow: 'auto',
            position: 'relative',
            paddingLeft: '6px',
            paddingBottom: '32px',
        };
        let listcount = listobject.links.length;
        let listItemType = this.props.getListItemType(listobject.type);
        // placeholder logic for showing add button
        return <div style={{ float: 'left', padding: '16px' }}>
            <div style={frameStyle} ref={this.boxframe}>
            <BoxTypebar item={item} listcount={listcount} splayBox={this.props.splayBox} haspeers={this.props.haspeers} selectFromSplay={this.props.selectFromSplay}/>
            <BoxIdentifier item={item}/>
            <div style={{
            height: 'calc(100% - 70px)',
            position: 'relative',
        }}>
                <div>
                    <CategoriesBar item={item} getListItem={this.props.getListItem} listStack={this.state.boxconfig.liststack} collapseCategory={this.collapseCategory} haspeers={this.props.haspeers}/>
                </div>
                <div data-marker='databox-scrollbox' style={scrollboxstyle}>
                    <CategoryList listobject={listobject} highlightrefuid={this.state.highlightrefuid} getListItem={this.props.getListItem} expandCategory={this.props.expandCategory} highlightItem={this.highlightItem}/>
                </div>
                {this.modifybuttons(listItemType)}
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