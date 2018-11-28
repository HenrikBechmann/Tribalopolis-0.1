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
    - collect fetch of login, user, and account together with promise collection
        so as to render only once for those
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
        this.getSystemData = () => {
            application.getDocument('/system/parameters', this.getSystemDataCallback, this.getSystemDataError);
        };
        this.getSystemDataCallback = data => {
            toast.info('setting system data');
            this.setState({
                system: data,
            });
        };
        this.getSystemDataError = error => {
            toast.error('Unable to get system data');
        };
        this.getUserCallback = (login) => {
            let userProviderData = null;
            if (login) {
                toast.success(`signed in as ${login.displayName}`, { autoClose: 2500 });
                userProviderData = login.providerData[0]; // only google for now
                // console.log('user provider data',userProviderData)
            }
            this.setState({
                login,
                userProviderData,
            }, () => {
                this.getUserDocument(userProviderData.uid);
            });
        };
        this.getUserDocument = uid => {
            application.queryCollection('users', [['identity.loginid.uid', '==', uid]], this.userDocumentSuccess, this.userDocumentFailure);
        };
        this.userDocumentSuccess = doclist => {
            console.log('doclist from userdoc', doclist);
            if (!doclist.length)
                return;
            if (doclist.length > 1) {
                toast.error('duplicate user id');
                return;
            }
            toast.info('setting user record');
            this.setState({
                user: doclist[0]
            }, () => {
                this.getAccountDocument(this.state.user.data.identity.account);
            });
        };
        this.userDocumentFailure = error => {
            toast.error(error);
        };
        this.getAccountDocument = reference => {
            application.getDocument(reference, this.userAccountSuccess, this.userAccountFailure);
        };
        this.userAccountSuccess = document => {
            if (!document)
                return;
            toast.info('setting account record');
            this.setState({
                account: document,
            });
        };
        this.userAccountFailure = error => {
            toast.error(error);
        };
        this.getSystemData();
        authapi.setUpdateCallback(this.getUserCallback);
    }
    render() {
        let { globalmessage, version, classes } = this.props;
        let userdata = {
            login: this.state.userProviderData,
            user: this.state.user,
            account: this.state.account,
        };
        console.log('userdata', userdata);
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