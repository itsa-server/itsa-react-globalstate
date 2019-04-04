const utils = require('./utils');

const generateGlobalState = function() {
    let value = {},
        subPropertyObjects = {},
        stateInitialized = false;

    const GlobalState = function() {
        Object.defineProperty(this, 'state', {
            get: function() {
                let returnValue = {};
                utils.clone(value, returnValue);
                return returnValue;
            }
        });
    };

    GlobalState.prototype.onChange = function(callBack) {
        this.onChangedCallback = callBack;
    };

    GlobalState.prototype.setInitialState = function(initialState, force) {
        if ((stateInitialized && !force) || !utils.isObject(initialState)) {
            return;
        }
        if (stateInitialized) {
            // will be forced initialized
            value = {};
            subPropertyObjects = {};
        }
        stateInitialized = true;
        utils.clone(initialState, value);
    };

    GlobalState.prototype.clearState = function() {
        const wilBeChanged = (Object.keys(value).length>0);
        stateInitialized = true;
        value = {};
        subPropertyObjects = {};
        if (wilBeChanged && (typeof this.onChangedCallback==='function')) {
            this.onChangedCallback();
        }
    };

    GlobalState.prototype.defineState = function(newState, callBack) {
        let containerProps = {},
            returnValue, wilBeChanged, callBackIsFn,
            newStateIsFn = (typeof newState==='function');
        if (!utils.isObject(newState) && !newStateIsFn) {
            console.warn('globalstate.defineState can only be set with an Object or Function');
            return;
        }
        if (newStateIsFn) {
            newState = newState(this.state, containerProps);
            // newState may not be undefined
        }
        stateInitialized = true;
        wilBeChanged = utils.checkPropertyDif(value, newState);
        if (wilBeChanged) {
            value = {};
            subPropertyObjects = {};
            return this.setState(newState, callBack);
        }
        returnValue = {};
        utils.clone(value, returnValue);
        callBackIsFn = (typeof callBack==='function');
        callBackIsFn && callBack(returnValue);
        return Promise.resolve(returnValue);
    };

    GlobalState.prototype.setState = function(newState, callBack) {
        let containerProps = {},
            newStateIsFn = (typeof newState==='function'),
            returnValue, changed, cbFn, callBackIsFn;

        if (!utils.isObject(newState) && !newStateIsFn) {
            console.warn('globalstate.setState can only be set with an Object or Function');
            return;
        }
        if (newStateIsFn) {
            newState = newState(this.state, containerProps);
            // newState may not be undefined
        }
        if (!utils.isObject(newState)) {
            return Promise.reject('defining a state can only be done by a true Object');
        }
        stateInitialized = true;

        cbFn = (typeof this.onChangedCallback==='function');
        if (cbFn) {
            changed = utils.checkPropertyDif(value, newState);
        }

        if (!cbFn || changed) {
            // for all members: if they are `objects` and don't exist in the current state:
            // define a getter on them before merging:
            Object.keys(newState).forEach(newKey => {
                if (!utils.isObject(value[newKey]) && utils.isObject(newState[newKey])) {
                    generateSubProperty(this, subPropertyObjects, value, newKey);
                }
                if (utils.isObject(newState[newKey])) {
                    subPropertyObjects[newKey].defineState(newState[newKey]);
                }
                else {
                    value[newKey] = newState[newKey];
                    delete subPropertyObjects[newKey];
                }
            });
            changed && this.onChangedCallback();
        }
        returnValue = {};
        utils.clone(value, returnValue);
        callBackIsFn = (typeof callBack==='function');
        callBackIsFn && callBack(returnValue);
        return Promise.resolve(returnValue);
    };

    GlobalState.prototype.getSubState = function(env) {
        if (!env) {
            return;
        }
        if (!value[env]) {
            generateSubProperty(this, subPropertyObjects, value, env);
        }
        return subPropertyObjects[env];
    };

    return new GlobalState();
};

