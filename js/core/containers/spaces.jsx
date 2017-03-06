// spaces.tsx
import * as React from 'react';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import Drawer from 'material-ui/Drawer';
import { styles } from '../utilities/styles';
// TODO: make show/hide card panel tab; make show/hide graph panel tab
/*
*/
class Spaces extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            menuopen: false
        };
        this.handleMenuToggle = () => this.setState({ menuopen: !this.state.menuopen });
        this.handleMenuClose = () => this.setState({ menuopen: false });
    }
    render() {
        return <div style={styles.frame}>
        <Drawer docked={false} width={200} open={this.state.menuopen} onRequestChange={(open) => this.setState({ menuopen: open })}>
            <MenuItem leftIcon={<img src='/public/icons/campfire.svg'/>} primaryText="About" onTouchTap={this.handleMenuClose}/>
        </Drawer>
        <div style={styles.topframe}>
            <Toolbar style={styles.toolbar}>
                <ToolbarGroup>
                    <IconButton onTouchTap={this.handleMenuToggle}>
                        <FontIcon className='material-icons'>menu</FontIcon>
                    </IconButton>
                </ToolbarGroup>
                <ToolbarGroup>
                    <IconButton>
                        <FontIcon className='material-icons'>arrow_back</FontIcon>
                    </IconButton>
                    <IconButton>
                        <FontIcon className='material-icons'>arrow_forward</FontIcon>
                    </IconButton>
                    <IconButton>
                        <FontIcon className='material-icons'>filter_list</FontIcon>
                    </IconButton>
                </ToolbarGroup>
                <ToolbarGroup>
                    <IconButton>
                        <FontIcon className='material-icons'>account_circle</FontIcon>
                    </IconButton>
                    <IconMenu iconButtonElement={<IconButton>
                                <FontIcon className='material-icons'>more_vert</FontIcon>
                            </IconButton>}>
                        <MenuItem leftIcon={<FontIcon className='material-icons'>home</FontIcon>} primaryText="Home graph"/>
                        <MenuItem leftIcon={<FontIcon className='material-icons'>settings</FontIcon>} primaryText="Settings"/>
                        <MenuItem leftIcon={<FontIcon className='material-icons'>refresh</FontIcon>} primaryText="Refresh"/>
                    </IconMenu>
                </ToolbarGroup>
            </Toolbar>
            <div style={styles.title}>Title</div>
            <div style={styles.filterbox}>
            <div>Nodes:  </div>
            <div>Links: </div>
            </div>
            <div style={styles.graph}>
                <div style={styles.origin}>
                    Origin
                </div>
                <div style={styles.origin}>
                    Origin
                </div>
                Graph
                <div style={styles.status}>Status</div>
            </div>
        </div>
        <div style={styles.bottomframe}>
            <div style={styles.list}>Card</div>
        </div>
    </div>;
    }
}
export default Spaces;
//# sourceMappingURL=spaces.jsx.map