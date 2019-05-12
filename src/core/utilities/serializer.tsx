// serializer.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

let serialnumber = 0

let serializer = {
    getid:() => {
        return serialnumber++
    }
}

export {serializer}