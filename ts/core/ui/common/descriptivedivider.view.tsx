// verticaldivider.view.tsx

// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later
'use strict'

import React from 'react'

const DescriptiveDivider = ({style:assignedstyle= null,description=null}) => {
    let defaultstyle = {
        display:'inline-block',
        height:'1.5em',
        borderBottom:'1px solid gray',
    }

    let appliedstyle = assignedstyle?Object.assign({},defaultstyle,assignedstyle):null
    if (!assignedstyle && !description) {
        console.error('neither assignedstyle nor deacription in Descriptive Divider')
        return null
    }
    return (
        (!description)
        ?<div style = {
                appliedstyle
            }>
        </div>
        :<div style = {{position:'relative',height:'1em'}}>
            <hr style = {{
                    position:'absolute',
                    width:'100%',
                    top:0,
                }}
            />
            <div style = {
                {
                    position:'absolute',
                    width:'100%',
                    top:0,
                    backgroundColor:'lightseagreen',
                    opacity:.3,
                    height:'1em',
                }
            }></div>
            <div style = {
                {
                    position:'absolute',
                    width:'100%',
                    top:0,
                    textAlign:'center',
                    fontStyle:'italic',
                    fontSize:'smaller',
                }
            }>
                <span style = {{backgroundColor:'#C0E8E5',color:'slategray'}}>{`[ ${description} ]`}</span>
            </div>
        </div>
    )
}

export default DescriptiveDivider