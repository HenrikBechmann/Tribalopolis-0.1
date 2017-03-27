// splitter.tsx

/*
    TODO: - bug showing tabs when collapse is not 0
    - implement all control properties
    - make work on mobile devices
*/

import * as React from 'react'
import FontIcon from 'material-ui/FontIcon'

import { styles as globalstyles } from '../utilities/styles'
import DragHandle from './draghandle'

import MoveDraghandleLayer from './movedraghandlelayer'

let styles = globalstyles.splitter

interface SplitterProps {
    primaryPane:JSX.Element,
    secondaryPane:JSX.Element,
    division?:number, // 0-100
    collapse?:1 | -1 | 0,
    orientation?: "horizontal" | "vertical",
    threshold?:number, // pixels
    showTabs?:boolean,
    showHandle?:boolean,
}
class Splitter extends React.Component<SplitterProps,any> {

    constructor(props:SplitterProps) {
        super(props)
        let { division, collapse, orientation, threshold, showHandle, showTabs } = this.props
        if (division < 0) division = 0
        if (division > 100) division = 100
        orientation = orientation || 'horizontal'
        division = division || 50
        collapse = collapse || 0
        threshold = threshold || 100
        showHandle = (showHandle == undefined)?true:showHandle
        showTabs = (showTabs == undefined)?false:showTabs
        if (!(showHandle || showTabs)) showHandle = true
        this.showHandle = showHandle
        this.showTabs = showTabs
        this.threshold = threshold
        this.orientation = orientation
        this.state = {
            division,
            collapse,
        }
        this.setCollapseStyles(collapse,division)
        this.primaryPane = React.cloneElement(
            props.primaryPane,
            {
                paneid:'primaryPane',
                triggers:this.triggerlist,
                getPaneTriggers:this.getPaneTriggers,
            }
        )
        this.secondaryPane = React.cloneElement(
            props.secondaryPane,
            // {
            //     paneid:'secondaryPane',
            //     triggers:this.triggerlist,
            //     getPaneTriggers:this.getPaneTriggers,
            // }
        )
    }

    triggerlist = ['onStartSplitterDrag','onEndSplitterDrag']

    getPaneTriggers = (paneid,triggers) => {
        // console.log('paneid,triggers',paneid,triggers)
        this.triggers[paneid] = triggers
    }

    triggers = {
        primaryPane:Object,
        secondaryPane:Object,
    }

    primaryPane:JSX.Element
    secondaryPane:JSX.Element

    orientation:string
    threshold:number
    showTabs:boolean
    showHandle:boolean

    componentDidMount() {
        let el = document.getElementById('splitterframe')
        let height = el.clientHeight
        if ((this.threshold / height) > .25)
            this.threshold = height * .25   
    }

    // update state if division or collapse changes
    componentWillReceiveProps(nextProps) {
        if ((nextProps.division !== this.props.division) ||
            (nextProps.collapse !== this.props.collapse)) {
            let { division, collapse } = nextProps
            this.setState({
                division,
                collapse,
            })
            this.setCollapseStyles(collapse,division)
        }

    }

    stylememo:any = null

    dragStart = () => {
        let stylememo = {
            transitions:{
                topframe:styles.topframe.transition,
                splitter:styles.splitter.transition,
                bottomframe:styles.bottomframe.transition,
            },
        }
        this.stylememo = stylememo
        styles.topframe.transition = 'unset'
        styles.splitter.transition = 'unset'
        styles.bottomframe.transition = 'unset'
        for (let trigger in this.triggers) {
            if (this.triggers[trigger]['onStartSplitterDrag']) {
                this.triggers[trigger]['onStartSplitterDrag']()
            }
        }
    }

    dragEnd = () => {
        let stylememo = this.stylememo
        this.stylememo = null
        styles.topframe.transition = stylememo.transitions.topframe
        styles.splitter.transition = stylememo.transitions.splitter
        styles.bottomframe.transition = stylememo.transitions.bottomframe
        for (let trigger in this.triggers) {
            if (this.triggers[trigger]['onEndSplitterDrag']) {
                this.triggers[trigger]['onEndSplitterDrag']()
            }
        }
    }

    dragUpdate = (args) => {
        let newdivision = 
            (((args.frameDimensions.reference + args.diffOffset.y)
            / args.frameDimensions.height) * 100)
        if (newdivision > 100) newdivision = 100
        if (newdivision < 0) newdivision = 0
        this.setCollapseStyles(0,newdivision)
        this.setState({
            division:newdivision,
            collapse:0
        })
    }

    getFrameDimensions = () => {
        let el = document.getElementById('splitterframe')
        let { collapse } = this.state
        let reference 
        if (collapse) {
            reference = (collapse == -1)? 0:el.clientHeight
        } else {
            reference = (el.clientHeight * (this.state.division/100))
        }
        let frameDimensions = 
            {
                height:el.clientHeight,
                width:el.clientWidth,
                reference,
            }
        // console.log('frameDimensions',frameDimensions)
        return frameDimensions
    }

    onCollapseCall = (selection) => {
        let collapse = this.state.collapse
        let newcollapse = null
        if (!collapse) {
            if (selection == 'primary') {
                newcollapse = 1
            } else {
                newcollapse = -1
            } 
        } else {
            newcollapse = 0
        }
        this.setCollapseStyles(newcollapse, this.state.division)
        this.setState({
            collapse:newcollapse
        })
    }

    setCollapseStyles = (collapse, division) => {
        if (collapse) {
            if (collapse == 1) {
                styles.topframe.bottom = '2px'
                styles.bottomframe.top = '100%'
                styles.splitter.bottom = '0px'
            } else {
                styles.topframe.bottom = '100%'
                styles.bottomframe.top = '2px'
                styles.splitter.bottom = 'calc(100% - 2px)'
            } 
        } else {
            styles.topframe.bottom = `calc(${100-division}% + 1px)`
            styles.bottomframe.top = `calc(${division}% + 1px)`
            styles.splitter.bottom = `calc(${100-division}% - 1px)`
        }
    }

    render() {
        let collapse = this.state.collapse
        styles.collapsetabtop.display = (collapse == -1)?'none':'flex'
        styles.collapsetabbottom.display = (collapse == 1)?'none':'flex'
        // mutated values not allowed (deprectated by React); make fresh clones
        const topframe = Object.assign({},styles.topframe)
        const splitter = Object.assign({},styles.splitter)
        const collapsetabtop = Object.assign({},styles.collapsetabtop)
        const collapsetabbottom = Object.assign({},styles.collapsetabbottom)
        const bottomframe = Object.assign({},styles.bottomframe)
        const draghandle = Object.assign({},styles.draghandle)
        return <div id = 'splitterframe' style = {styles.splitterframe}>
            <div 
                style = {topframe}
            >
                {this.primaryPane}
            </div>
            <div style = {splitter}>
                <DragHandle 
                    dragStart = {this.dragStart}
                    dragEnd = {this.dragEnd}
                    dragUpdate = {this.dragUpdate}
                    getFrameDimensions = {this.getFrameDimensions}
                />
                <MoveDraghandleLayer />
                <div 
                    onClick = { e => {
                        this.onCollapseCall('primary')
                    }}
                    style={collapsetabtop}
                >
                    <FontIcon className="material-icons">
                        {
                            !collapse?'arrow_drop_down':
                            (collapse == 1)?'arrow_drop_up':
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
                            (collapse == -1)?'arrow_drop_down':
                            'arrow_drop_up'
                        }
                    </FontIcon>
                </div>
            </div>
            <div 
                style={bottomframe}>
                {this.secondaryPane}
            </div>
        </div>
    }
}

export default Splitter