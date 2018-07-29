// databox.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
import BoxIdentifier from './views/databox/identitybar.view';
import BoxTypebar from './views/databox/typebar.view';
import CategoriesBar from './views/databox/categoriesbar.view';
import CategoriesList from './views/databox/categorylist.view';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
class DataBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            opacity: 0,
            boxconfig: this.props.boxConfig,
            highlightrefid: null,
        };
        this.expandCategory = (ref) => {
            let boxConfig = this.state.boxconfig;
            boxConfig.liststack.push(ref);
            this.setState({
                boxConfig,
            }, () => {
                let element = this.categoriesbarwrapper.current;
                element.classList.add('outlinehighlight');
                setTimeout(() => {
                    element.classList.remove('outlinehighlight');
                }, 2000);
            });
        };
        this.collapseCategory = () => {
            let boxConfig = this.state.boxconfig;
            let ref = boxConfig.liststack.pop();
            this.setState({
                boxConfig,
                highlightrefid: ref.id,
            }, () => {
                this.setState({
                    highlightrefid: null
                });
            });
        };
        this.highlightItem = (itemref) => {
            let itemelement = itemref.current;
            let clientoffset = 0;
            let element = itemelement;
            while (element && (element.getAttribute('data-marker') != 'databox-scrollbox')) {
                clientoffset += element.offsetTop;
                element = element.offsetParent;
            }
            let scrollelement = element;
            let diff = (clientoffset + itemelement.offsetHeight) - scrollelement.clientHeight;
            if (diff > 0) {
                scrollelement.scrollTop = diff;
            }
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
        this.categoriesbarwrapper = React.createRef();
    }
    componentDidMount() {
        this.setState({
            opacity: 1,
        });
    }
    render() {
        let { item, getListItem } = this.props;
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
            padding: '3px',
            boxSizing: 'border-box',
            borderRadius: '8px',
            marginRight: '16px',
            fontSize: 'smaller',
            opacity: this.state.opacity,
            transition: 'opacity .5s ease-out',
        };
        let scrollboxstyle = {
            height: 'calc(100% - 32px)',
            overflow: 'auto',
            position: 'relative',
        };
        let listcount = listobject.links.length;
        let listItemType = this.props.getListItemType(listobject.type);
        // placeholder logic for showing add button
        return <div style={frameStyle}>
            <BoxTypebar item={item} listcount={listcount} splayBox={this.props.splayBox}/>
            <BoxIdentifier item={item}/>
            <div style={{
            height: 'calc(100% - 70px)',
            position: 'relative',
        }}>
                <div ref={this.categoriesbarwrapper}>
                    <CategoriesBar item={item} getListItem={this.props.getListItem} listStack={this.state.boxconfig.liststack} collapseCategory={this.collapseCategory}/>
                </div>
                <div data-marker='databox-scrollbox' style={scrollboxstyle}>
                    <CategoriesList listobject={listobject} highlightrefid={this.state.highlightrefid} getListItem={this.props.getListItem} expandCategory={this.expandCategory} highlightItem={this.highlightItem}/>
                </div>
                {this.modifybuttons(listItemType)}
            </div>
        </div>;
    }
}
// <ProfileBar item = {item} />
// <ProfileForm item = {item} />
// <ScanBar item = {item} />
export default DataBox;
//# sourceMappingURL=databox.controller.jsx.map