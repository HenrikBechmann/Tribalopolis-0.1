// reducers.tsx
'use strict';
import { combineReducers } from 'redux';
import { isFSA } from 'flux-standard-action';
import { reducer as toastrReducer } from 'react-redux-toastr';
// -------------[ app resources ]---------------
// import * as Actions from '../actions/actions'
// import initialstate from "../../local/initialstate"
// // ----------[ app settings ]----------------------
// import explorer from '../../addins/explorer/reducers'
let spaces = (state = null, actions) => {
    return state;
};
let mainReducerCore = combineReducers({
    spaces,
    toastr: toastrReducer,
});
let mainReducer = (state, action) => {
    if (!isFSA(action)) {
        console.error('System Error: non-FSA action', action);
        throw 'non-FSA action, see console for details';
    }
    else {
        return mainReducerCore(state, action);
    }
};
export default mainReducer;
//# sourceMappingURL=reducers.jsx.map