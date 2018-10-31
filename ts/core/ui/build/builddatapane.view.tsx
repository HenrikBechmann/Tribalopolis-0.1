// quaddatapane.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence

'use strict'

import React from 'react'

import { withStyles, createStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

import application from '../../services/application'
import { toast } from 'react-toastify'

let _ = require('lodash')

const styles = createStyles({
    root:{
        position:'absolute',
        top:'15px',
        right:'6px',
        bottom:'6px',
        left:'6px',
        overflow:'auto',
    },
    content:{
        padding:'3px',
    },
    platform:{
        width:'100%',
        padding:'3px',
    }
})

class BuildDataPane extends React.Component<any,any>  {

    state = {
        open:this.props.open,
        opcode:this.props.dataPack?this.props.dataPack.opcode:undefined,
        specs:this.props.dataPack?this.props.dataPack.specs:undefined,
    }

    data = null

    componentDidUpdate() {

        let { open, dataPack } = this.props
        dataPack = dataPack || {}
        let { opcode, specs } = dataPack
        if (!_.isEqual(open,this.state.open) || 
            !_.isEqual(opcode,this.state.opcode) ||
            !_.isEqual(specs, this.state.specs)) {
            // console.log('not equal; run setState',this.props, this.state)
            this.setState({
                open,
                opcode,
                specs,
            },() => {
                this.updateData()
            })
        }
    }

    updateData = () => {
        let superuser = ((this.props.user) && (this.props.user.uid =='112979797407042560714'))

        if (this.state.open) {
            if (!superuser) {
                toast.info('Data Drawer data is only available to Henrik Bechmann as this time')
            } else {
                application.getCollection(this.state.specs.collection,this.dataSuccess,this.dataFailure)
            }
        } else {
            if (superuser) {
                this.data = null
                this.forceUpdate()
            }
        }
    }

    dataSuccess = queryData => {
        this.data = queryData
        this.forceUpdate()
    }

    dataFailure = error => {
        console.log('collection fetch error',error)
        toast.error(error)
    }

    getListItems = () => {
        let items = []
        let data = this.data

        if (!data) return items

        for (let item of data) {
            items.push(
                <ListItem dense key = {item.id}>
                    <ListItemText primary = {item.id} />
                </ListItem>
            )
        }
        return items
    }

    render() {
        const { classes, dataPack } = this.props

        return <Paper className = {classes.root}>
            <div className = { classes.content }>
                <div className = { classes.platform }>
                    <List dense disablePadding >
                        {this.getListItems()}
                    </List>
                </div>
            </div>
        </Paper>
    }

}

export default withStyles(styles)( BuildDataPane )
