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

import { styles } from '../utilities/styles'

import SpaceGraph from '../components/spacegraph'
import Splitter from '../components/splitter'
import * as utilities from '../utilities/utilities'
// TODO: make show/hide card panel tab; make show/hide graph panel tab
/*
*/
class Spaces extends React.Component<any,any> {

    state = {
        menuopen:false,
        filterdialogopen:false,
        searchdialogopen:false,
        sampledata:null,
    }

    componentDidMount() {

        if (!this.state.sampledata) {
            utilities.getJsonFile('/db/sample.json').then((data) => {
                let sampledata = this.normalizeData(data)
                console.log('sampledata', sampledata)
                this.setState({
                    sampledata
                })
            }).catch((error) => {
                console.log('error getting sample file: ',error)
            })
        }

    }

    normalizeData = (data) => {
        let nodes:any = {}
        let links:any = {}
        let records = data.records
        let record:any
        for (record of records) {
            let fields = record._fields
            let field:any
            for (field of fields) {
                if (field.type) { // link
                    if (!links[field.id]) {
                        links[field.id] = {
                            type:field.type,
                            id: field.id,
                            properties: field.properties,
                            startNode: field.startNode,
                            endNode: field.endNode,
                        }
                        if (!nodes[field.startNode].fields[field.type]) {
                            nodes[field.startNode].fields[field.type] = {}
                        }
                        if (!nodes[field.startNode].fields[field.type][field.id]) {
                            nodes[field.startNode].fields[field.type][field.id] = {
                                endNode:field.endNode,
                                properties:field.properties,
                            }
                        }
                    }
                } else { // node
                    if (!nodes[field.id]) {
                        nodes[field.id] = {
                            id:field.id,
                            labels:field.labels,
                            properties:field.properties,
                            fields:{}
                        }
                    }
                }
            }
        }
        return {
            nodes,
            links
        }
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
            <Tab label="Fields" >
              <div>
                <h2>Select Field Types</h2>
                <p>
                  [list of field types]
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
                primaryText = "Login (existing users)"
            />
            <Divider />
            <MenuItem
                primaryText = "Register (new users)"
            />
        </IconMenu>

        // <IconButton
        //     onTouchTap = { this.handleSearchDialogOpen }
        // >
        //     <FontIcon className='material-icons'>search</FontIcon>
        // </IconButton>
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
                leftIcon = {<FontIcon className='material-icons'>layers</FontIcon>}
                primaryText = "Workspaces"
            />
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
        { this.menudrawer() }
        { this.filterDialog(null) }
        { this.searchDialog(null) }
        <div style={styles.header}>
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
            <div style={styles.title} >Demo: click on a node to remove it.</div>
        </div>
        <div style = {styles.main}>
            <Splitter 
                primaryPane = {
                    <SpaceGraph data = {this.state.sampledata}/>
                }
                secondaryPane = {
                    <div style={styles.list} >Card</div>
                }
                orientation = "horizontal"
                division = {30}
                collapse = {0}
                threshold = {100}
            />
        </div>
        <div style={styles.footer}>
            <div style={styles.status} >Status</div>
        </div>
    </div>
    }
}

export default Spaces
