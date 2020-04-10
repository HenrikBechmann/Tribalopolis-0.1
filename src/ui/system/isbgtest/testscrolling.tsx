// testscrolling.tsx

import React, {useState, useEffect, useRef, useCallback} from 'react'

const styles = {
     viewport:{
         overflow:'auto',
         position:'absolute',
         top:0,
         right:0,
         bottom:0,
         left:0,
         backgroundColor:'black'

     },
     scrollblock:{
         height:'100%',
         backgroundColor:'green',
         width:'4000px',
         position:'absolute',
     },
     cradle:{
         backgroundColor:'blue',
         height:'100%',
         width:'400px',
         position:'absolute',
         left:'50px',
     }
 }

const Scrolltest = (props) => {

    const [teststate, saveTeststate] = useState('setup')

    useEffect(()=>{
        switch (teststate) {
            case 'setup':{
                saveTeststate('ready')
                break
            }
        }
    },[teststate])

    const viewportRef = useRef(null)
    const scrollblockRef = useRef(null)

    useEffect(() => {

        viewportRef.current.addEventListener('scroll',onScroll)

        return () => {

            viewportRef.current && viewportRef.current.removeEventListener('scroll',onScroll)

        }

    },[])

    const timeoutIDRef = useRef(null)
    const timeoutInProcessRef = useRef(false)
    const translateRef = useRef(0)
    const onScroll = () => {
        if (!timeoutInProcessRef.current) {
            timeoutIDRef.current = setTimeout(()=>{
                // let scrollLeft = viewportRef.current.scrollLeft
                // viewportRef.current.scrollLeft = (scrollLeft - 300)
                // timeoutInProcessRef.current = false
                // console.log('going back from/to', scrollLeft, viewportRef.current.scrollLeft)
                // let translate = translateRef.current - 10
                // translateRef.current = translate
                // scrollblockRef.current.style.transform = 'translate(' + translate + 'px)'

                // console.log('translate',translate,scrollblockRef.current.style.transform)
                // viewportRef.current.style.backgroundColor = 'pink'
            },100)
        }
    }

    return <div ref = {viewportRef} style = {styles.viewport as React.CSSProperties}>
        <div ref = {scrollblockRef} style = {styles.scrollblock as React.CSSProperties}>
            {(teststate != 'setup')?<div style = {styles.cradle as React.CSSProperties}>
            </div>:null}
        </div>
    </div>
}

export default Scrolltest