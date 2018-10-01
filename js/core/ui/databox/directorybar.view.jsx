// directorybar.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import React from 'react';
import Icon from '@material-ui/core/Icon';
import CircularProgress from '@material-ui/core/CircularProgress';
import QuantityBadge from '../common/quantitybadge.view';
import ActionButton from '../common/actionbutton.view';
import { withStyles, createStyles } from '@material-ui/core/styles';
const styles = createStyles({
    barstyle: {
        width: '100%',
        borderRadius: '8px 8px 0 0',
        paddingTop: '3px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        boxSizing: 'border-box',
        top: '0',
        backgroundColor: '#f2f2f2',
        zIndex: 1,
    },
    rowwrapperstyle: {
        borderBottom: '1px solid silver',
        position: 'relative',
    },
    rowstyle: {
        display: 'inline-block',
        position: 'relative',
        paddingRight: '3px',
        marginLeft: '7px',
        marginTop: '3px',
        // backgroundColor:'white',
        maxWidth: 'calc(100% - 80px)',
    },
    namestyle: {
        display: 'inline-block',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        maxWidth: '90%',
        overflow: 'hidden',
        marginBottom: '6px',
        verticalAlign: 'bottom',
        paddingLeft: '3px',
    },
    countstyle: {
        fontSize: 'smaller',
        color: 'silver',
    },
    arrowstyle: {
        float: 'right',
        width: '32px',
        height: '32px',
        position: 'relative',
    },
    progress: {
        height: '33px',
    }
});
class DirectoryBar extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            list: null
        };
        this.cacheListDocument = (document, type) => {
            this.setState({
                list: {
                    document,
                    type
                }
            });
        };
    }
    componentDidUpdate() {
        if (!this.listProxy && this.props.listProxy) {
            this.listProxy = this.props.listProxy;
            this.props.setListListener(this.listProxy.token, this.listProxy.instanceid, this.cacheListDocument);
        }
    }
    componentWillUnmount() {
        if (this.listProxy) {
            this.props.removeListListener(this.listProxy.token, this.listProxy.instanceid);
        }
    }
    render() {
        let { listStack, classes } = this.props;
        let listDocument = this.state.list ? this.state.list.document : null;
        return <div>
            <div className={classes.barstyle}>
                {listDocument
            ? (<div className={classes.rowwrapperstyle}>

                    <ActionButton icon='more_vert'/>
                    {listStack.length
                ? <div className={classes.arrowstyle}>

                            <QuantityBadge quantity={listStack.length} style={{ left: '-8px', top: '-4px' }}/>
                            <ActionButton icon='arrow_back' action={this.props.collapseDirectoryItem}/>

                        </div>
                : null}
                    <div className={classes.rowstyle}> 

                        <Icon style={{ verticalAlign: 'baseline' }}>folder_open</Icon> 
                        {false && <QuantityBadge quantity={listDocument.counts.lists + listDocument.counts.links} style={{ left: '-6px', top: '-8px' }}/>}
                        <div className={classes.namestyle}>
                            {listDocument.properties.name} <span className={classes.countstyle}>{listDocument.counts.lists + listDocument.counts.links}</span>
                        </div>

                    </div>

                </div>)
            : <div className={classes.progress}>

                    <CircularProgress size={12}/>

                </div>}
            </div>
            
        </div>;
    }
}
export default withStyles(styles)(DirectoryBar);
//# sourceMappingURL=directorybar.view.jsx.map