// utilities.tsx

// declare var fetch

const getJsonFile = (spec) => {
    let promise = new Promise((resolve, error) => {

        fetch(spec).then((jsondata) => {
            return jsondata.json()
        }).then((json)=> {
            resolve(json)
        }).catch((reason)=>{
            error(reason)
        })
    })
    return promise
}

const getNodePosition = (branch, path) => {

    let nodeproperty
    let nodeindex
    let nodevalue = branch

    for (nodeindex of path) {

        nodeproperty = nodevalue
        nodevalue = nodeproperty[nodeindex]

        if (nodevalue === undefined) return undefined// no doc node available

    } // yields comparandproperty and comparandindex of that property

    return {
        nodeproperty,
        nodeindex,
        nodevalue,
    }

}

const isObject = value => {
    return ((typeof value === 'object') && (value !== null))
}

export default {
    getJsonFile,
    getNodePosition,
    isObject,
}