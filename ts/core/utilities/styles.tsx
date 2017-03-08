import theme from 'material-ui/styles/baseThemes/lightBaseTheme'

// TODO getMuiTheme may be preferable in the long run,
// or theme available from global state
// import getMuiTheme from 'material-ui/styles/getMuiTheme'
// let muiTheme = getMuiTheme()
// console.log(muiTheme)

// TODO: register issue with 'justify-content' bad interface

export let styles = {
    toolbar:{height:'56px'},
    title:{backgroundColor:'palegoldenrod',height:'16px',fontFamily:theme.fontFamily,textColor:theme.palette.textColor,fontSize:'.8em',whiteSpace:'nowrap',overflow:'hidden',padding:'3px'},
    status:{backgroundColor:'palegoldenrod',height:'1.5em',width:'calc(100% - 6px)',position:'absolute',bottom:0,border:'3px ridge gray',borderRadius:'6px'},
    spacegraph:
        {
            fixedframe:{backgroundColor:'lightcyan',position:'relative',height:'calc(100% - 78px'},
            frame:{backgroundColor:'lightcyan',position:'relative',height:'100%',width:'100%',overflow:'scroll'},
            platform:{height:'400px',minWidth:'100%',width:'600px',backgroundColor:'yellow'},
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
            addbutton:{position:'absolute',right:'5px',top:'5px',zIndex:1},
        },
    list:{backgroundColor:'lightgreen',height:'600px'},
    topframe:{position:'absolute',top:0,right:0,left:0,bottom:'calc(45% + 2px'}, 
    splitter:{position:'absolute',bottom:'45%',width:'100%',height:0,borderTop:'2px solid gray'}, 
    collapsetabtop:{position:'absolute',height:'36px',width:'48px',bottom:'1px',right:'10px',backgroundColor:'#cff',zIndex:2,display:'flex',"justify-content":"center",alignItems:'center',border:'1px solid gray',cursor:'pointer',borderRadius:'6px 6px 0 0'},
    collapsetabbottom:{position:'absolute',height:'36px',width:'48px',top:'-1px',right:'10px',backgroundColor:'#d3f8d3',zIndex:2,display:'flex',"justify-content":"center",alignItems:'center',border:'1px solid gray',cursor:'pointer',borderRadius:'0 0 6px 6px'},
    bottomframe:{overflow:'scroll',backgroundColor:'green',position:'absolute',bottom:0,right:0,left:0,top:'55%'},
    frame:{position:'absolute',top:0,right:0,bottom:0,left:0}
}
