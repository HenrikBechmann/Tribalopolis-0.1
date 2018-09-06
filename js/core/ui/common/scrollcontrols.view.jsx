// scrollcontrols.view.tsx
// copyright (c) 2017 Henrik Bechmann, Toronto, MIT Licence
// these are the left/right custom arrows that appear when there is a list overflow
'use strict';
import * as React from 'react';
class ScrollControlsView extends React.Component {
    constructor() {
        super(...arguments);
        this.scroller = null;
        this.scrollerData = {
            height: null,
            offsetLeft: null,
            offsetRight: null,
        };
        this.calcScrollerData = () => {
            let { scrollerData, scroller } = this;
            if (!scroller)
                return;
            scrollerData.height = scroller.clientHeight;
            scrollerData.offsetLeft = scroller.scrollLeft;
            scrollerData.offsetRight = this.calcScrollRight();
            // console.log('calculated scrollerData',scrollerData)
        };
        this.calcScrollRight = () => {
            let { scrollLeft, scrollWidth, clientWidth } = this.scroller;
            // console.log('calcScrollRight',scrollWidth,scrollLeft,clientWidth)
            return (scrollWidth - (scrollLeft + clientWidth));
        };
        this.onResize = () => {
            // this.calcScrollerData()
            this.onScroll();
        };
        this.onScroll = () => {
            if (!this.scroller)
                return;
            let { scroller, scrollerData } = this;
            let { scrollLeft } = scroller;
            scrollerData.offsetLeft = scrollLeft;
            scrollerData.offsetRight = this.calcScrollRight();
            this.updateControlVisibility();
        };
        this.updateControlVisibility = () => {
            let { leftcontrol, rightcontrol } = this.refs;
            if (!leftcontrol || !rightcontrol)
                return;
            let leftOpacity = Number(leftcontrol['style'].opacity);
            let rightOpacity = Number(rightcontrol['style'].opacity);
            let { offsetLeft, offsetRight } = this.scrollerData;
            // console.log('updateControlVisibility',this.scrollerData,offsetLeft,offsetRight)
            if (!!offsetLeft && !leftOpacity) {
                leftcontrol['style'].opacity = 1;
            }
            else if (!offsetLeft && !!leftOpacity) {
                leftcontrol['style'].opacity = 0;
            }
            if (!!offsetRight && !rightOpacity) {
                rightcontrol['style'].opacity = 1;
            }
            else if (!offsetRight && !!rightOpacity) {
                rightcontrol['style'].opacity = 0;
            }
        };
        this.scrollToLeft = () => {
            if (!this.scroller)
                return;
            let original = this.scroller.scrollLeft;
            if (original == 0)
                return;
            let scrollleft = original - this.scroller.clientWidth;
            this.smoothScroll(scrollleft);
        };
        this.scrollToRight = () => {
            if (!this.scroller)
                return;
            let original = this.scroller.scrollLeft;
            let clientWidth = this.scroller.clientWidth;
            let scrollWidth = this.scroller.scrollWidth;
            if (original == (scrollWidth - clientWidth))
                return;
            let scrollright = original + clientWidth;
            this.smoothScroll(scrollright);
        };
        // TODO apply some kind of easing; simplify, use requestAnimationFrame
        this.smoothScroll = incomingtarget => {
            if (!this.scroller)
                return;
            let scroller = this.scroller;
            let original = scroller.scrollLeft;
            let target = incomingtarget;
            let ms = 500;
            let fps = 60;
            let frames = fps / (1000 / ms);
            if (target < 0)
                target = 0;
            let rightmax = scroller.scrollwidth - scroller.clientwidth;
            if (target > rightmax)
                target = rightmax;
            try {
                let poschange = target - original;
                let msperinterval = ms / frames; // desired time; frames per half second
                let tickslimit = ms / msperinterval;
                let pospertick = poschange / tickslimit;
                let ticks = 0;
                let timer = setInterval(() => {
                    if ((ticks * msperinterval) > ms) {
                        clearInterval(timer);
                        return;
                    }
                    ticks++;
                    let span = ticks * pospertick;
                    let next = original + span;
                    scroller.scrollLeft = next;
                }, msperinterval);
            }
            catch (e) {
                // abandon
            }
        };
        this.arrowStyle = {
            position: 'absolute',
            width: '20px',
            height: '40px',
            border: '1px solid gray',
            zIndex: 2,
            fontSize: '30px',
            color: 'darkslategray',
            overflow: 'hidden',
            backgroundColor: 'rgba(240,248,255,.7)',
            opacity: 0,
            transition: 'opacity .5s',
            cursor: 'pointer',
        };
        this.leftArrowStyle = Object.assign({}, this.arrowStyle, { left: 0, borderBottomRightRadius: '20px', borderTopRightRadius: '20px', borderLeft: 0 });
        this.rightArrowStyle = Object.assign({}, this.arrowStyle, { right: 0, borderBottomLeftRadius: '20px', borderTopLeftRadius: '20px', borderRight: 0 });
    }
    componentWillReceiveProps(next) {
        // received on second render
        if (!this.scroller && next.scroller) {
            let scroller = this.scroller = next.scroller;
            this.calcScrollerData();
            scroller.addEventListener('scroll', this.onScroll);
            window.addEventListener('resize', this.onResize);
        }
    }
    componentDidUpdate() {
        this.onScroll();
    }
    componentWillUnmount() {
        if (this.scroller) {
            this.scroller.removeEventListener('scroll', this.onScroll);
            window.removeEventListener('resize', this.onResize);
        }
    }
    render() {
        let verticalpos = null;
        if (this.scroller) {
            verticalpos = (this.scrollerData.height / 2) - 20;
        }
        // console.log('verticalpos',verticalpos)
        let leftStyle = Object.assign({}, this.leftArrowStyle, { top: 'calc(50% - 20px)' });
        let rightStyle = Object.assign({}, this.rightArrowStyle, { top: 'calc(50% - 20px)' });
        this.updateControlVisibility();
        let wrapperstyle = Object.assign({ position: 'relative' }, this.props.style);
        return (<div style={wrapperstyle}>

                
                <div style={leftStyle} ref="leftcontrol" onClick={this.scrollToLeft}>

                    <div style={{
            marginLeft: '-10px',
            marginTop: '2px',
        }}>

                        <div style={{
            fontSize: '36px',
        }} className='material-icons'>
                        
                            chevron_left

                        </div>

                   </div>

                </div>

                
                <div style={rightStyle} ref="rightcontrol" onClick={this.scrollToRight}>

                    <div style={{
            marginLeft: '-6px',
            marginTop: '2px',
        }}>

                        <div style={{
            fontSize: '36px',
        }} className='material-icons'>

                            chevron_right

                        </div>

                    </div>

                </div>

                
                {this.props.children}

            </div>);
    }
}
export default ScrollControlsView;
//# sourceMappingURL=scrollcontrols.view.jsx.map