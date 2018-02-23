// toolstrip.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'

import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import Divider from 'material-ui/Divider'
import MenuItem from 'material-ui/MenuItem'
import Drawer from 'material-ui/Drawer'
import ScrollControlsView from './scrollcontrols.view'

class QuadToolsStrip extends React.Component<any,any> {

    state = {
        menuopen:false,
        scroller:null,
        currentquad:this.props.currentquad,
    }

    takingfocus = this.props.takingfocus

    componentDidMount() {
        setTimeout(()=>{
            this.setState({
                scroller:this.scroller
            })
        },500) // substantial timeout required to give scroll client time to right-size
    }

    quadbindings = null

    lookupbyquadrant = {}

    componentDidUpdate() {
        if (!this.quadbindings && this.props.quadbindings) {
            let quadbindings = this.quadbindings = this.props.quadbindings
            for (let index in quadbindings) {
                let quad = quadbindings[index]
                this.lookupbyquadrant[quad.state.quadrant] = quad
            }
        }
        if (this.props.currentquad !== this.state.currentquad) {
            this.setState({
                currentquad:this.props.currentquad
            })
        }
    }

    handleMenuToggle = () => {
        this.setState({menuopen: !this.state.menuopen}
    )}

    handleMenuClose = () => this.setState({menuopen: false});

    spacemenu = <span>
    </span>

    // spaceoverflowmenu = <IconMenu
    //         iconButtonElement = {
    //             <IconButton>
    //                 <FontIcon className='material-icons'>more_vert</FontIcon>
    //             </IconButton>
    //         }
    //         anchorOrigin = {{vertical:"bottom",horizontal:"right"}}
    //         targetOrigin = {{vertical:"top",horizontal:"right"}}
    //     >
    //         <MenuItem
    //             leftIcon = {<FontIcon className='material-icons'>refresh</FontIcon>}
    //             primaryText = "Refresh"
    //         />
    //         <MenuItem
    //             leftIcon = {<FontIcon className='material-icons'>settings</FontIcon>}
    //             primaryText = "Options"
    //         />
    //         <MenuItem
    //             leftIcon = {<FontIcon className='material-icons'>help</FontIcon>}
    //             primaryText = "Help"
    //         />
    //     </IconMenu>

    menudrawer = () => (<Drawer
                docked={false}
                open={this.state.menuopen}
                onRequestChange={(open) => this.setState({menuopen:open})}
            >
                <MenuItem 
                    leftIcon = {
                        <img
                            src='/public/icons/campfire.svg'
                        />
                    }
                    primaryText = "About"
                    onClick={this.handleMenuClose}
                />
                <MenuItem 
                    leftIcon = {
                        <FontIcon className='material-icons'>local_library</FontIcon>
                    }
                    primaryText = "Tutorials"
                    onClick={this.handleMenuClose}
                />
                <MenuItem 
                    leftIcon = {
                        <FontIcon className='material-icons'>build</FontIcon>
                    }
                    primaryText = "Build"
                    onClick={this.handleMenuClose}
                />
            </Drawer>
        )

    accountmenu = <IconMenu
            iconButtonElement = {
                <IconButton>
                    <FontIcon className='material-icons'>account_circle</FontIcon>
                </IconButton>
            }
            anchorOrigin = {{vertical:"bottom",horizontal:"right"}}
            targetOrigin = {{vertical:"top",horizontal:"right"}}
        >
            <MenuItem
                primaryText = "Login (existing user)"
            />
            <Divider />
            <MenuItem
                primaryText = "Register (new user)"
            />
        </IconMenu>

    scroller = null

