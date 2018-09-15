// services.tsx
/*
    This is the high level application controller
    It's main responsibility is to co-ordinate the store and the domain
    application -> datamodel + viewmodel -> domain (gateway) -> firebase

    datamodel and viewmodel are both bypassed
*/
// import Datamodel from './datamodel'
import domain from './domain';
const getScheme = (datatoken) => {
    return domain.getScheme(datatoken);
};
const getType = (datatoken) => {
    return domain.getType(datatoken);
};
const getItem = (datatoken) => {
    return domain.getItem(datatoken);
};
const getList = (datatoken) => {
    return domain.getList(datatoken);
};
const getLink = (datatoken) => {
    return domain.getLink(datatoken);
};
const getFolder = (datatoken) => {
    return domain.getFolder(datatoken);
};
const getAccount = (datatoken) => {
    return domain.getAccount(datatoken);
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