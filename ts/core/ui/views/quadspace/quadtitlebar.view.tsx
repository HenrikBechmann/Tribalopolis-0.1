// quadtitlebar.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'
import FontIcon from 'material-ui/FontIcon'

const QuadTitleBar = props => {
    let { id } = props
    let alias
    switch (id) {
        case 'topleft':alias = '1'
        break
        case 'topright':alias = '2'
        break
        case 'bottomleft':alias = '3'
        break
        case 'bottomright':alias = '4'
        break
    }
    return (
        <div
            style = {
                {
                    position:'relative',
                    height:'25px',
                    backgroundColor:'white',
                    boxSizing:'border-box',
                    width:'100%',
                    borderRadius:'5px 5px 0 0',
                    borderBottom:'1px solid silver',
                    overflow:'hidden',
                    fontSize:'smaller',
                }
            }
        >
            <div
                style = {
                    {
                        position:'absolute',
                        top:'0',
                        left:'0',
                        zIndex:3,
                        backgroundColor:'white',
                        border:'1px solid gray',
                        boxSizing:'border-box',
                        height:'24px',
                        width:'24px',
                        fontSize:'20px',
                        textAlign:'center',
                        fontWeight:'bold',
                        color:'gray',
                    }
                }
            >
                {alias} 
            </div>
            <div style = {{
                position:'absolute',
                top:'0',
                width:'100%',
                height:'42px',
                overflow:'auto',
                display:'flex',
                flexWrap:'nowrap',
                boxSizing:'border-box',
                padding: '3px 0 0 30px',
            }}>
                <div style = {{whiteSpace:'nowrap'}}>
                    {props.title}
                </div>
            </div>
        </div>
    )
}

export default QuadTitleBar