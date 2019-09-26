// forms.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'
import ContentTextField from './components/contenttextfield'
import ContentForm from './components/contentform'
import { styles as contentformstylesmethod } from './components/contentform'
// import ContentBox from './components/contentbox'

console.log('in forms.tsx:contentformstylesmethod',contentformstylesmethod)

const components = {
    ContentForm,
    ContentTextField,
}

const formstylesmethods = {
    ContentForm:contentformstylesmethod,
}

export { formstylesmethods }
export default components
