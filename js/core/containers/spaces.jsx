// spaces.tsx
import * as React from 'react';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import { styles } from '../utilities/styles';
// TODO: make show/hide card panel tab; make show/hide graph panel tab
/*
                    <IconButton>
                        <img src='/public/icons/campfire.svg' />
                    </IconButton>
                    <IconButton>
                        <FontIcon className='material-icons'>home</FontIcon>
                    </IconButton>
                    <IconButton>
                        <FontIcon className='material-icons'>settings</FontIcon>
                    </IconButton>
                    <IconButton>
                        <FontIcon className='material-icons'>refresh</FontIcon>
                    </IconButton>
*/
const Spaces = (props) => (<div style={styles.frame}>
        <div style={styles.topframe}>
            <Toolbar style={styles.toolbar}>
                <ToolbarGroup>
                    <IconButton>
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
                    <IconButton>
                        <FontIcon className='material-icons'>more_vert</FontIcon>
                    </IconButton>
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
    </div>);
export default Spaces;
//# sourceMappingURL=spaces.jsx.map