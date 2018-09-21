// services.tsx
/*
    This is the high level application controller
    It's main responsibility is to co-ordinate the store and the domain
    application -> datamodel + viewmodel -> domain (gateway) -> firebase

    datamodel and viewmodel are both bypassed
*/

// import Datamodel from './datamodel'

import domain from './domain'

const setTypeListener = (token) => {
    return domain.setTypeListener(token)
}

const setItemListener = (token,instanceid,callback) => {
    let item = domain.setItemListener(token)
    let type = domain.setTypeListener(item.type)

    // setTimeout(()=> {
        callback(item,type)
    // },1000)
}

const setListListener = (token,instanceid = null,callback = null) => {
    // if (!callback) {
    //     return domain.setListListener(token)
    // } else {
        let list = domain.setListListener(token)
        let type = domain.setTypeListener(list.type)

        // setTimeout(()=>{
            callback(list,type)
        // },1000)
    // }
}

const getScheme = (token) => {
    return domain.getScheme(token)
}

const getLink = (token) => {
    return domain.getLink(token)
}

const getFolder = (token) => {
    return domain.getFolder(token)
}

const getAccount = (token) => {
    return domain.getAccount(token)
}

let application = {
    setItemListener,
    setListListener,
    setTypeListener,
    getLink,
    getScheme,
    getFolder,
    getAccount,
}

export default application