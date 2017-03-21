// splitter.tsx

/// refer
import * as React from 'react'
import FontIcon from 'material-ui/FontIcon'

import { styles as globalstyles } from '../utilities/styles'
import DragHandle from './draghandle'

import MoveDraghandleLayer from './movedraghandlelayer'

let styles = globalstyles.splitter

window['tribalopolis_global'] = 5

console.log('window.var',window['tribalopolis_global'])

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

    dragUpdate = (args) => {
        console.log('dragupdate args',args)
    }

    onCollapseCall = (selection) => {
        let collapse = this.state.collapse
        let newcollapse = null
        if (!collapse) {
            if (selection == 'primary') {
                styles.topframe.bottom = '2px'
                styles.bottomframe.top = '100%'
                styles.splitter.bottom = '0px'
                newcollapse = -1
            } else {
                styles.topframe.bottom = '100%'
                styles.bottomframe.top = '2px'
                styles.splitter.bottom = 'calc(100% - 2px)'
                newcollapse = 1
            } 
        } else {
            styles.topframe.bottom = 'calc(50% + 1px)'
            styles.bottomframe.top = 'calc(50% + 1px)'
            styles.splitter.bottom = 'calc(50% - 1px)'
            newcollapse = 0
        }
        this.setState({
            collapse:newcollapse
        })
    }

    render() {
        let collapse = this.state.collapse
        styles.collapsetabtop.display = (collapse == 1)?'none':'flex'
        styles.collapsetabbottom.display = (collapse == -1)?'none':'flex'
        // mutated values not allowed (deprectated by React); make fresh clones
        const topframe = Object.assign({},styles.topframe)
        const splitter = Object.assign({},styles.splitter)
        const collapsetabtop = Object.assign({},styles.collapsetabtop)
        const collapsetabbottom = Object.assign({},styles.collapsetabbottom)
        const bottomframe = Object.assign({},styles.bottomframe)
        const draghandle = Object.assign({},styles.draghandle)
        return <div style = {styles.splitterframe}>
            <div 
                style = {topframe}
            >
                {this.props.primaryPane}
            </div>
            <div style = {splitter}>
                <DragHandle />
                <MoveDraghandleLayer 
                 />
                <div 
                    onClick = { e => {
                        this.onCollapseCall('primary')
                    }}
                    style={collapsetabtop}
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
                    style={collapsetabbottom}
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
            <div 
                style={bottomframe}>
                {this.props.secondaryPane}
            </div>
        </div>
    }
}

export default Splitter