// services.tsx
/*
    This is the high level application controller
    It's main responsibility is to co-ordinate the store and the domain
    application -> datamodel + viewmodel -> domain (gateway) -> firebase

    datamodel and viewmodel are both bypassed
*/

// import Datamodel from './datamodel'

import domain from './domain'

const getScheme = (datatoken) => {
    return domain.getScheme(datatoken)
}

const setTypeListener = (datatoken) => {
    return domain.setTypeListener(datatoken)
}

const setItemListener = (datatoken) => {
    return domain.setItemListener(datatoken)
}

const setListListener = (datatoken) => {
    return domain.setListListener(datatoken)
}

const getLink = (datatoken) => {
    return domain.getLink(datatoken)
}

const getFolder = (datatoken) => {
    return domain.getFolder(datatoken)
}

const getAccount = (datatoken) => {
    return domain.getAccount(datatoken)
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