const generateSubProperty = function(parentinstance, subPropertyObjects, globalStateValue, property) {
    let value = {},
        stateInitialized = false;

    const SubProperty = function() {
        Object.defineProperty(globalStateValue, property, {
            get: function() {
                let returnValue = {};
                utils.clone(value, returnValue);
                return returnValue;
            }
        });
        Object.defineProperty(this, 'state', {
            get: function() {
                let returnValue = {};
                utils.clone(value, returnValue);
                return returnValue;
            }
        });
    };

    SubProperty.prototype.onChange = function(callBack) {
        this.onChangedCallback = callBack;
    };

    SubProperty.prototype.clearState = function() {
        const wilBeChanged = (Object.keys(value).length>0);
        stateInitialized = true;
        value = {};
        if (wilBeChanged) {
            (typeof this.onChangedCallback==='function') && this.onChangedCallback();
            (typeof parentinstance.onChangedCallback==='function') && parentinstance.onChangedCallback();
        }
    };

    SubProperty.prototype.setInitialState = function(initialState, force) {
        if ((stateInitialized && !force) || !utils.isObject(initialState)) {
            return;
        }
        if (stateInitialized) {
            // will be forced initialized
            value = {};
        }
        stateInitialized = true;
        utils.clone(initialState, value);
    };

    SubProperty.prototype.defineState = function(newState, callBack) {
        let containerProps = {},
            newStateIsFn = (typeof newState==='function'),
            changed, callBackIsFn, parentOnChangedCb, onChangedCb;
        if (!utils.isObject(newState) && !newStateIsFn) {
            console.warn('substate.defineState can only be set with an Object or Function');
            return;
        }
        if (newStateIsFn) {
            newState = newState(parentinstance.state[property], containerProps);
            // newState may not be undefined
        }
        if (!utils.isObject(newState)) {
            return Promise.reject('defining a state can only be done by a true Object');
        }
        stateInitialized = true;
        parentOnChangedCb = (typeof parentinstance.onChangedCallback==='function');
        onChangedCb = (typeof this.onChangedCallback==='function');
        if (parentOnChangedCb || onChangedCb) {
            changed = utils.checkPropertyDif(value, newState);
            if (changed) {
                value = {};
                utils.clone(newState, value);
                onChangedCb && this.onChangedCallback();
                parentOnChangedCb && parentinstance.onChangedCallback();
            }
        }
        else {
            value = {};
            utils.clone(newState, value);
        }
        callBackIsFn = (typeof callBack==='function');
        callBackIsFn && callBack(parentinstance.state[property]);
        return Promise.resolve(parentinstance.state[property]);
    };

    SubProperty.prototype.setState = function(newState, callBack) {
        let containerProps = {},
            newStateIsFn = (typeof newState==='function'),
            changed, callBackIsFn;
        if (!utils.isObject(newState) && !newStateIsFn) {
            console.warn('substate.setState can only be set with an Object or Function');
            return;
        }
        if (newStateIsFn) {
            newState = newState(parentinstance.state[property], containerProps);
            // newState may not be undefined
        }
        if (!utils.isObject(newState)) {
            return Promise.reject('defining a state can only be done by a true Object');
        }
        if ((typeof parentinstance.onChangedCallback==='function') || (typeof this.onChangedCallback==='function')) {
            changed = utils.checkPropertyDif(value, newState);
            if (changed) {
                utils.merge(newState, value, true);
                this.onChangedCallback && this.onChangedCallback();
                parentinstance.onChangedCallback && parentinstance.onChangedCallback();
            }
        }
        else {
            utils.merge(newState, value, true);
        }
        callBackIsFn = (typeof callBack==='function');
        callBackIsFn && callBack(parentinstance.state[property]);
        return Promise.resolve(parentinstance.state[property]);
    };

    subPropertyObjects[property] = new SubProperty();
};

const globalstate = generateGlobalState();

module.exports = globalstate;
