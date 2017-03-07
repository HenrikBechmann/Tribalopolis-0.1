// spaces.tsx
import * as React from 'react'
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import FontIcon from 'material-ui/FontIcon'
import SvgIcon from 'material-ui/SvgIcon'
import Drawer from 'material-ui/Drawer'
import Divider from 'material-ui/Divider'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import {Tabs, Tab} from 'material-ui/Tabs'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import { styles } from '../utilities/styles'

// TODO: make show/hide card panel tab; make show/hide graph panel tab
/*
*/
class Spaces extends React.Component<any,any> {

    state = {
        menuopen:false,
        filterdialogopen:false,
        searchdialogopen:false,
    }

    // ---------------------[ Filter Dialog ]-----------------------

    handleFilterDialogOpen = () => {
        this.setState({filterdialogopen: true});
    };

    handleFilterDialogClose = () => {
        this.setState({filterdialogopen: false});
    };


    filterDialog = (data) => {
        return <Dialog
            title = "Filter Space Components"
            actions = { this.filterdialogactions }
            open = { this.state.filterdialogopen }
            onRequestClose={this.handleFilterDialogClose}
        >
        <Tabs>
            <Tab label="Nodes" >
              <div>
                <h2>Select Node Types</h2>
                <p>
                  [list of node types]
                </p>
              </div>
            </Tab>
            <Tab label="Links" >
              <div>
                <h2>Select Link Types</h2>
                <p>
                  [list of link types]
                </p>
              </div>
            </Tab>
        </Tabs>
        </Dialog>
    }

    filterdialogactions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleFilterDialogClose}
      />,
      <FlatButton
        label="Apply"
        primary={true}
        onTouchTap={this.handleFilterDialogClose}
      />,
    ];

    // ---------------------[ Search Dialog ]-----------------------

    handleSearchDialogOpen = () => {
        this.setState({searchdialogopen: true});
    };

    handleSearchDialogClose = () => {
        this.setState({searchdialogopen: false});
    };


    searchDialog = (data) => {
        return <Dialog
            title = "Search for a Space Node"
            actions = { this.searchdialogactions }
            open = { this.state.searchdialogopen }
            onRequestClose={this.handleSearchDialogClose}
        >
        <Tabs>
        <Tab label="Search" >
          <div>
            <h2>Search for a node</h2>
            <p>
              [search results]
            </p>
          </div>
        </Tab>
        <Tab label="Sort" >
          <div>
            <h2>Sort nodes, then select one</h2>
            <p>
              [sort results]
            </p>
          </div>
        </Tab>
        </Tabs>
        </Dialog>
    }

    searchdialogactions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleSearchDialogClose}
      />,
      <FlatButton
        label="Select"
        primary={true}
        onTouchTap={this.handleSearchDialogClose}
      />,
    ];

    // ---------------------[ Menus ]-----------------------

    handleMenuToggle = () => this.setState({menuopen: !this.state.menuopen});

    handleMenuClose = () => this.setState({menuopen: false});

    menudrawer = <Drawer
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
                onTouchTap={this.handleMenuClose}
            />
            <MenuItem 
                leftIcon = {
                    <FontIcon className='material-icons'>local_library</FontIcon>
                }
                primaryText = "Tutorials"
                onTouchTap={this.handleMenuClose}
            />
            <MenuItem 
                leftIcon = {
                    <FontIcon className='material-icons'>build</FontIcon>
                }
                primaryText = "Build"
                onTouchTap={this.handleMenuClose}
            />
        </Drawer>

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
                primaryText = "Login (existing users)"
            />
            <Divider />
            <MenuItem
                primaryText = "Register (new users)"
            />
        </IconMenu>

    spacemenu = <div>
            <IconButton>
                <FontIcon className='material-icons'>arrow_back</FontIcon>
            </IconButton>
            <IconButton>
                <FontIcon className='material-icons'>arrow_forward</FontIcon>
            </IconButton>
            <IconButton
                onTouchTap = { this.handleFilterDialogOpen }
            >
                <FontIcon className='material-icons'>filter_list</FontIcon>
            </IconButton>
            <IconButton
                onTouchTap = { this.handleSearchDialogOpen }
            >
                <FontIcon className='material-icons'>search</FontIcon>
            </IconButton>
        </div>

    spaceoverflowmenu = <IconMenu
            iconButtonElement = {
                <IconButton>
                    <FontIcon className='material-icons'>more_vert</FontIcon>
                </IconButton>
            }
            anchorOrigin = {{vertical:"bottom",horizontal:"right"}}
            targetOrigin = {{vertical:"top",horizontal:"right"}}
        >
            <MenuItem
                leftIcon = {<FontIcon className='material-icons'>refresh</FontIcon>}
                primaryText = "Refresh"
            />
            <MenuItem
                leftIcon = {<FontIcon className='material-icons'>home</FontIcon>}
                primaryText = "Home space"
            />
            <MenuItem
                leftIcon = {<FontIcon className='material-icons'>settings</FontIcon>}
                primaryText = "Options"
            />
            <MenuItem
                leftIcon = {<FontIcon className='material-icons'>help</FontIcon>}
                primaryText = "Help"
            />
        </IconMenu>

    render() {
    return <div style={styles.frame}>
        { this.menudrawer }
        { this.filterDialog(null) }
        { this.searchDialog(null) }
        <div style={styles.topframe}>
            <Toolbar style={styles.toolbar}>
                <ToolbarGroup>
                    <IconButton
                        onTouchTap = {this.handleMenuToggle}
                    >
                        <FontIcon className='material-icons'>menu</FontIcon>
                    </IconButton>
                </ToolbarGroup>
                <ToolbarGroup>
                    { this.spacemenu }
                </ToolbarGroup>
                <ToolbarGroup>
                    { this.accountmenu }
                    { this.spaceoverflowmenu }
                </ToolbarGroup>
            </Toolbar>
            <div style={styles.title} >Title</div>
            <div style={styles.filterbox}>
                <div>Nodes:  </div>
                <div>Links: </div>
            </div>
            <div style={styles.graph} >
                <FloatingActionButton mini={true} secondary={true} style={styles.addbutton}>
                      <ContentAdd />
                </FloatingActionButton>
                <div style={styles.originframe}>
                    <div style={styles.origin}
                    >
                        Origin
                    </div>
                    <div style={styles.origin}
                    >
                        Origin
                    </div>
                </div>
                Graph
                <div style={styles.status} >Status</div>
            </div>
        </div>
        <div style = {styles.splitter}>
            <div style={styles.collapsetabtop}><FontIcon className="material-icons">arrow_drop_down</FontIcon></div>
            <div style={styles.collapsetabbottom}><FontIcon className="material-icons">arrow_drop_up</FontIcon></div>
        </div>
        <div style={styles.bottomframe}>
            <div style={styles.list} >Card</div>
        </div>
    </div>
    }
}

export default Spaces
