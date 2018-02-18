// quad.controller.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'
import QuadToolsStrip from './views/quadtoolsstrip.view'
import QuadFrame from './views/quadframe.view'
import QuadBasket from './views/quadbasket.view'
import QuadViewport from './views/quadviewport.view'
import QuadPlatform from './views/quadplatform.view'
import Quadrant from './views/quadrant.view'
import QuadDiamond from './views/quaddiamond.view'

class QuadspaceController extends React.Component<any,any> {


    // these can be re-arranged; quadrant attribute needs to be updated
    quadrants = [
        <Quadrant 
            key = '1'
            quadrant = 'topleft' 
            color = 'lightgreen' 
            title = "first" 
            status = "not bad"
        />,
        <Quadrant 
            key = '2'
            quadrant = 'topright' 
            color = 'mistyrose' 
            title = "second" 
            status = "OK"
        />,
        <Quadrant 
            key = '3'
            quadrant = 'bottomleft' 
            color = 'lightblue' 
            title = "third" 
            status = "Good"
        />,
        <Quadrant 
            key = '4'
            quadrant = 'bottomright' 
            color = 'papayawhip' 
            title = "fourth" 
            status = "bad"
        />,
    ]

    render() {
        return (
            <QuadFrame>
                <QuadToolsStrip />
                <QuadBasket />
                <QuadViewport>
                    <QuadPlatform>
                        {this.quadrants}
                        <QuadDiamond />
                    </QuadPlatform>
                </QuadViewport>
            </QuadFrame>
        )
    }
}

export default QuadspaceController