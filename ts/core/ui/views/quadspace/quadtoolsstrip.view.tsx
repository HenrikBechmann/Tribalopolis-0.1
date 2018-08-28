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
import ScrollControlsView from '../common/scrollcontrols.view'

class QuadToolsStrip extends React.Component<any,any> {

    state = {
        menuopen:false,
        scroller:null,
        currentquad:this.props.currentquad,
        split:this.props.split,
    }

    changeSplit = this.props.changeSplit

    takingfocus = this.props.takingfocus

    changeSplitFrom = (toggleIndex) => {
        let newIndex = null
        if (toggleIndex == this.state.split) {
            newIndex = 'none'
        } else {
            newIndex = toggleIndex
        }
        this.changeSplit(newIndex)
    }

    componentDidMount() {
        setTimeout(()=>{
            this.setState({
                scroller:this.scroller
            })
        },500) // substantial timeout required to give scroll client time to right-size
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.currentquad !== this.state.currentquad ||
            nextProps.split != this.state.split) {
            this.setState({
                currentquad:nextProps.currentquad,
                split:nextProps.split,
            })
        }
    }

    handleMenuToggle = () => {
        this.setState({menuopen: !this.state.menuopen}
    )}

    handleMenuClose = () => this.setState({menuopen: false})

    menudrawer = () => (<Drawer
                docked={false}
                open={this.state.menuopen}
                onRequestChange={(open) => this.setState({menuopen:open})}
            >
                <MenuItem 
                    leftIcon = {
                        <FontIcon 
                            color = 'brown' 
                            className='material-icons'
                        >
                            weekend
                        </FontIcon>
                    }
                    primaryText = "Home Base"
                    onClick={this.handleMenuClose}
                />
                <Divider />
                <MenuItem 
                    leftIcon = {
                        <FontIcon 
                            color = 'brown' 
                            className='material-icons'
                        >
                            work
                        </FontIcon>
                    }
                    primaryText = "My Workspace"
                    onClick={this.handleMenuClose}
                />
                <MenuItem 
                    leftIcon = {
                        <FontIcon 
                            color = 'brown' 
                            className='material-icons'
                        >
                            account_box
                        </FontIcon>
                    }
                    primaryText = "My Account"
                    onClick={this.handleMenuClose}
                />
                <MenuItem 
                    leftIcon = {
                        <FontIcon 
                            color = 'brown' 
                            className='material-icons'
                        >
                            web
                        </FontIcon>
                    }
                    primaryText = "My Website"
                    onClick={this.handleMenuClose}
                />
                <Divider />
                <MenuItem 
                    leftIcon = {
                        <FontIcon 
                            color = 'steelblue' 
                            className='material-icons'
                        >
                            group
                        </FontIcon>
                    }
                    primaryText = "Members"
                    onClick={this.handleMenuClose}
                />
                <MenuItem 
                    leftIcon = {
                        <img
                           src='/public/icons/fire.svg'
                        />
                    }
                    primaryText = "Tribes"
                    onClick={this.handleMenuClose}
                />
                <MenuItem 
                    leftIcon = {
                        <FontIcon 
                            color = 'steelblue' 
                            className='material-icons'
                        >
                            share
                        </FontIcon>
                    }
                    primaryText = "Networks"
                    onClick={this.handleMenuClose}
                />
                <MenuItem 
                    leftIcon = {
                        <FontIcon 
                            color = 'green' 
                            className='material-icons'
                        >
                            monetization_on
                        </FontIcon>
                    }
                    primaryText = "Markets"
                    onClick={this.handleMenuClose}
                />
                <Divider />
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
                    primaryText = "Tools"
                    onClick={this.handleMenuClose}
                />
                <Divider />
                <MenuItem 
                    leftIcon = {
                        <img
                            src='/public/icons/fire.svg'
                        />
                    }
                    primaryText = "About"
                    onClick={this.handleMenuClose}
                />
            </Drawer>
        )

    accountmenu = <IconMenu
            iconButtonElement = {
                <IconButton>
                    <FontIcon className='material-icons'>account_box</FontIcon>
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
        let { currentquad, split } = this.state
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
                <ScrollControlsView uid='scrollcontrolsview' scroller = {this.state.scroller} >
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

                            <div style = {{display:'inline-block',height:'1.5em',borderLeft:'1px solid gray'}}></div>

                            <IconButton
                                style = {{verticalAlign:'bottom',}}
                                onClick = {() => {
                                    this.takingfocus('topleft')
                                }}
                                iconStyle = {
                                    {
                                        backgroundColor:(
                                            currentquad == 'topleft')?'red':
                                            ((split == 'vertical' && currentquad == 'bottomleft') ||
                                            (split == 'horizontal' && currentquad == 'topright') ||
                                            (split == 'matrix')
                                        )?'orange':'transparent'
                                    }
                                }
                            >
                                <img 
                                    src = {
                                        (split == 'none' || split == 'matrix')?'/public/icons/ic_border_all_black_24px_topleft.svg':
                                        (split == 'vertical')?'/public/icons/ic_border_all_black_24px_topleft_leftsplit.svg':
                                        '/public/icons/ic_border_all_black_24px_topleft_topsplit.svg'
                                    }
                                />
                            </IconButton>

                            <IconButton
                                style = {{verticalAlign:'bottom'}}
                                onClick = {() => {
                                    this.takingfocus('topright')
                                }}
                                iconStyle = {
                                    {
                                        backgroundColor:(
                                            currentquad == 'topright')?'red':
                                            ((split == 'vertical' && currentquad == 'bottomright') ||
                                            (split == 'horizontal' && currentquad == 'topleft') ||
                                            (split == 'matrix')
                                        )?'orange':'transparent'
                                    }
                                }
                            >
                                <img 
                                    src = {
                                        (split == 'none' || split == 'matrix')?'/public/icons/ic_border_all_black_24px_topright.svg':
                                        (split == 'vertical')?'/public/icons/ic_border_all_black_24px_topright_rightsplit.svg':
                                        '/public/icons/ic_border_all_black_24px_topright_topsplit.svg'
                                    }
                                    />
                            </IconButton>

                            <IconButton
                                style = {{verticalAlign:'bottom'}}
                                onClick = {() => {
                                    this.takingfocus('bottomleft')
                                }}
                                iconStyle = {
                                    {
                                        backgroundColor:(
                                            currentquad == 'bottomleft')?'red': 
                                            ((split == 'vertical' && currentquad == 'topleft') ||
                                            (split == 'horizontal' && currentquad == 'bottomright') ||
                                            (split == 'matrix')
                                        )?'orange':'transparent'
                                    }
                                }
                            >
                                <img 
                                    src = {
                                        (split == 'none' || split == 'matrix')?'/public/icons/ic_border_all_black_24px_bottomleft.svg':
                                        (split == 'vertical')?'/public/icons/ic_border_all_black_24px_bottomleft_leftsplit.svg':
                                        '/public/icons/ic_border_all_black_24px_bottomleft_bottomsplit.svg'
                                    }
                                />
                            </IconButton>

                            <IconButton
                                style = {{verticalAlign:'bottom'}}
                                onClick = {() => {
                                    this.takingfocus('bottomright')
                                }}
                                iconStyle = {
                                    {
                                        backgroundColor:(
                                            currentquad == 'bottomright')?'red':
                                            ((split == 'vertical' && currentquad == 'topright') ||
                                            (split == 'horizontal' && currentquad == 'bottomleft') ||
                                            (split == 'matrix')
                                        )?'orange':'transparent'
                                    }
                                }
                            >
                                <img 
                                    src = {
                                        (split == 'none' || split == 'matrix')?'/public/icons/ic_border_all_black_24px_bottomright.svg':
                                        (split == 'vertical')?'/public/icons/ic_border_all_black_24px_bottomright_rightsplit.svg':
                                        '/public/icons/ic_border_all_black_24px_bottomright_bottomsplit.svg'
                                    }
                                />
                            </IconButton>

                            <div style = {{display:'inline-block',height:'1.5em',borderLeft:'1px solid gray'}}></div>

                            <IconButton
                                style = {{verticalAlign:'bottom'}}
                                onClick = {() => this.changeSplitFrom('horizontal')}
                            >
                                <img 
                                    src = {
                                        (this.state.split == 'horizontal')?
                                            '/public/icons/ic_border_all_black_24px_split_red.svg':
                                            '/public/icons/ic_border_all_black_24px_split.svg'
                                    }
                                />
                            </IconButton>

                            <IconButton
                                iconStyle = {{transform:'rotate(90deg)'}}
                                style = {{verticalAlign:'bottom'}}
                                onClick = {() => this.changeSplitFrom('vertical')}
                            >
                                <img 
                                    src = {
                                        (this.state.split == 'vertical')?
                                            '/public/icons/ic_border_all_black_24px_split_red.svg':
                                            '/public/icons/ic_border_all_black_24px_split.svg'
                                    }
                                />
                            </IconButton>

                            <IconButton
                                style = {{verticalAlign:'bottom'}}
                                onClick = {() => this.changeSplitFrom('matrix')}
                            >
                                <img 
                                    src = {
                                        (this.state.split == 'matrix')?
                                            '/public/icons/ic_border_all_black_24px_split_matrix_red.svg':
                                            '/public/icons/ic_border_all_black_24px_split_matrix.svg'
                                    }
                                />
                            </IconButton>

                            <div style = {{display:'inline-block',height:'1.5em',borderLeft:'1px solid gray'}}></div>

                            <IconButton 
                            >
                                <FontIcon className='material-icons'>notifications</FontIcon>
                            </IconButton>

                            <IconButton
                            >
                                <FontIcon className='material-icons'>help_outline</FontIcon>
                            </IconButton>

                            <IconButton
                            >
                                <FontIcon className='material-icons'>settings</FontIcon>}
                            </IconButton>

                            { this.accountmenu }

                            {this.menudrawer()}

                        </div>
                    </div>
                </ScrollControlsView>
            </div>
        )
    }

}

export default QuadToolsStrip