    render() {
        let currentquad = this.state.currentquad
        return (
            <div 
                style = {
                    {
                        height:'48px',
                        backgroundColor:'silver',
                        position:'absolute',
                        top:0,
                        left:0,
                        right:'96px'
                    }
                } 
            >
                <ScrollControlsView id='scrollcontrolsview' scroller = {this.state.scroller} >
                    <div style = {
                        {
                            display:'flex',
                            flexWrap:'nowrap',
                            overflow:'auto',
                        }
                    }
                        
                        ref = {el => {
                            this.scroller = el
                        }}
                    >
                        <div 
                            style = {
                                {
                                    display:'inline',
                                    whiteSpace:'nowrap',
                                }
                            }
                        >
                            <IconButton
                                onClick = {this.handleMenuToggle}
                            >
                                <FontIcon className='material-icons'>menu</FontIcon>
                            </IconButton>

                            <IconButton
                                style = {{verticalAlign:'bottom',}}
                                onClick = {() => {
                                    this.takingfocus('topleft')
                                }}
                                iconStyle = {
                                    {
                                        backgroundColor:(currentquad == 'topleft')?'red':'transparent'
                                    }
                                }
                            >
                                <img 
                                    src = '/public/icons/ic_border_all_black_24px_topleft.svg'/>
                            </IconButton>

                            <IconButton
                                style = {{verticalAlign:'bottom'}}
                                onClick = {() => {
                                    this.takingfocus('topright')
                                }}
                                iconStyle = {
                                    {
                                        backgroundColor:(currentquad == 'topright')?'red':'transparent'
                                    }
                                }
                            >
                                <img 
                                    src = '/public/icons/ic_border_all_black_24px_topright.svg'/>
                            </IconButton>

                            <IconButton
                                style = {{verticalAlign:'bottom'}}
                                onClick = {() => {
                                    this.takingfocus('bottomleft')
                                }}
                                iconStyle = {
                                    {
                                        backgroundColor:(currentquad == 'bottomleft')?'red':'transparent'
                                    }
                                }
                            >
                                <img 
                                    src = '/public/icons/ic_border_all_black_24px_bottomleft.svg'/>
                            </IconButton>

                            <IconButton
                                style = {{verticalAlign:'bottom'}}
                                onClick = {() => {
                                    this.takingfocus('bottomright')
                                }}
                                iconStyle = {
                                    {
                                        backgroundColor:(currentquad == 'bottomright')?'red':'transparent'
                                    }
                                }
                            >
                                <img 
                                    src = '/public/icons/ic_border_all_black_24px_bottomright.svg'/>
                            </IconButton>

                            <IconButton
                                style = {{verticalAlign:'bottom'}}
                            >
                                <img 
                                    src = '/public/icons/ic_border_all_black_24px_split.svg'/>
                            </IconButton>

                            <IconButton
                                iconStyle = {{transform:'rotate(90deg)'}}
                                style = {{verticalAlign:'bottom'}}
                            >
                                <img 
                                    src = '/public/icons/ic_border_all_black_24px_split.svg'/>
                            </IconButton>

                            { this.accountmenu }

                            <IconButton 
                                disabled
                            >
                                <FontIcon className='material-icons'>new_releases</FontIcon>
                            </IconButton>

                            <IconButton
                            >
                                <FontIcon className='material-icons'>help_outline</FontIcon>
                            </IconButton>

                            <IconButton
                            >
                                <FontIcon className='material-icons'>settings</FontIcon>}
                            </IconButton>

                            {this.menudrawer()}

                        </div>
                    </div>
                </ScrollControlsView>
            </div>
        )
    }

}

// <IconButton
// >
//     <FontIcon className='material-icons'>home</FontIcon>
// </IconButton>

// <IconButton
//     disabled
// >
//     <FontIcon className='material-icons'>arrow_back</FontIcon>
// </IconButton>

// <IconButton
//     disabled
// >
//     <FontIcon className='material-icons'>arrow_forward</FontIcon>
// </IconButton>

// <IconButton
// >
//     <FontIcon className='material-icons'>swap_horiz</FontIcon>
// </IconButton>
// <IconButton
// >
//     <FontIcon className='material-icons'>swap_vert</FontIcon>
// </IconButton>

// { this.spaceoverflowmenu }

// <IconButton
//     disabled
// >
//     <FontIcon className='material-icons'>filter_list</FontIcon>
// </IconButton>
// <IconButton
//     disabled
// >
//     <FontIcon className='material-icons'>sort</FontIcon>
// </IconButton>

// <FontIcon 
//     style = {{color:'rgba(0, 0, 0, 0.3)'}} 
//     className='material-icons'>border_all</FontIcon>

export default QuadToolsStrip