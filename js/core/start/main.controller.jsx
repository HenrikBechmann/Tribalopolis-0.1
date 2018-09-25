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
import UserContext from '../services/user.context';
import { toast } from 'react-toastify';
let Main = class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            userProviderData: null,
        };
        this.mainviewstyle = {
            fontFamily,
        };
        this.getUserCallback = (user) => {
            if (user) {
                toast.success(`signed in as ${user.displayName}`, { autoClose: 2500 });
            }
            let userProviderData = user ? user.providerData[0] : null;
            this.setState({
                user,
                userProviderData,
            });
        };
        authapi.setUpdateCallback(this.getUserCallback);
    }
    render() {
        let { globalmessage, version } = this.props;
        return (<UserContext.Provider value={this.state.userProviderData}>
                <MainView globalmessage={globalmessage} style={this.mainviewstyle}/>
            </UserContext.Provider>);
    }
};
Main = __decorate([
    DragDropContext(DnDBackend)
], Main);
export default Main;
//# sourceMappingURL=main.controller.jsx.map