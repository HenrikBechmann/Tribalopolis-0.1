// splitter.tsx
import * as React from 'react'
import { styles as globalstyles } from '../utilities/styles'
import FontIcon from 'material-ui/FontIcon'

let styles = globalstyles.splitter

interface SplitterProps {
    primaryPane:any,
    secondaryPane:any,
}
class Splitter extends React.Component<SplitterProps,any> {

    state = {
        orientation:'horizontal',
        collapse:0, // 0 = no, -1 = primary, 1 = secondary
        division:50, // %
    }

    onCollapseCall = (selection) => {
        console.log('onCollapseCall',selection)
        let collapse = this.state.collapse
        if (selection == 'primary') {
            if (!collapse) {
                styles.topframe.bottom = '2px'
                styles.bottomframe.top = '100%'
                styles.splitter.bottom = '0px'
                this.setState({
                    collapse:-1
                })
            } else {
                styles.topframe.bottom = 'calc(50% + 1px)'
                styles.bottomframe.top = 'calc(50% + 1px)'
                styles.splitter.bottom = 'calc(50% - 1px)'
                this.setState({
                    collapse:0
                })
            }
        } else {
            if (!collapse) {
                styles.topframe.bottom = '100%'
                styles.bottomframe.top = '2px'
                styles.splitter.bottom = 'calc(100% - 2px)'
                this.setState({
                    collapse:1
                })
            } else {
                styles.topframe.bottom = 'calc(50% + 1px)'
                styles.bottomframe.top = 'calc(50% + 1px)'
                styles.splitter.bottom = 'calc(50% - 1px)'
                this.setState({
                    collapse:0
                })
            }
        }
    }

    render() {
        let collapse = this.state.collapse
        styles.collapsetabtop.display = (collapse == 1)?'none':'flex'
        styles.collapsetabbottom.display = (collapse == -1)?'none':'flex'
        return <div style = {styles.splitterframe}>
            <div style={styles.topframe}>
                {this.props.primaryPane}
            </div>
            <div style = {styles.splitter}>
                <div 
                    onClick = { e => {
                        this.onCollapseCall('primary')
                    }}
                    style={styles.collapsetabtop}
                >
                    <FontIcon className="material-icons">
                        {
                            !collapse?'arrow_drop_down':
                            (collapse == -1)?'arrow_drop_up':
                            'arrow_drop_down'
                        }
                    </FontIcon>
                </div>
                <div 
                    onClick = { e => {
                        this.onCollapseCall('secondary')
                    }}
                    style={styles.collapsetabbottom}
                >
                    <FontIcon className="material-icons">
                        {
                            !collapse?'arrow_drop_up':
                            (collapse == 1)?'arrow_drop_down':
                            'arrow_drop_up'
                        }
                    </FontIcon>
                </div>
            </div>
            <div style={styles.bottomframe}>
                {this.props.secondaryPane}
            </div>
        </div>
    }
}

export default Splitter