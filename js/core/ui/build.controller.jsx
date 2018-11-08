// build.controller.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
/*
    TODO: straighten out dom tree; currently data drawer scrolls a bit
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
import UserContext from '../services/user.context';
import application from '../services/application';
import ActionButton from './common/actionbutton.view';
import DataDrawer from './common/datadrawer.view';
import BuildDataPane from './build/builddatapane.view';
const styles = theme => (createStyles({
    button: {
        margin: theme.spacing.unit,
    },
}));
class BuildController extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            values: {
                collection: 'types',
                id: '',
            },
            doc: {
                data: {},
                id: null,
            },
            draweropen: false,
        };
        this.savejson = null;
        this.latestjson = {};
        this.onResize = () => {
            this.forceUpdate();
        };
        // =================[ fetch ]==========================
        this.fetchObject = () => {
            if (!this.savejson || (confirm('replace current object?'))) {
                application.getDocument(`/${this.state.values.collection}/${this.state.values.id}`, this.fetchSuccessCallback, this.fetchErrorCallback);
            }
        };
        this.fetchSuccessCallback = (data, id) => {
            if (!data) {
                data = {};
                toast.warn('new object');
            }
            this.latestjson = data;
            this.savejson = data;
            this.setState({
                doc: {
                    data: data,
                    id: id
                }
            });
        };
        this.fetchErrorCallback = (error) => {
            toast.error(error);
        };
        // =================[ save/rollback ]==========================
        this.saveObject = () => {
            this.savejson = this.latestjson;
            toast.info('object saved');
        };
        this.rollbackObject = () => {
            this.latestjson = this.savejson;
            this.forceUpdate();
            toast.info('object was rolled back from most recent save');
        };
        // =================[ post ]==========================
        this.postObject = () => {
            if (confirm('Post this object?')) {
                application.setDocument(`/${this.state.values.collection}/${this.state.values.id}`, this.latestjson, this.postSuccessCallback, this.postFailureCallback);
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
                doc: {
                    data: {},
                    id: null,
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
        this.buildelement = React.createRef();
        window.addEventListener('resize', this.onResize); // to reacalc datadrawer maxwidth. There may be a better way
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize);
    }
    // ===============[ render ]==================
    render() {
        return <div style={{
            position: 'relative',
            height: '100vh',
        }} ref={this.buildelement}>
            <StandardToolbar />
            {!application.properties.ismobile ? <UserContext.Consumer>
            {user => {
            let superuser = !!(user && (user.uid == '112979797407042560714'));
            // console.log('user',superuser,user)
            return <div>

            <DataDrawer open={this.state.draweropen} handleClose={this.closeDrawer} containerelement={this.buildelement}>
                <BuildDataPane dataPack={this.drawerdatapackage} open={this.state.draweropen} user={user}/>
            </DataDrawer>
            <div style={{ position: 'absolute', top: '0', left: '0', paddingTop: '48px', overflow: 'auto', height: '100vh', width: '100%' }}>
            <div>This build utility is currently only available to Henrik Bechmann, the author.</div>

            <BaseForm onSubmit={this.fetchObject} disabled={!superuser}>
                <SelectField label={'Collection'} name='collection' value={this.state.values.collection} onChange={this.onChangeValue} helperText={'select an object to build'} options={[
                {
                    value: 'types',
                    text: 'Type',
                },
                {
                    value: 'schemes',
                    text: 'Scheme',
                },
                {
                    value: 'system',
                    text: 'System',
                },
                {
                    value: 'accounts',
                    text: 'Account',
                },
            ]}/>

                <TextField label='Id' name='id' value={this.state.values.id} onChange={this.onChangeValue} helperText='enter the id of the requested object'/>
                <ActionButton icon='list' action={() => {
                this.callDataDrawer('list', { collection: this.state.values.collection });
            }}/>
            </BaseForm>
            <div>
                <Button type='submit' variant='contained' onClick={this.fetchObject} className={this.props.classes.button} disabled={!superuser}>
                    Fetch
                </Button>
                <Button variant='contained' onClick={this.saveObject} className={this.props.classes.button}>
                    Save for Rollback
                </Button>
                <Button variant='contained' onClick={this.rollbackObject} className={this.props.classes.button}>
                    Rollback
                </Button>
                <Button variant='contained' onClick={this.postObject} className={this.props.classes.button} disabled={(!superuser) || (!this.savejson)}>
                    Post
                </Button>
                <Button variant='contained' onClick={this.clearObject} className={this.props.classes.button}>
                    Clear
                </Button>
            </div>
            <div>
                <ReactJson src={this.state.doc.data} onEdit={props => {
                this.latestjson = props.updated_src;
            }} onAdd={props => {
                this.latestjson = props.updated_src;
            }} onDelete={props => {
                this.latestjson = props.updated_src;
            }} name='document'/>
            </div>
            </div>
            </div>;
        }}
            </UserContext.Consumer>
            : <div>The build utility is only available on desktops</div>}
        </div>;
    }
}
export default withStyles(styles)(BuildController);
//# sourceMappingURL=build.controller.jsx.map