// quadselector.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict';
import * as React from 'react';
import IconButton from 'material-ui/IconButton';
class QuadSelector extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            selected: false,
        };
    }
    render() {
        let { quadrant, split, quadselection } = this.props;
        let component = null;
        let element = null;
        if (split != 'none') {
            let icon = null;
            switch (quadrant) {
                case 'topleft':
                    icon = '/public/icons/ic_border_all_black_24px_topleft.svg';
                    break;
                case 'topright':
                    icon = '/public/icons/ic_border_all_black_24px_topright.svg';
                    break;
                case 'bottomleft':
                    icon = '/public/icons/ic_border_all_black_24px_bottomleft.svg';
                    break;
                case 'bottomright':
                    icon = '/public/icons/ic_border_all_black_24px_bottomright.svg';
                    break;
            }
            let leftside = (quadrant == 'topleft' || quadrant == 'bottomleft');
            component = <div style={{
                position: 'absolute',
                bottom: '0',
                left: leftside ? '0' : 'auto',
                right: leftside ? 'auto' : '0',
                height: '32px',
                width: '32px',
                backgroundColor: 'lightgray',
                border: '1px solid silver',
                zIndex: 3,
                borderRadius: leftside ? '0 8px 0 0' : '8px 0 0 0',
            }}>
                <div style={{
                visibility: this.state.selected ? 'visible' : 'hidden',
                position: 'absolute',
                top: '-30px',
                left: leftside ? '20px' : '-60px',
                color: 'white',
                border: '2px solid silver',
                borderRadius: '8px',
                backgroundColor: 'gray',
                fontSize: 'smaller',
                padding: '8px',
            }}>
                    working...
                </div>
                <IconButton style={{ height: '32px', width: '32px', padding: '0' }} onClick={() => {
                this.setState({
                    selected: true
                });
                quadselection(quadrant);
                setTimeout(() => {
                    this.setState({
                        selected: false
                    });
                }, 600);
            }}>
                    <img src={icon}/>
                </IconButton>
            </div>;
        }
        return component;
    }
}
export default QuadSelector;
//# sourceMappingURL=quadselector.view.jsx.map