// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
// quadframe.view.tsx

'use strict'

import * as React from 'react'

class QuadFrame extends React.Component<any,any>  {

    constructor(props) {
        super(props)
        this.quadframeelement = React.createRef()
    }

    state = {
        quadrant:this.props.quadrant,
    }
    // quad css position
    position = null
    quadframeelement

    componentWillMount() {
        this.calculatePosition(this.state.quadrant)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.quadrant != this.state.quadrant) {

            let self = this
            this.calculateTransitionPosition(this.state.quadrant)

            this.forceUpdate(() => {
                setTimeout(()=>{// give time for styles to apply
                    self.calculateTransitionPosition(nextProps.quadrant)
                    self.setState({
                        quadrant:nextProps.quadrant
                    },

                        () => {
                            setTimeout(() => { // give time for animation
                                self.calculatePosition(this.state.quadrant)
                                self.forceUpdate()
                            },600)
                        }

                    )
                })
            })
        }
    }

/********************************************************
------------------[ position quadrant ]------------------
*********************************************************/

    calculateTransitionPosition = (quadrant) => {
        let top:any = 'auto'
        let left:any = 'auto'
        let bottom:any = 'auto'
        let right:any = 'auto'
        let quadframeelement = this.quadframeelement.current
        switch (quadrant) {
            case "topleft": {
                top = 0
                left = 0
                break;
            }
            case "topright": {
                top = 0
                left = (quadframeelement.parentElement.offsetWidth/2) + 'px' 
                break;
            }
            case "bottomleft": {
                top = (quadframeelement.parentElement.offsetHeight/2) + 'px' 
                left = 0
                break;
            }
            case "bottomright": {
                top = (quadframeelement.parentElement.offsetHeight /2) + 'px' 
                left = (quadframeelement.parentElement.offsetWidth /2) + 'px' 
                break;
            }
        }
        this.position = {
            top,
            left,
            bottom,
            right,
        }       
    }

    calculatePosition = (quadrant) => {
        let top:any = 'auto'
        let left:any = 'auto'
        let bottom:any = 'auto'
        let right:any = 'auto'
        switch (quadrant) {
            case "topleft": {
                top = 0
                left = 0
                break;
            }
            case "topright": {
                top = 0
                right = 0
                break;
            }
            case "bottomleft": {
                bottom = 0
                left = 0
                break;
            }
            case "bottomright": {
                bottom = 0
                right = 0
                break;
            }
        }
        this.position = {
            top,
            left,
            bottom,
            right,
        }       
    }

    render() {

        let {top, left, bottom, right} = this.position

        let quadframestyle:React.CSSProperties = {
            position:'absolute',
            boxSizing:'border-box',
            width:'50%',
            height:'50%',
            padding:'3px',
            top,
            left,
            bottom,
            right,
            border:'1px solid transparent',
            transition:'all .5s ease'
        }

        return (
            <div 
                style = {quadframestyle}
                ref = {this.quadframeelement}
            >
                {this.props.children}
            </div>
        )
    }

}

export default QuadFrame