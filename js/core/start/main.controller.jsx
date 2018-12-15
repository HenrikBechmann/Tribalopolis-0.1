// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
// main.controller.tsx
/*
    bootstrap:
    1. index.html
    2. index.tsx
    3. main.controller
    4. main.view
    5. approuter
    6. routes
*/
/*
    TODO:
    - switch to setDocumentListener from getDocument
    - use setDocumentListener for user/account to sync with type
    - upgrade getDocument to getAsyncDocument == 'documentSubscribe'
    - defend against race condition of multiple adjacent async updates:
        sentinel for state, user, account updates
    - handle network failure - system data
    - add general error catch lifecycle method
*/
'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import React from 'react';
// TODO: temporary -- replace with application service
import coredata from '../../data/coredata';
let fontFamily = coredata.theme.typography.fontFamily;
import { DragDropContext } from 'react-dnd';
// import DnDHTMLBackend from 'react-dnd-html5-backend'
import DnDTouchBackend from 'react-dnd-touch-backend';
import DnDHtml5Backend from 'react-dnd-html5-backend';
// import DnDManager from 'react-dnd'
import application from '../services/application';
let isMobile = application.properties.ismobile;
let DnDBackend = isMobile ? DnDTouchBackend : DnDHtml5Backend;
import MainView from './main.view';
import authapi from '../services/auth.api';
import UserDataContext from '../services/userdata.context';
import SystemDataContext from '../services/systemdata.context';
import { toast } from 'react-toastify';
import { withStyles, createStyles } from '@material-ui/core/styles';
let styles = createStyles({
    mainviewstyle: {
        fontFamily: fontFamily,
    }
});
let Main = class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login: null,
            userProviderData: null,
            system: null,
            user: null,
            account: null,
        };
        this.promises = {
            system: {
                resolve: null,
                reject: null,
            },
            user: {
                resolve: null,
                reject: null,
            },
            account: {
                resolve: null,
                reject: null,
            },
        };
        this.setSystemPromise = () => {
            this.systemPromise = new Promise((resolvesystem, rejectsystem) => {
                this.promises.system.resolve = resolvesystem;
                this.promises.system.reject = rejectsystem;
            });
        };
        this.setLoginPromises = () => {
            this.setSystemPromise();
            this.userPromise = new Promise((resolveuser, rejectuser) => {
                this.promises.user.resolve = resolveuser;
                this.promises.user.reject = rejectuser;
            });
            this.accountPromise = new Promise((resolveaccount, rejectaccount) => {
                this.promises.account.resolve = resolveaccount;
                this.promises.account.reject = rejectaccount;
            });
        };
        // ==============================[ TRIGGER: LOGIN DATA ]=========================================
        // including login, user, account data
        this.updateLoginData = (login) => {
            // console.log('update login object',login)
            this.updatinguserdata = true;
            if (login) {
                if (!this.state.login) {
                    toast.success(`signed in as ${login.displayName}`, { autoClose: 2500 });
                }
                else {
                    toast.success(`updated data for ${login.displayName}`, { autoClose: 2500 });
                }
                this.setLoginPromises();
                let userProviderData = login.providerData[0]; // only google for now
                this.getSystemDocument();
                this.getUserDocument(userProviderData.uid); // and account document
                Promise.all([this.userPromise, this.accountPromise, this.systemPromise]).then(values => {
                    this.updatinguserdata = false;
                    this.setState({
                        login,
                        userProviderData,
                        user: values[0],
                        account: values[1],
                        system: values[2],
                    });
                }).catch(error => {
                    this.updatinguserdata = false;
                    toast.error('unable to get user data - signing out (' + error + ')');
                    // logout
                    authapi.googlesignout();
                });
            }
            else { // clear userdata
                this.setSystemPromise();
                this.getSystemDocument();
                this.systemPromise.then((system) => {
                    // console.log('updating state with empty login')
                    this.updatinguserdata = false;
                    this.setState({
                        login: null,
                        userProviderData: null,
                        user: null,
                        system,
                        account: null,
                    });
                }).catch(error => {
                    this.updatinguserdata = false;
                    toast.error('unable to set system data ' + error);
                    this.setState({
                        login: null,
                        userProviderData: null,
                        user: null,
                        system: null,
                        account: null,
                    });
                });
            }
        };
        // ==============================[ SYSTEM DOCUMENT ]=========================================
        this.getSystemDocument = () => {
            let parm = {
                reference: '/system/parameters',
                callback: this.systemDocumentSuccess,
                errorback: this.systemDocumentFailure,
            };
            application.getDocument(parm);
        };
        this.systemDocumentSuccess = data => {
            console.log('system from systemDocumentSucess', data);
            if ((!this.state.system) || this.updatinguserdata) {
                toast.success('setting system data');
                this.promises.system.resolve(data);
            }
            else {
                toast.success('updating system data');
                this.setState({
                    system: data,
                });
            }
        };
        this.systemDocumentFailure = error => {
            toast.error('Unable to get system data (' + error + ')');
            this.promises.system.reject('Unable to get system data (' + error + ')');
        };
        // ==============================[ USER DOCUMENT ]=========================================
        this.getUserDocument = uid => {
            let parms = {
                reference: 'users',
                whereclauses: [['identity.loginid.uid', '==', uid]],
                success: this.userDocumentSuccess,
                failure: this.userDocumentFailure,
            };
            application.queryForDocument(parms);
        };
        this.userDocumentSuccess = doclist => {
            // console.log('doclist from userdoc',doclist)
            if (!doclist.length) {
                this.userDocumentFailure('no user document found');
                return;
            }
            if (doclist.length > 1) {
                // toast.error('duplicate user id')
                this.userDocumentFailure('duplicate user id');
                return;
            }
            let user = doclist[0];
            console.log('user from userDocumentSucess', user);
            if ((!this.state.user) || this.updatinguserdata) {
                toast.success('setting user record');
                this.promises.user.resolve(user);
                this.getAccountDocument(user.data.identity.account);
            }
            else {
                this.setState({
                    user,
                });
            }
        };
        this.userDocumentFailure = error => {
            toast.error('unable to get user data (' + error + ')');
            this.promises.user.reject('unable to get user data (' + error + ')');
        };
        // ==============================[ ACCOUNT DOCUMENT ]=========================================
        this.getAccountDocument = reference => {
            let parm = {
                reference,
                callback: this.userAccountSuccess,
                errorback: this.userAccountFailure
            };
            application.getDocument(parm);
        };
        this.userAccountSuccess = (document, id) => {
            console.log('account doc and id from accountDocumentSucess', document, id);
            if (!document) {
                this.userAccountFailure('unable to get user account document');
                return;
            }
            let docpack = {
                data: document,
                id,
            };
            if ((!this.state.account) || this.updatinguserdata) {
                toast.success('setting account record');
                this.promises.account.resolve(docpack);
            }
            else {
                this.setState({
                    user: docpack,
                });
            }
        };
        this.userAccountFailure = error => {
            toast.error('unable to get account data' + error + ')');
            this.promises.account.reject('unable to get account data' + error + ')');
        };
        toast.info('resolving login status...');
        authapi.setUpdateCallback(this.updateLoginData);
    }
    // ==============================[ RENDER ]=========================================
    render() {
        let { globalmessage, version, classes } = this.props;
        let { userProviderData, user, account } = this.state;
        let userdata;
        if (!(userProviderData && user && account)) {
            userdata = null;
        }
        else {
            userdata = {
                login: this.state.userProviderData,
                user: this.state.user,
                account: this.state.account,
            };
        }
        // console.log('user data',userdata)
        return (<SystemDataContext.Provider value={this.state.system}>
                <UserDataContext.Provider value={userdata}>

                    <MainView globalmessage={globalmessage} className={classes.mainviewstyle}/>
                    
                </UserDataContext.Provider>
            </SystemDataContext.Provider>);
    }
};
Main = __decorate([
    DragDropContext(DnDBackend)
], Main);
export default withStyles(styles)(Main);
//# sourceMappingURL=main.controller.jsx.map