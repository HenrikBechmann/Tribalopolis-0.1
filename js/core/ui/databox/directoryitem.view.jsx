// directoryitem.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import React from 'react';
import Icon from '@material-ui/core/Icon';
import CircularProgress from '@material-ui/core/CircularProgress';
import ActionButton from '../common/actionbutton.view';
import QuantityBadge from '../common/quantitybadge.view';
import { withStyles, createStyles } from '@material-ui/core/styles';
const styles = createStyles({
    barstyle: {
        padding: '3px',
        height: '30px',
        boxSizing: 'border-box',
        cursor: 'pointer',
        position: 'relative',
        borderBottom: '1px solid #e2e6e9',
    },
    rowstyle: {
        display: 'inline-block',
        position: 'relative',
        verticalAlign: 'middle',
        paddingRight: '3px',
        marginLeft: '-1px',
        marginBottom: '-1px',
        // backgroundColor:'white',
        maxWidth: '90%',
        whiteSpace: 'nowrap',
    },
    namestyle: {
        display: 'inline-block',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        maxWidth: '92%',
        textOverflow: 'ellipsis',
        verticalAlign: 'middle',
        paddingLeft: '3px',
    },
    countstyle: {
        fontSize: 'smaller',
        color: 'silver',
    },
    progress: { height: '25px' },
});
class DirectoryItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: null,
        };
        this.cacheListDocument = (document, type) => {
            this.setState({
                list: {
                    document,
                    type
                }
            });
        };
        this.expandDirectoryItem = () => {
            this.props.expandDirectoryItem(this.barelementref.current);
        };
        this.barelementref = React.createRef();
    }
    componentDidMount() {
        if ((!this.listProxy) && this.props.listProxy) {
            this.listProxy = this.props.listProxy;
            this.props.setListListener(this.listProxy.token, this.listProxy.instanceid, this.cacheListDocument);
        }
    }
    componentDidUpdate() {
        if (this.props.highlight && this.barelementref) {
            this.props.highlightItem(this.barelementref);
        }
    }
    componentWillUnmount() {
        if (this.listProxy) {
            this.props.removeListListener(this.listProxy.token, this.listProxy.instanceid);
        }
    }
    render() {
        let { classes } = this.props;
        let listDocument = this.state.list ? this.state.list.document : null;
        let quantity = listDocument ? (listDocument.counts.lists + listDocument.counts.links) : 0;
        return <div className={classes.barstyle} onClick={this.expandDirectoryItem} ref={this.barelementref}>
            {listDocument
            ? <div className={classes.rowstyle}> 
                        {quantity ? <ActionButton buttonStyle={{
                float: 'none',
                width: '24px',
                height: '24px',
            }} icon='arrow_right' action={(e) => {
                e.stopPropagation();
            }}/> : <div style={{
                display: 'inline-block',
                width: '24px',
                height: '24px',
                verticalAlign: 'top',
            }}></div>}
                        <Icon style={{
                verticalAlign: 'middle',
                color: listDocument ? listDocument.system.attributes.sysnode ? 'green' : 'gray' : 'gray',
            }}>
                            folder
                        </Icon> 

                        <div className={classes.namestyle}>
                            {listDocument.properties.name}  <span className={classes.countstyle}>{listDocument.counts.lists +
                listDocument.counts.links}</span>
                        </div>

                        {false && <QuantityBadge quantity={quantity} style={{
                left: '-10px',
                top: '-5px',
            }}/>}

                    </div>
            : <div className={classes.progress}> 
                    <CircularProgress size={16}/>
                </div>}
        </div>;
    }
}
export default withStyles(styles)(DirectoryItem);
//# sourceMappingURL=directoryitem.view.jsx.map