// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
// main.view.tsx

/*
    TODO: embed global message in some html
*/

// display the app
'use strict'

import * as React from 'react'

import AppRouter from './approuter'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const MainView = ({globalmessage, style}) => (
    <div style = {style}>
        {globalmessage}

        <AppRouter />
        <ToastContainer />
        
    </div>
)

export default MainView
