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
    - getSystem data should be synchronized with get login data -- system data first
        - integrate with updateUserData - call it updateSystemControlData perhaps
    - collect fetch of login, user, and account together with promise collection
        so as to render only once for those
    - accomodate need to asynchronously update account and user data from other sources
        (user and account document listeners)
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
        this.systemPromise = new Promise((resolvesystem, rejectsystem) => {
            this.promises.system.resolve = resolvesystem;
            this.promises.system.reject = rejectsystem;
        });
        this.userPromise = new Promise((resolveuser, rejectuser) => {
            this.promises.user.resolve = resolveuser;
            this.promises.user.reject = rejectuser;
        });
        this.accountPromise = new Promise((resolveaccount, rejectaccount) => {
            this.promises.account.resolve = resolveaccount;
            this.promises.account.reject = rejectaccount;
        });
        this.updateUserData = (login) => {
            if (login) {
                toast.success(`signed in as ${login.displayName}`, { autoClose: 2500 });
                let userProviderData = login.providerData[0]; // only google for now
                this.getUserDocument(userProviderData.uid);
                this.getSystemData();
                Promise.all([this.userPromise, this.accountPromise, this.systemPromise]).then(values => {
                    this.setState({
                        login,
                        userProviderData,
                        user: values[0],
                        account: values[1],
                        system: values[2],
                    });
                }).catch(error => {
                    toast.error('unable to get user data (' + error + ')');
                    // logout
                    authapi.googlesignout();
                });
            }
            else { // clear userdata
                let systemPromise = new Promise((resolvesystem, rejectsystem) => {
                    this.promises.system.resolve = resolvesystem;
                    this.promises.system.reject = rejectsystem;
                });
                this.getSystemData();
                systemPromise.then((system) => {
                    this.setState({
                        login: null,
                        userProviderData: null,
                        user: null,
                        system,
                        account: null,
                    });
                });
            }
        };
        this.getSystemData = () => {
            application.getDocument('/system/parameters', this.getSystemDataCallback, this.getSystemDataError);
        };
        this.getSystemDataCallback = data => {
            toast.success('setting system data');
            this.promises.system.resolve(data);
            // this.setState({
            //     system:data,
            // })
        };
        this.getSystemDataError = error => {
            toast.error('Unable to get system data (' + error + ')');
            this.promises.system.reject('Unable to get system data (' + error + ')');
        };
        this.getUserDocument = uid => {
            application.queryCollection('users', [['identity.loginid.uid', '==', uid]], this.userDocumentSuccess, this.userDocumentFailure);
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
            toast.success('setting user record');
            let user = doclist[0];
            this.promises.user.resolve(user);
            this.getAccountDocument(user.data.identity.account);
        };
        this.userDocumentFailure = error => {
            toast.error('unable to get user data (' + error + ')');
            this.promises.user.reject('unable to get user data (' + error + ')');
        };
        this.getAccountDocument = reference => {
            application.getDocument(reference, this.userAccountSuccess, this.userAccountFailure);
        };
        this.userAccountSuccess = (document, id) => {
            if (!document) {
                this.userAccountFailure('unable to get user account document');
                return;
            }
            let docpack = {
                data: document,
                id,
            };
            toast.success('setting account record');
            this.promises.account.resolve(docpack);
        };
        this.userAccountFailure = error => {
            toast.error('unable to get account data' + error + ')');
            this.promises.account.reject('unable to get account data' + error + ')');
        };
        // this.getSystemData() // integrate with updateUserData (but call initapp or some such)
        authapi.setUpdateCallback(this.updateUserData); // (this.getUserCallback)
    }
    render() {
        let { globalmessage, version, classes } = this.props;
        let userdata = {
            login: this.state.userProviderData,
            user: this.state.user,
            account: this.state.account,
        };
        // console.log('state',this.state)
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