import theme from 'material-ui/styles/baseThemes/lightBaseTheme'



export let styles = {
    // the main scaffold
    frame:{
        display:'flex',
        flexDirection:'column',
        position:'absolute',
        top:0,
        right:0,
        bottom:0,
        left:0,
    },
    header:{
        flex:'none'
    },
    main:{
        flex:'auto',
        position:'relative'
    },
    footer:{flex:'none'},
    // header content
    toolbar:{},
    title:{
        backgroundColor:'palegoldenrod',
        height:'16px',
        fontFamily:theme.fontFamily,
        textColor:theme.palette.textColor,
        fontSize:'.8em',
        whiteSpace:'nowrap',
        overflow:'hidden',
        padding:'3px'
    },

    list:{
        frame:{
            position:'relative',
            height:'100%',
            overflow:'scroll'
        },
        content:{
            backgroundColor:'lightgreen',height:'600px'
        },
    },
    item:{
        frame:{
            position:'relative',
            height:'100%',
            overflow:'scroll',
        },
        content:{
            backgroundColor:'cyan',height:'600px',
        }
    },
    // footer content
    status:{
        backgroundColor:'palegoldenrod',
        height:'1.5em',
        width:'calc(100% - 6px)',
        border:'3px ridge gray',
        borderRadius:'6px',
    },

    // splitter
    splitter:{
        splitterframe: {
            height:'100%',
            width:'100%',
            position:'absolute',
        },
        topframe:{
            position:'absolute',
            // top:'0px',
            // left:'0px',
            // right:'0px', // can be over-ridden
            // bottom:'calc(50% + 1px)', // set by splitter
            // transition: 'bottom .5s ease-out, left .5s ease-out',
        }, 
        splitter:{
            position:'absolute',
            backgroundColor:'lightgoldenrodyellow',
            // bottom:'calc(50% - 1px)', // set by splitter
            // width:'100%',
            // height:'0px',
            // borderTop:'2px solid gray',
            // transition: 'bottom .5s ease-out, left .5s ease-out',
        },
        draghandle: {
            opacity:1,
            position:'absolute',
            width:'36px',
            height:'36px',
            border:'1px solid gray',
            borderRadius:'6px',
            backgroundColor:'palegoldenrod',
            zIndex:2,
            display:'flex',
            justifyContent:"center",
            alignItems:'center',
            visibility:'visible',
            transition:'opacity .5s ease-out,visibility 0s .5s',
        },
        collapsetabtop:   {
            position:'absolute',
            height:'36px',
            width:'36px',
            // bottom:'1px',
            // right:'10px',
            backgroundColor:'#cff',   
            zIndex:2,
            display:'flex',
            justifyContent:"center",
            alignItems:'center',
            border:'1px solid gray',
            cursor:'pointer',
            borderRadius:'6px 6px 0 0',
            visibility:'visible',
            opacity:1,
            transition:'opacity .5s ease-out,visibility 0s .5s',
            // transform:'rotate(90deg)'
        },
        collapsetabbottom:{
            position:'absolute',
            height:'36px',
            width:'36px',
            // top:'-1px',  
            // right:'10px',
            backgroundColor:'#d3f8d3',
            zIndex:2,display:'flex',
            justifyContent:"center",
            alignItems:'center',
            border:'1px solid gray',
            cursor:'pointer',
            borderRadius:'0 0 6px 6px',
            visibility:'visible',
            opacity:1,
            transition:'opacity .5s ease-out,visibility 0s .5s',
            // transform:'rotate(90deg)'
        },

        bottomframe:{
            backgroundColor:'green',
            position:'absolute',
            // bottom:'0px',
            // right:'0px',
            // left:'0px',
            // top:'calc(50% + 1px)', // set by splitter
            // transition: 'top .5s ease-out, right .5s ease-out',
        },
    },
}
