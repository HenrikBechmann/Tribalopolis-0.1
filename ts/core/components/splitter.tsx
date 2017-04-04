// splitter.tsx

/*
    TODO: 
    - implement all control properties (orientation)
    - hide handle and tabs below parent threshold
    - add min and max props (in pixels) for splitter
    - make work on mobile devices
    - use visible property for tabs to allow fade
    - implement nested splitters
    - vertical splitter
    - find way for tabs and handles to stay out of way of nested splitters
    - provide cue for being inside or outside threshold
*/

import * as React from 'react'
import FontIcon from 'material-ui/FontIcon'

import { styles as globalstyles } from '../utilities/styles'
import DragHandle from './draghandle'

import MoveDraghandleLayer from './movedraghandlelayer'

interface SplitterProps {
    primaryPane:JSX.Element,
    secondaryPane:JSX.Element,
    division?:number, // 0-100
    collapse?:1 | -1 | 0,
    orientation?: "horizontal" | "vertical",
    threshold?:number, // pixels
    showTabs?:boolean,
    showHandle?:boolean,
    minLengthTriggers?:{
        tabs?:number,
        handle?:number,
    },
    getTriggers?:Function,
    triggers?:string[],
    paneid?:string,
}
class Splitter extends React.Component<SplitterProps,any> {

    constructor(props:SplitterProps) {
        super(props)

        let { 
            division, 
            collapse, 
            orientation, 
            threshold, 
            showHandle, 
            showTabs, 
            minLengthTriggers
        } = this.props

        if (division < 0) division = 0
        if (division > 100) division = 100
        orientation = orientation || 'horizontal'
        division = division || 50
        collapse = collapse || 0
        threshold = threshold || 100
        showHandle = (showHandle == undefined)?true:showHandle
        showTabs = (showTabs == undefined)?false:showTabs

        if (minLengthTriggers) {
            if (minLengthTriggers.handle) {
                this.minLengthTriggers.handle = minLengthTriggers.handle
            }
            if (minLengthTriggers.tabs) {
                this.minLengthTriggers.tabs = minLengthTriggers.tabs
            }
        }
        this.showHandle = showHandle
        this.showTabs = showTabs
        this.threshold = threshold
        this.orientation = orientation
        this.state = {
            division,
            collapse,
        }
        this.initStyles()
        this.setCollapseStyles(collapse,division)
        this.primaryPane = React.cloneElement(
            props.primaryPane,
            {
                paneid:'primaryPane',
                triggers:this.triggerlist,
                getTriggers:this.getTriggers,
            }
        )
        this.secondaryPane = React.cloneElement(
            props.secondaryPane,
            {
                paneid:'secondaryPane',
                triggers:this.triggerlist,
                getTriggers:this.getTriggers,
            }
        )
    }

    styles = JSON.parse(JSON.stringify(globalstyles.splitter))

    triggerlist = ['onStartSplitterDrag','onEndSplitterDrag','onSplitterResize']

    getTriggers = (paneid,triggers) => {
        this.triggers[paneid] = triggers
        // console.log('paneid,triggers',paneid,triggers)
    }

    onSplitterResize = () => {
        let length
        if (this.isHorizontal()) {
            length = this.splitterElement.clientWidth
        } else {
            length = this.splitterElement.clientHeight
        }
        console.log('onSplitterResize,length',length)
    }

    triggers = {
        primaryPane:Object,
        secondaryPane:Object,
    }

    minLengthTriggers = {
        tabs:130,
        handle: 60,
    }

    primaryPane:JSX.Element
    secondaryPane:JSX.Element

    orientation:string
    threshold:number
    showTabs:boolean
    showHandle:boolean

    isHorizontal = () => {
        return (this.orientation == 'horizontal')?true:false
    }

    componentWillMount() {
        if (this.props.getTriggers) {
            let triggers = {}
            for (let trigger of this.props.triggers) {
                if (this[trigger]) {
                    triggers[trigger] = this[trigger]
                }
            }
            this.props.getTriggers(this.props.paneid,triggers)
        }
    }


    componentDidMount() {
        let el = this.splitterframe
        let primarylength = this.isHorizontal()?el.clientHeight:el.clientWidth
        // let primarylength = el.clientHeight
        if ((this.threshold / primarylength) > .25)
            this.threshold = primarylength * .25   
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
        let styles = this.styles
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
        let styles = this.styles
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
        let offset = this.isHorizontal()? args.diffOffset.y: args.diffOffset.x
        let height = this.isHorizontal()?args.frameDimensions.height:args.frameDimensions.width
        let newdivision = 
            (((args.frameDimensions.reference + offset)
            / height) * 100)
        if (newdivision > 100) newdivision = 100
        if (newdivision < 0) newdivision = 0
        this.setCollapseStyles(0,newdivision)
        this.setState({
            division:newdivision,
            collapse:0
        })
        let self = this
        // wait for redraw to finish
        setTimeout(() => {
            for (let trigger in self.triggers) {
                if (self.triggers[trigger]['onSplitterResize']) {
                    self.triggers[trigger]['onSplitterResize']()
                }
            }
        })
    }

