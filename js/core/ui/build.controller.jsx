// build.controller.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
/*
    TODO: straighten out dom tree; currently data drawer scrolls a bit
    allow update of data drawer for benign requests
*/
'use strict';
import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles, createStyles } from '@material-ui/core/styles';
import ReactJson from 'react-json-view';
import { toast } from 'react-toastify';
import StandardToolbar from './common/standardtoolbar.view';
import BaseForm from './input/baseform.view';
import SelectField from './input/selectfield.view';
import TextField from './input/textfield.view';
import UserDataContext from '../services/userdata.context';
import application from '../services/application';
import typefilter from '../services/type.filter';
import ActionButton from './common/actionbutton.view';
import DataDrawer from './common/datadrawer.view';
import BuildDataPane from './build/builddatapane.view';
const styles = theme => (createStyles({
    button: {
        margin: theme.spacing.unit,
    },
    panewrapper: {
        position: 'absolute',
        top: '0',
        left: '0',
        paddingTop: '48px',
        overflow: 'auto',
        height: '100vh',
        width: '100%'
    },
    pagewrapper: {
        position: 'relative',
        height: '100vh',
    },
    jsoninput: {
        border: '1px solid gray',
        padding: '3px',
        margin: '6px',
    }
}));
class BuildController extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            values: {
                collection: 'types',
                id: '',
                json: '',
            },
            docpack: {
                document: {},
                reference: null,
            },
            draweropen: false,
        };
        this.savejson = null;
        this.latestjson = {};
        this.onResize = () => {
            this.forceUpdate();
        };
        // =================[ apply ]=========================
        this.applyJson = () => {
            if (!this.savejson || (confirm('replace current object?'))) {
                let data = this.state.values.json;
                try {
                    data = JSON.parse(data);
                }
                catch (e) {
                    alert('invalid json');
                    return;
                }
                this.latestjson = data;
                this.savejson = data;
                this.setState({
                    docpack: {
                        document: data,
                        refernce: this.state.values.collection + '/' + this.state.values.id
                    }
                }, () => {
                    if (data.identity) {
                        let typetoken = data.identity.type;
                        if (typetoken) {
                            let typeref = typetoken.reference;
                            if (typeref) {
                                let parmblock = {
                                    reference: typeref,
                                    success: this.fetchTypeSuccessCallback,
                                    failure: this.fetchTypeErrorCallback,
                                };
                                application.getDocument(parmblock);
                            }
                        }
                    }
                });
            }
        };
        // =================[ fetch ]==========================
        this.fetchObject = () => {
            if (!this.savejson || (confirm('replace current object?'))) {
                if (!this.state.values.collection) {
                    toast.error('collection required');
                    return;
                }
                if (this.state.values.collection && (!this.state.values.id)) {
                    let parm = {
                        reference: this.state.values.collection,
                        success: this.fetchSuccessCallback,
                        failure: this.fetchErrorCallback,
                    };
                    application.getNewDocument(parm);
                }
                else {
                    let parm = {
                        reference: `/${this.state.values.collection}/${this.state.values.id}`,
                        success: this.fetchSuccessCallback,
                        failure: this.fetchErrorCallback,
                    };
                    application.getDocument(parm);
                }
            }
        };
        this.fetchSuccessCallback = ({ docpack, reason }) => {
            let newobject = false;
            let data = docpack.document;
            if (!data) {
                data = {};
                toast.warn('new object');
                newobject = true;
            }
            this.latestjson = data;
            this.savejson = data;
            let values = this.state.values;
            if (newobject) {
                values.id = docpack.reference.split('/').slice(-1)[0]; // last element
            }
            this.setState({
                values,
                docpack
            }, () => {
                if (data.identity) {
                    let typetoken = data.identity.type;
                    if (typetoken) {
                        let typeref = typetoken.reference;
                        if (typeref) {
                            let parm = {
                                reference: typeref,
                                success: this.fetchTypeSuccessCallback,
                                failure: this.fetchTypeErrorCallback,
                            };
                            application.getDocument(parm);
                        }
                    }
                }
            });
        };
        this.fetchErrorCallback = error => {
            toast.error(error);
        };
        // apply type template to document
        this.fetchTypeSuccessCallback = ({ docpack, reason }) => {
            let typepack = docpack;
            this.doctypepack = typepack;
            toast.info('type has also been loaded (' + docpack.reference + ')');
            let results = typefilter.assertType(this.state.docpack.document, this.doctypepack.document);
            if (results.changed) {
                this.latestjson = results.document;
                this.savejson = results.document;
                this.setState({
                    docpack: {
                        document: results.document,
                        reference: this.state.docpack.reference,
                    }
                });
                results.changed && toast.info('document data has been upgraded by type (' + docpack.reference + ')');
            }
        };
        this.fetchTypeErrorCallback = error => {
            toast.error('error getting type' + error);
        };
        // =================[ save/rollback ]==========================
        this.saveObject = () => {
            this.savejson = this.latestjson;
            toast.info('object saved');
        };
        this.rollbackObject = () => {
            this.latestjson = Object.assign({}, this.savejson); // for react to recognize new object
            this.forceUpdate();
            toast.info('object was rolled back from most recent save');
        };
        // =================[ post ]==========================
        this.postObject = () => {
            if (confirm('Post this object?')) {
                let parm = {
                    reference: `/${this.state.values.collection}/${this.state.values.id}`,
                    document: this.latestjson,
                    success: this.postSuccessCallback,
                    failure: this.postFailureCallback,
                };
                application.setDocument(parm);
            }
        };
        this.postSuccessCallback = () => {
            toast.info('object was successfully posted');
        };
        this.postFailureCallback = (error) => {
            toast.error(error);
        };
        // =================[ clear ]==========================
        this.clearObject = () => {
            this.savejson = null;
            this.latestjson = {};
            this.setState({
                docpack: {
                    data: {},
                    reference: null,
                }
            });
            toast.info('object was cleared');
        };
        // ==============[ ui field change responses ]================
        this.onChangeValue = event => {
            let { values } = this.state;
            values[event.target.name] = event.target.value;
            this.setState({ values });
        };
        // ============[ data drawer responses ]=================
        this.callDataDrawer = (opcode, specs) => {
            if (this.state.draweropen) {
                toast.info('The data shelf is in use. Close the shelf and try again.');
                return;
            }
            this.drawerdatapackage = { specs, opcode };
            this.setState({
                draweropen: true,
            });
        };
        this.closeDrawer = () => {
            this.drawerdatapackage = null;
            this.setState({
                draweropen: false,
            });
        };
        // ===============[ render ]==================
        // --------[ sections of the renderpage follow ]--------
        this.datadrawer = login => (<DataDrawer open={this.state.draweropen} handleClose={this.closeDrawer} containerelement={this.buildelement}>
            <BuildDataPane dataspecs={this.drawerdatapackage} open={this.state.draweropen} user={login}/>
        </DataDrawer>);
        this.inputcontrols = (superuser, classes) => (<BaseForm onSubmit={this.fetchObject} disabled={!superuser}>
            <SelectField label={'Collection'} name='collection' value={this.state.values.collection} onChange={this.onChangeValue} helperText={'select an object to build'} options={[
            {
                value: 'types',
                text: 'Types',
            },
            {
                value: 'schemes',
                text: 'Schemes',
            },
            {
                value: 'system',
                text: 'System',
            },
            {
                value: 'accounts',
                text: 'Accounts',
            },
            {
                value: 'users',
                text: 'Users',
            },
            {
                value: 'handles',
                text: 'Handles',
            },
            {
                value: 'pages',
                text: 'Pages',
            },
            {
                value: 'links',
                text: 'Links',
            },
        ]}/>

            <TextField label='Id' name='id' value={this.state.values.id} onChange={this.onChangeValue} helperText='enter the id of the requested object'/>
            <ActionButton icon='list' action={() => {
            this.callDataDrawer('list', { collection: this.state.values.collection });
        }}/>
        </BaseForm>); //--end
        this.datacontrols = (superuser, classes) => (<React.Fragment>
        <div>
            <p>For a new object, fetch without an id</p>
            <Button type='submit' variant='contained' onClick={this.fetchObject} className={classes.button} disabled={!superuser}>
                Fetch
            </Button>
            <Button variant='contained' onClick={this.saveObject} className={classes.button}>
                Save for Rollback
            </Button>
            <Button variant='contained' onClick={this.rollbackObject} className={classes.button}>
                Rollback
            </Button>
            <Button variant='contained' onClick={this.postObject} className={classes.button} disabled={((!superuser) || (!this.savejson))}>
                Post
            </Button>
            <Button variant='contained' onClick={this.clearObject} className={classes.button}>
                Clear
            </Button>
        </div>
        </React.Fragment>);
        this.jsoneditor = () => {
            return <div>

            <ReactJson src={this.latestjson} onEdit={props => {
                this.latestjson = props.updated_src;
            }} onAdd={props => {
                this.latestjson = props.updated_src;
            }} onDelete={props => {
                this.latestjson = props.updated_src;
            }} name='document'/>

        </div>;
        };
        this.jsoninput = (superuser, classes) => (<div className={classes.jsoninput}>
        <Button type='submit' variant='contained' onClick={this.applyJson} className={classes.button} disabled={!superuser}>
            Apply Json
        </Button>
        <BaseForm onSubmit={this.applyJson} disabled={!superuser}>
            <TextField label='Json' name='json' value={this.state.values.json} onChange={this.onChangeValue} multiline helperText='paste in or create json'/>
        </BaseForm> 
        </div>);
        this.buildelement = React.createRef();
        window.addEventListener('resize', this.onResize); // to reacalc datadrawer maxwidth. There may be a better way
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize);
    }
    render() {
        const { classes } = this.props;
        // --------------[ return component ]--------------
        return <div className={classes.pagewrapper} ref={this.buildelement}>
            <StandardToolbar />

            {!application.properties.ismobile ?
            <UserDataContext.Consumer>

                {userdata => {
                let login = userdata ? userdata.login : null;
                let superuser = !!(login && (login.uid == '112979797407042560714'));
                return (<div>

                        {this.datadrawer(login)}

                        <div className={classes.panewrapper}>

                            <div>This build utility is currently only available to Henrik Bechmann, the author.</div>

                            {this.inputcontrols(superuser, classes)}

                            {this.datacontrols(superuser, classes)}

                            {this.jsoneditor()}

                            {this.jsoninput(superuser, classes)}

                        </div>

                    </div>);
            }}

            </UserDataContext.Consumer>
            : <div>The build utility is only available on desktops</div>}

        </div>;
    }
}
export default withStyles(styles)(BuildController);
//# sourceMappingURL=build.controller.jsx.map