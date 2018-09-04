// services.tsx
/*
    This is the high level application controller
    It's main responsibility is to co-ordinate the store and the domain
*/
import { schemes, types, items, lists, links, folders } from '../../data/repositories';
const getItem = (dataref) => {
    return items[dataref.uid];
};
const getList = (dataref) => {
    return lists[dataref.uid];
};
// TODO: should always return an object
const getType = (dataref) => {
    return types[dataref.uid];
};
const getLink = (dataref) => {
    return links[dataref.uid];
};
const getScheme = (dataref) => {
    return schemes[dataref.uid];
};
const getFolder = (dataref) => {
    return folders[dataref.uid];
};
let application = {
    getItem,
    getList,
    getType,
    getLink,
    getScheme,
    getFolder,
};
export default application;
//# sourceMappingURL=application.jsx.map