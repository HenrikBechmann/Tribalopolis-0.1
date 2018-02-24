// toolstrip.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import Divider from 'material-ui/Divider';
import MenuItem from 'material-ui/MenuItem';
import Drawer from 'material-ui/Drawer';
import ScrollControlsView from './scrollcontrols.view';
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
        this.menudrawer = () => (<Drawer docked={false} open={this.state.menuopen} onRequestChange={(open) => this.setState({ menuopen: open })}>
                <MenuItem leftIcon={<img src='/public/icons/campfire.svg'/>} primaryText="About" onClick={this.handleMenuClose}/>
                <MenuItem leftIcon={<FontIcon className='material-icons'>local_library</FontIcon>} primaryText="Tutorials" onClick={this.handleMenuClose}/>
                <MenuItem leftIcon={<FontIcon className='material-icons'>build</FontIcon>} primaryText="Build" onClick={this.handleMenuClose}/>
            </Drawer>);
        this.accountmenu = <IconMenu iconButtonElement={<IconButton>
                    <FontIcon className='material-icons'>account_circle</FontIcon>
                </IconButton>} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} targetOrigin={{ vertical: "top", horizontal: "right" }}>
            <MenuItem primaryText="Login (existing user)"/>
            <Divider />
            <MenuItem primaryText="Register (new user)"/>
        </IconMenu>;
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
                <ScrollControlsView id='scrollcontrolsview' scroller={this.state.scroller}>
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
                                <FontIcon className='material-icons'>menu</FontIcon>
                            </IconButton>

                            <IconButton style={{ verticalAlign: 'bottom', }} onClick={() => {
            this.takingfocus('topleft');
        }} iconStyle={{
            backgroundColor: (currentquad == 'topleft') ? 'red' :
                ((split == 'vertical' && currentquad == 'bottomleft') ||
                    (split == 'horizontal' && currentquad == 'topright')) ? 'orange' : 'transparent'
        }}>
                                <img src={(split == 'none') ? '/public/icons/ic_border_all_black_24px_topleft.svg' :
            (split == 'vertical') ? '/public/icons/ic_border_all_black_24px_topleft_leftsplit.svg' :
                '/public/icons/ic_border_all_black_24px_topleft_topsplit.svg'}/>
                            </IconButton>

                            <IconButton style={{ verticalAlign: 'bottom' }} onClick={() => {
            this.takingfocus('topright');
        }} iconStyle={{
            backgroundColor: (currentquad == 'topright') ? 'red' :
                ((split == 'vertical' && currentquad == 'bottomright') ||
                    (split == 'horizontal' && currentquad == 'topleft')) ? 'orange' : 'transparent'
        }}>
                                <img src={(split == 'none') ? '/public/icons/ic_border_all_black_24px_topright.svg' :
            (split == 'vertical') ? '/public/icons/ic_border_all_black_24px_topright_rightsplit.svg' :
                '/public/icons/ic_border_all_black_24px_topright_topsplit.svg'}/>
                            </IconButton>

                            <IconButton style={{ verticalAlign: 'bottom' }} onClick={() => {
            this.takingfocus('bottomleft');
        }} iconStyle={{
            backgroundColor: (currentquad == 'bottomleft') ? 'red' :
                ((split == 'vertical' && currentquad == 'topleft') ||
                    (split == 'horizontal' && currentquad == 'bottomright')) ? 'orange' : 'transparent'
        }}>
                                <img src={(split == 'none') ? '/public/icons/ic_border_all_black_24px_bottomleft.svg' :
            (split == 'vertical') ? '/public/icons/ic_border_all_black_24px_bottomleft_leftsplit.svg' :
                '/public/icons/ic_border_all_black_24px_bottomleft_bottomsplit.svg'}/>
                            </IconButton>

                            <IconButton style={{ verticalAlign: 'bottom' }} onClick={() => {
            this.takingfocus('bottomright');
        }} iconStyle={{
            backgroundColor: (currentquad == 'bottomright') ? 'red' :
                ((split == 'vertical' && currentquad == 'topright') ||
                    (split == 'horizontal' && currentquad == 'bottomleft')) ? 'orange' : 'transparent'
        }}>
                                <img src={(split == 'none') ? '/public/icons/ic_border_all_black_24px_bottomright.svg' :
            (split == 'vertical') ? '/public/icons/ic_border_all_black_24px_bottomright_rightsplit.svg' :
                '/public/icons/ic_border_all_black_24px_bottomright_bottomsplit.svg'}/>
                            </IconButton>

                            <IconButton style={{ verticalAlign: 'bottom' }} onClick={() => this.changeSplitFrom('horizontal')}>
                                <img src={(this.state.split == 'horizontal') ?
            '/public/icons/ic_border_all_black_24px_split_red.svg' :
            '/public/icons/ic_border_all_black_24px_split.svg'}/>
                            </IconButton>

                            <IconButton iconStyle={{ transform: 'rotate(90deg)' }} style={{ verticalAlign: 'bottom' }} onClick={() => this.changeSplitFrom('vertical')}>
                                <img src={(this.state.split == 'vertical') ?
            '/public/icons/ic_border_all_black_24px_split_red.svg' :
            '/public/icons/ic_border_all_black_24px_split.svg'}/>
                            </IconButton>

                            <IconButton>
                                <FontIcon className='material-icons'>help_outline</FontIcon>
                            </IconButton>

                            <IconButton>
                                <FontIcon className='material-icons'>settings</FontIcon>}
                            </IconButton>

                            <IconButton>
                                <FontIcon className='material-icons'>new_releases</FontIcon>
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