    afterDrag = (props,monitor) => {
        let item = monitor.getItem()
        let lastDifferences = monitor.getDifferenceFromInitialOffset()
        let lastOffset = this.isHorizontal()?lastDifferences.y:lastDifferences.x
        let newreference = item.frameDimensions.reference + lastOffset

        let height = this.isHorizontal()? item.frameDimensions.height:item.frameDimensions.width
        let bottomdiff = height - newreference
        let topdiff = newreference
        let threshold = this.threshold
        let collapse = this.state.collapse
        let newcollapse
        if (topdiff < threshold) {
            newcollapse = -1
        } else if (bottomdiff < threshold){
            newcollapse = 1
        } else {
            newcollapse = 0
        }
        if (newcollapse || (newcollapse != collapse)) {
            this.setCollapseStyles(newcollapse, this.state.division)
            this.setState({
                collapse:newcollapse
            })
        } 
    }

    getFrameDimensions = () => {
        let el = this.splitterframe
        let { collapse } = this.state
        let reference 
        let offset = this.isHorizontal()?el.clientHeight:el.clientWidth
        if (collapse) {
            reference = (collapse == -1)? 0:offset
        } else {
            reference = (offset * (this.state.division/100))
        }
        let frameDimensions = 
            {
                height:el.clientHeight,
                width:el.clientWidth,
                reference,
            }
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

    initStyles = () => {
        let styles = this.styles
        if (this.isHorizontal()) {
            styles.topframe = Object.assign(styles.topframe,{
                left: '0px',
                right: '0px',
                top:'0px',
                transition: 'bottom .5s ease-out',
            })
            styles.splitter = Object.assign(styles.splitter,{
                width: '100%',
                height: '0px',
                borderTop: '2px solid gray',
                transition: 'bottom .5s ease-out',
            })
            styles.bottomframe = Object.assign(styles.bottomframe,{
                left: '0px',
                right:'0px',
                transition: 'top .5s ease-out',
                bottom:'0px',
            })
            styles.collapsetabtop = Object.assign(styles.collapsetabtop, {
                bottom:'1px',
                right:'10px',
                transform:'none',
            })
            styles.collapsetabbottom = Object.assign(styles.collapsetabbottom, {
                top:'-1px',  
                right:'10px',
                transform:'none',
            })
        } else { // vertical
            styles.topframe = Object.assign(styles.topframe,{
                left: '0px',
                transition: 'right .5s ease-out',
                top: '0px',
                bottom: '0px',
            })
            styles.splitter = Object.assign(styles.splitter,{
                height: '100%',
                width: '0px',
                borderLeft: '2px solid gray',
                transition: 'right .5s ease-out',
            })
            styles.bottomframe = Object.assign(styles.bottomframe,{
                transition: 'left .5s ease-out',
                right:'0px',
                top:'0px',
                bottom: '0px',
            })
            styles.collapsetabtop = Object.assign(styles.collapsetabtop, {
                right:'1px',
                top:'10px',
                transform:'rotate(-90deg)',
            })
            styles.collapsetabbottom = Object.assign(styles.collapsetabbottom, {
                left:'-1px',  
                top:'10px',
                transform:'rotate(-90deg)',
            })
        }
    }

    setCollapseStyles = (collapse, division) => {
        let styles = this.styles
        if (this.isHorizontal()) {
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
        } else { // vertical
            if (collapse) {
                if (collapse == 1) {
                    styles.topframe.right = '2px'
                    styles.bottomframe.left = '100%'
                    styles.splitter.right = '0px'
                } else {
                    styles.topframe.right = '100%'
                    styles.bottomframe.left = '2px'
                    styles.splitter.right = 'calc(100% - 2px)'
                } 
            } else {
                styles.topframe.right = `calc(${100-division}% + 1px)`
                styles.bottomframe.left = `calc(${division}% + 1px)`
                styles.splitter.right = `calc(${100-division}% - 1px)`
            }
        }
    }

    splitterframe:HTMLElement
    splitterElement:HTMLElement

    render() {
        let collapse = this.state.collapse
        let styles = this.styles
        styles.collapsetabtop.display = (collapse == -1)?'none':'flex'
        styles.collapsetabbottom.display = (collapse == 1)?'none':'flex'
        // mutated values not allowed (deprectated by React); make fresh clones
        const topframe = Object.assign({},styles.topframe)
        const splitter = Object.assign({},styles.splitter)
        const collapsetabtop = Object.assign({},styles.collapsetabtop)
        const collapsetabbottom = Object.assign({},styles.collapsetabbottom)
        const bottomframe = Object.assign({},styles.bottomframe)
        const draghandle = Object.assign({},styles.draghandle)
        return <div ref = {(node) => {this.splitterframe = node}} style = {styles.splitterframe}>
            <div 
                style = {topframe}
            >
                {this.primaryPane}
            </div>
            <div ref = {node => {
                this.splitterElement = node
            }}
                style = {splitter}>
                {this.showHandle?<DragHandle 
                    dragStart = {this.dragStart}
                    dragEnd = {this.dragEnd}
                    dragUpdate = {this.dragUpdate}
                    afterDrag = {this.afterDrag}
                    getFrameDimensions = {this.getFrameDimensions}
                    orientation = {this.props.orientation}
                />:null}
                {this.showHandle?<MoveDraghandleLayer />:null}
                {this.showTabs?<div 
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
                </div>:null}
                {this.showTabs?<div 
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
                </div>:null}
            </div>
            <div 
                style={bottomframe}>
                {this.secondaryPane}
            </div>
        </div>
    }
}

export default Splitter