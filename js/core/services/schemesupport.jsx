// schemesupport.class.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
import { DeepDiff } from 'deep-diff';
import merge from 'deepmerge';
const assertType = (document, type) => {
    console.log('asserType', document, type);
    let doc = merge({}, document);
    let { structure, defaults, constraints } = type.data.properties;
    let differences = getDiffs(document.data, structure);
    let upgrade = getUpgrade(document, differences, defaults, constraints);
    console.log('differences, upgrade', differences, upgrade);
    return {
        document: upgrade,
        changed: false,
    };
};
const getDiffs = (document, structure) => {
    let differences = DeepDiff.diff(document, structure);
    return differences;
};
const getUpgrade = (original, differences, defaults, constraints) => {
    let doc = original.data;
    return original;
};
const schemesupport = {
    assertType,
};
export default schemesupport;
//# sourceMappingURL=schemesupport.jsx.map