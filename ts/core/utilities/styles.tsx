import theme from 'material-ui/styles/baseThemes/lightBaseTheme'

// TODO getMuiTheme may be preferable in the long run,
// or theme available from global state
// import getMuiTheme from 'material-ui/styles/getMuiTheme'
// let muiTheme = getMuiTheme()
// console.log(muiTheme)

// TODO: register issue with 'justify-content' bad interface

export let styles = {
    // the main scaffold
    frame:{
        display:'flex',
        "flex-direction":'column',
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
    // main content
    spacegraph:
        {
            fixedframe:{backgroundColor:'lightcyan',position:'relative',height:'100%',width:'100%'},
            frame:{backgroundColor:'lightcyan',position:'relative',height:'100%',width:'100%',overflow:'scroll'},
            platform:{height:'600px',minWidth:'100%',width:'600px',backgroundColor:'yellow'},
            originframe:{zIndex:1,position:'absolute',top:0,left:0,backgroundColor:'lightgreen',borderRadius:'8px',border:'3px ridge gray',boxShadow:'rgba(0, 0, 0, 0.156863) 0px 3px 10px, rgba(0, 0, 0, 0.227451) 0px 3px 10px'},
            origin:{
                float:'left',
                width:'72px',
                height:'72px',
                border:'1px solid silver',
                backgroundColor:'lightblue',
                borderRadius:'50%',
                overflow:'hidden',
            },
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
            // left:'calc(50% - 18px)',
            // bottom:'calc(-18px)',
            backgroundColor:'palegoldenrod',
            zIndex:2,
            display:'flex',
            'justify-content':"center",
            alignItems:'center',
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
            'justify-content':"center",
            alignItems:'center',
            border:'1px solid gray',
            cursor:'pointer',
            borderRadius:'6px 6px 0 0',
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
            'justify-content':"center",
            alignItems:'center',
            border:'1px solid gray',
            cursor:'pointer',
            borderRadius:'0 0 6px 6px',
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
