// serializer.tsx

let serialnumber = 0

let serializer = {
    getid:() => {
        return serialnumber++
    }
}

export {serializer}