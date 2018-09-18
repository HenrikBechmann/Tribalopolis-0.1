// services.tsx
/*
    This is the high level application controller
    It's main responsibility is to co-ordinate the store and the domain
    application -> datamodel + viewmodel -> domain (gateway) -> firebase

    datamodel and viewmodel are both bypassed
*/

// import Datamodel from './datamodel'

import domain from './domain'

const setTypeListener = (doctoken) => {
    return domain.setTypeListener(doctoken)
}

const setItemListener = (doctoken,instanceid,callback) => {
    let item = domain.setItemListener(doctoken)
    let type = domain.setTypeListener(item.type)

    // setTimeout(()=> {
        callback(item,type)
    // },1000)
}

const setListListener = (doctoken,instanceid = null,callback = null) => {
    if (!callback) {
        return domain.setListListener(doctoken)
    } else {
        let list = domain.setListListener(doctoken)
        let type = domain.setTypeListener(list.type)

        // setTimeout(()=>{
            callback(list,type)
        // },1000)
    }
}

const getScheme = (doctoken) => {
    return domain.getScheme(doctoken)
}

const getLink = (doctoken) => {
    return domain.getLink(doctoken)
}

const getFolder = (doctoken) => {
    return domain.getFolder(doctoken)
}

const getAccount = (doctoken) => {
    return domain.getAccount(doctoken)
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