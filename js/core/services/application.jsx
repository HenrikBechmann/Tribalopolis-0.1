// services.tsx
/*
    This is the high level application controller
    It's main responsibility is to co-ordinate the store and the domain
    application -> datamodel + viewmodel -> domain (gateway) -> firebase

    datamodel and viewmodel are both bypassed
*/
// import Datamodel from './datamodel'
import domain from './domain';
const getScheme = (dataref) => {
    return domain.getScheme(dataref);
};
const getType = (dataref) => {
    return domain.getType(dataref);
};
const getItem = (dataref) => {
    return domain.getItem(dataref);
};
const getList = (dataref) => {
    return domain.getList(dataref);
};
const getLink = (dataref) => {
    return domain.getLink(dataref);
};
const getFolder = (dataref) => {
    return domain.getFolder(dataref);
};
const getAccount = (dataref) => {
    return domain.getAccount(dataref);
};
let application = {
    getItem,
    getList,
    getType,
    getLink,
    getScheme,
    getFolder,
    getAccount,
};
export default application;
//# sourceMappingURL=application.jsx.map