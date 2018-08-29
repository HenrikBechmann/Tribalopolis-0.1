// toolstrip.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import ScrollControlsView from '../common/scrollcontrols.view';
class QuadToolsStrip extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            menuopen: false,
            scroller: null,
            currentquad: this.props.currentquad,
            split: this.props.split,
        };
        this.changeSplit = this.props.changeSplit;
        this.takingfocus = this.props.takingfocus;
        this.changeSplitFrom = (toggleIndex) => {
            let newIndex = null;
            if (toggleIndex == this.state.split) {
                newIndex = 'none';
            }
            else {
                newIndex = toggleIndex;
            }
            this.changeSplit(newIndex);
        };
        this.handleMenuToggle = () => {
            this.setState({ menuopen: !this.state.menuopen });
        };
        this.handleMenuClose = () => this.setState({ menuopen: false });
        this.menudrawer = () => (<Drawer open={this.state.menuopen} onClose={(open) => this.setState({ menuopen: open })}>
                <MenuItem onClick={this.handleMenuClose}> 
                    <ListItemIcon> 
                        <Icon style={{ color: 'brown' }}>
                            weekend
                        </Icon>
                    </ListItemIcon>
                    <ListItemText primary="Home Base"/>
                </MenuItem>
                <Divider />
                <MenuItem onClick={this.handleMenuClose}>
                    <ListItemIcon>
                        <Icon style={{ color: 'brown' }}>
                            work
                        </Icon>
                    </ListItemIcon>
                    <ListItemText primary="My Workspace"/>
                </MenuItem>
                <MenuItem onClick={this.handleMenuClose}>
                    <ListItemIcon>
                        <Icon style={{ color: 'brown' }}>
                            account_box
                        </Icon>
                    </ListItemIcon>
                    <ListItemText primary="My Account"/>
                </MenuItem>
                <MenuItem onClick={this.handleMenuClose}>
                    <ListItemIcon>
                        <Icon style={{ color: 'brown' }}>
                            web
                        </Icon>
                    </ListItemIcon>
                    <ListItemText primary="My Website"/>
                </MenuItem>
                <Divider />
                <MenuItem onClick={this.handleMenuClose}>
                    <ListItemIcon>
                        <Icon style={{ color: 'steelblue' }}>
                            group
                        </Icon>
                    </ListItemIcon>
                    <ListItemText primary="Members"/>
                </MenuItem>
                <MenuItem onClick={this.handleMenuClose}>
                    <ListItemIcon>
                        <img src='/public/icons/fire.svg'/>
                    </ListItemIcon>
                    <ListItemText primary="Tribes"/>
                </MenuItem>
                <MenuItem onClick={this.handleMenuClose}>
                    <ListItemIcon>
                        <Icon style={{ color: 'steelblue' }}>
                            share
                        </Icon>
                    </ListItemIcon>
                    <ListItemText primary="Networks"/>
                </MenuItem>
                <MenuItem onClick={this.handleMenuClose}>
                    <ListItemIcon>
                        <Icon style={{ color: 'green' }}>
                            monetization_on
                        </Icon>
                    </ListItemIcon>
                    <ListItemText primary="Markets"/>
                </MenuItem>
                <Divider />
                <MenuItem onClick={this.handleMenuClose}>
                    <ListItemIcon>
                        <Icon>local_library</Icon>
                    </ListItemIcon>
                    <ListItemText primary="Tutorials"/>
                </MenuItem>
                <MenuItem onClick={this.handleMenuClose}>
                    <ListItemIcon>
                        <Icon className='material-icons'>build</Icon>
                    </ListItemIcon>
                    <ListItemText primary="Tools"/>
                </MenuItem>
                <Divider />
                <MenuItem onClick={this.handleMenuClose}>
                    <ListItemIcon>
                        <img src='/public/icons/fire.svg'/>
                    </ListItemIcon>
                    <ListItemText primary="About"/>
                </MenuItem>
            </Drawer>);
        this.accountmenu = null;
        // <MenuList
        //     iconButtonElement = {
        //         <IconButton>
        //             <FontIcon className='material-icons'>account_box</FontIcon>
        //         </IconButton>
        //     }
        //     anchorOrigin = {{vertical:"bottom",horizontal:"right"}}
        //     targetOrigin = {{vertical:"top",horizontal:"right"}}
        // >
        //     <MenuItem
        //         primaryText = "Login (existing user)"
        //     />
        //     <Divider />
        //     <MenuItem
        //         primaryText = "Register (new user)"
        //     />
        // </MenuList>
        this.scroller = null;
    }
    componentDidMount() {
        setTimeout(() => {
            this.setState({
                scroller: this.scroller
            });
        }, 500); // substantial timeout required to give scroll client time to right-size
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.currentquad !== this.state.currentquad ||
            nextProps.split != this.state.split) {
            this.setState({
                currentquad: nextProps.currentquad,
                split: nextProps.split,
            });
        }
    }
    render() {
        let { currentquad, split } = this.state;
        return (<div style={{
            height: '48px',
            backgroundColor: 'silver',
            position: 'absolute',
            top: 0,
            left: 0,
            right: '96px'
        }}>
                <ScrollControlsView uid='scrollcontrolsview' scroller={this.state.scroller}>
                    <div style={{
            display: 'flex',
            flexWrap: 'nowrap',
            overflow: 'auto',
        }} ref={el => {
            this.scroller = el;
        }}>
                        <div style={{
            display: 'inline',
            whiteSpace: 'nowrap',
        }}>
                            <IconButton onClick={this.handleMenuToggle}>
                                <Icon>menu</Icon>
                            </IconButton>

                            <div style={{ display: 'inline-block', height: '1.5em', borderLeft: '1px solid gray' }}></div>

                            <IconButton style={{ verticalAlign: 'bottom', }} onClick={() => {
            this.takingfocus('topleft');
        }}>
                                <img style={{
            backgroundColor: (currentquad == 'topleft') ? 'red' :
                ((split == 'vertical' && currentquad == 'bottomleft') ||
                    (split == 'horizontal' && currentquad == 'topright') ||
                    (split == 'matrix')) ? 'orange' : 'transparent'
        }} src={(split == 'none' || split == 'matrix') ? '/public/icons/ic_border_all_black_24px_topleft.svg' :
            (split == 'vertical') ? '/public/icons/ic_border_all_black_24px_topleft_leftsplit.svg' :
                '/public/icons/ic_border_all_black_24px_topleft_topsplit.svg'}/>
                            </IconButton>

                            <IconButton style={{ verticalAlign: 'bottom' }} onClick={() => {
            this.takingfocus('topright');
        }}>
                                <img style={{
            backgroundColor: (currentquad == 'topright') ? 'red' :
                ((split == 'vertical' && currentquad == 'bottomright') ||
                    (split == 'horizontal' && currentquad == 'topleft') ||
                    (split == 'matrix')) ? 'orange' : 'transparent'
        }} src={(split == 'none' || split == 'matrix') ? '/public/icons/ic_border_all_black_24px_topright.svg' :
            (split == 'vertical') ? '/public/icons/ic_border_all_black_24px_topright_rightsplit.svg' :
                '/public/icons/ic_border_all_black_24px_topright_topsplit.svg'}/>
                            </IconButton>

                            <IconButton style={{ verticalAlign: 'bottom' }} onClick={() => {
            this.takingfocus('bottomleft');
        }}>
                                <img style={{
            backgroundColor: (currentquad == 'bottomleft') ? 'red' :
                ((split == 'vertical' && currentquad == 'topleft') ||
                    (split == 'horizontal' && currentquad == 'bottomright') ||
                    (split == 'matrix')) ? 'orange' : 'transparent'
        }} src={(split == 'none' || split == 'matrix') ? '/public/icons/ic_border_all_black_24px_bottomleft.svg' :
            (split == 'vertical') ? '/public/icons/ic_border_all_black_24px_bottomleft_leftsplit.svg' :
                '/public/icons/ic_border_all_black_24px_bottomleft_bottomsplit.svg'}/>
                            </IconButton>

                            <IconButton style={{ verticalAlign: 'bottom' }} onClick={() => {
            this.takingfocus('bottomright');
        }}>
                                <img style={{
            backgroundColor: (currentquad == 'bottomright') ? 'red' :
                ((split == 'vertical' && currentquad == 'topright') ||
                    (split == 'horizontal' && currentquad == 'bottomleft') ||
                    (split == 'matrix')) ? 'orange' : 'transparent'
        }} src={(split == 'none' || split == 'matrix') ? '/public/icons/ic_border_all_black_24px_bottomright.svg' :
            (split == 'vertical') ? '/public/icons/ic_border_all_black_24px_bottomright_rightsplit.svg' :
                '/public/icons/ic_border_all_black_24px_bottomright_bottomsplit.svg'}/>
                            </IconButton>

                            <div style={{ display: 'inline-block', height: '1.5em', borderLeft: '1px solid gray' }}></div>

                            <IconButton style={{ verticalAlign: 'bottom' }} onClick={() => this.changeSplitFrom('horizontal')}>
                                <img src={(this.state.split == 'horizontal') ?
            '/public/icons/ic_border_all_black_24px_split_red.svg' :
            '/public/icons/ic_border_all_black_24px_split.svg'}/>
                            </IconButton>

                            <IconButton style={{ verticalAlign: 'bottom' }} onClick={() => this.changeSplitFrom('vertical')}>
                                <img style={{ transform: 'rotate(90deg)' }} src={(this.state.split == 'vertical') ?
            '/public/icons/ic_border_all_black_24px_split_red.svg' :
            '/public/icons/ic_border_all_black_24px_split.svg'}/>
                            </IconButton>

                            <IconButton style={{ verticalAlign: 'bottom' }} onClick={() => this.changeSplitFrom('matrix')}>
                                <img src={(this.state.split == 'matrix') ?
            '/public/icons/ic_border_all_black_24px_split_matrix_red.svg' :
            '/public/icons/ic_border_all_black_24px_split_matrix.svg'}/>
                            </IconButton>

                            <div style={{ display: 'inline-block', height: '1.5em', borderLeft: '1px solid gray' }}></div>

                            <IconButton>
                                <Icon>notifications</Icon>
                            </IconButton>

                            <IconButton>
                                <Icon>help_outline</Icon>
                            </IconButton>

                            <IconButton>
                                <Icon>settings</Icon>
                            </IconButton>

                            {this.accountmenu}

                            {this.menudrawer()}

                        </div>
                    </div>
                </ScrollControlsView>
            </div>);
    }
}
export default QuadToolsStrip;
//# sourceMappingURL=quadtoolsstrip.view.jsx.map