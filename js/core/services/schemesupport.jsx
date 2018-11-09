// schemesupport.class.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
import { DeepDiff } from 'deep-diff';
import merge from 'deepmerge';
// TODO: test current document version of type against type version
const assertType = (docpack, typepack) => {
    console.log('assertType', docpack, typepack);
    let localdocpack = merge({}, docpack);
    let { structure, defaults, constraints } = typepack.data.properties;
    console.log('structure, defaults, contraints', structure, defaults, constraints, localdocpack);
    let differences = getDiffs(localdocpack.data, structure);
    let upgradedoc = getUpgrade(localdocpack.data, differences, defaults, constraints);
    console.log('differences, upgrade', differences, upgradedoc);
    return {
        document: upgradedoc,
        changed: true,
    };
};
const getDiffs = (document, structure) => {
    let differences = DeepDiff.diff(document, structure);
    return differences;
};
const getUpgrade = (original, differences, defaults, constraints) => {
    return original;
};
const schemesupport = {
    assertType,
};
export default schemesupport;
//# sourceMappingURL=schemesupport.jsx.map