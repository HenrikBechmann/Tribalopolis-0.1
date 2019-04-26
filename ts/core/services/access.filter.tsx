// access.filter.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

const accessfilter = new class {
    public canaccess = (action, document, member, userdata) => {
        return true
    }
}

export default accessfilter