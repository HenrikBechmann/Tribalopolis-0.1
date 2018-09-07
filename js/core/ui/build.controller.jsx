// build.controller.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
import Icon from '@material-ui/core/Icon';
import UserContext from '../services/user.context';
import QuadToolsStrip from './common/toolsstrip.view';
class BuildController extends React.Component {
    render() {
        return (<div>
                <UserContext.Consumer>
                {user => (<QuadToolsStrip user={user} childrenposition='end'>
                        <div style={{ display: 'inline-block', verticalAlign: 'middle',
            marginLeft: '12px', borderLeft: '1px solid gray' }}>
                            <Icon style={{ margin: '0 8px 0 8px', verticalAlign: 'middle' }}>
                                <img src='/public/icons/fire.svg'/>
                            </Icon>
                            <div style={{ display: 'inline', color: 'dimgray', fontSize: 'smaller' }}>
                                Tribalopolis: a virtual city of tribes
                            </div>
                        </div>
                    </QuadToolsStrip>)}
                </UserContext.Consumer>                
            </div>);
    }
}
export default BuildController;
//# sourceMappingURL=build.controller.jsx.map