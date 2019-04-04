const React = require("react"),
    globalState = require("./globalstate");

const _extends = Object.assign || function(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
            }
        }
    } return target;
};

const connect = (WrapComponent, subState, initialState) => {
    let useSubState, initialstate;
    if (typeof subState==='string') {
        useSubState = true;
        initialstate = initialState;
    }
    else {
        initialstate = subState;
    }
    class Component extends React.Component {
        constructor(props) {
            super(props);
            if (useSubState) {
                globalState.getSubState(subState).setInitialState(initialstate, true);
            }
            else {
                globalState.setInitialState(initialstate, true);
            }
        }

        componentDidMount() {
            if (useSubState) {
                globalState.getSubState(subState).onChange(this.forceUpdate.bind(this));
            }
            else {
                globalState.onChange(this.forceUpdate.bind(this));
            }
        }

        componentWillUnmount() {
            if (useSubState) {
                globalState.getSubState(subState).onChange(null);
            }
            else {
                globalState.onChange(null);
            }
        }

        componentDidUpdate(prevProps) {

        }

        render() {
            return React.createElement(WrapComponent, _extends({}, this.props, {
                globalstate: useSubState ? globalState.getSubState(subState).state : globalState.state
            }));
        }
    }
    return Component;
};

module.exports = connect;
