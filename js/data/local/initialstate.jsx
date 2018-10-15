// initialstate.tsx
/*
    TODO: purge system of navitiles - old wordy tiles = maintiles
*/
'use strict';
// https://design.google.com/icons/
/* ================= theme details: ==================== */
// let budgetdata = {} // require('../../explorerprototypedata/2015budgetA.json')
import { createMuiTheme } from '@material-ui/core/styles';
import * as colors from '@material-ui/core/colors';
let theme = createMuiTheme({
    typography: {
        useNextVariants: true,
    },
});
// console.log('theme, colors', theme, colors)
// import database, {CurrencyDataset,ItemDataset} from '../addins/classes/databaseapi'
// fontFamily: "Roboto, sans-serif"
// palette: Object
// 	accent1Color: "#ff4081"
// 	accent2Color: "#f5f5f5"
// 	accent3Color: "#9e9e9e"
// 	alternateTextColor: "#ffffff"
// 	borderColor: "#e0e0e0"
// 	canvasColor: "#ffffff"
// 	clockCircleColor: "rgba(0,0,0,0.07)"
// 	disabledColor: "rgba(0,0,0,0.3)"
// 	pickerHeaderColor: "#00bcd4"
// 	primary1Color: "#00bcd4"
// 	primary2Color: "#0097a7"
// 	primary3Color: "#bdbdbd"
// 	textColor: "rgba(0, 0, 0, 0.87)"
// spacing: Object
// 	desktopDropDownMenuFontSize: 15
// 	desktopDropDownMenuItemHeight: 32
// 	desktopGutter: 24
// 	desktopGutterLess: 16
// 	desktopGutterMini: 8
// 	desktopGutterMore: 32
// 	desktopKeylineIncrement: 64
// 	desktopLeftNavMenuItemHeight: 48
// 	desktopSubheaderHeight: 48
// 	desktopToolbarHeight: 56
// 	iconSize: 24
/* ======================================== */
let appnavbar = {
    title: 'Tribalopolis v0.1.1',
    username: 'anonymous',
    accountoptions: [],
    menuoptions: [],
};
// let toolsnavbar = {
// }
// TODO: no longer needed with switch away from flipcards
// for more detail: https://www.npmjs.com/package/snifferjs
let system = {
    ischrome: /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)
};
var initialstate = {
    appnavbar,
    theme,
    colors,
    system,
};
export default initialstate;
//# sourceMappingURL=initialstate.jsx.map