// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
// main.view.tsx

/*
    TODO: embed global message in some html
*/

// display the app
'use strict'

import React from 'react'

import AppRouter from './approuter'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const MainView = ({globalmessage, className}) => (
    <div className = {className}>
        {globalmessage}

        <AppRouter />
        <ToastContainer position = {toast.POSITION.BOTTOM_CENTER} />
        
    </div>
)

export default MainView
