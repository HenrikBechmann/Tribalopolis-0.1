// utilities.tsx
const getJsonFile = (spec) => {
    let promise = new Promise((resolve, error) => {
        fetch(spec).then((jsondata) => {
            return jsondata.json();
        }).then((json) => {
            resolve(json);
        }).catch((reason) => {
            error(reason);
        });
    });
    return promise;
};
export { getJsonFile };
//# sourceMappingURL=utilities.jsx.map