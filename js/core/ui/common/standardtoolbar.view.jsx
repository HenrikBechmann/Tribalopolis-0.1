// standardtoolbar.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import React from 'react';
import Icon from '@material-ui/core/Icon';
import UserContext from '../../services/user.context';
import QuadToolsStrip from './toolsstrip.view';
const StandardToolbar = (props) => {
    return (<div>
            <UserContext.Consumer>
            {user => (<QuadToolsStrip user={user} childrenposition='end'>
                    <div style={{ display: 'inline-block', verticalAlign: 'middle',
        marginLeft: '12px', borderLeft: '1px solid gray' }}>
                        <Icon style={{ margin: '0 8px 0 8px', verticalAlign: 'middle' }}>
                            <img src='/public/icons/fire.svg'/>
                        </Icon>
                        <div style={{
        display: 'inline',
        color: 'dimgray',
        fontSize: 'smaller',
        fontStyle: 'italic',
    }}>
                            Tribalopolis is a virtual city of tribes
                        </div>
                    </div>
                </QuadToolsStrip>)}
            </UserContext.Consumer>
            <div style={{ height: '48px', width: '100%' }}></div>
        </div>);
};
export default StandardToolbar;
//# sourceMappingURL=standardtoolbar.view.jsx.map