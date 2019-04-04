[![Build Status](https://api.travis-ci.com/itsa-server/itsa-react-globalstate.svg?branch=master)](https://travis-ci.com/itsa-server/itsa-react-globalstate)

Very easy to use, global state manager for React.

Lightweight, no dependencies, almost as easy as React its own `state`

## How to use:

### Prepare the container Component:

By using `connect()`, you need to modify the container Component.
This method returns the container Component, but with listeners to changes on the global state object:

The first argument to `connect` is the container Component. The second argument is optional and can be used to set the `initial state`.

#### Example connecting and define an initial global state:

const connect = require('./lib/connector'),
    globalstate = require('./lib/globalstate');

module.exports = {
    connect,
    globalstate
};

```js
const React = require("react"),
    reactGlobalState = require("itsa-react-globalstate"),
    connect = reactGlobalState.connect;

class Component extends React.Component {
    render() {
        return (
            <div>Hello World! This component has the global state but doesn not use it.</div>
        );
    }
}

module.exports = reactGlobalState.connect(Component, {message: "original"});
```

### Using the global state:

The global state will be available on the container Component as `this.props.globalstate`. If you want Child Components to make use of the global state, make sure to pass through this property. `this.props.globalstate` is an `Object`, just as `this.state`. You can use any of its members.

Changing the state can be done by using `reactGlobalState.globalstate.setState()`. Note that reactGlobalState.globalstate is an Object with utility methods that can be accessed everywehere (outside and inside Components), whereas `this.props.globalstate` is state itself that lives inside the connected Component.

#### Complete working example:
```js
const React = require("react"),
    reactGlobalState = require("itsa-react-globalstate"),
    connect = reactGlobalState.connect,
    globalstate = reactGlobalState.globalstate;

class Component extends React.Component {
    setStatus() {
        globalstate.setState({message: 'new'});
    }

    render() {
        return (
            <div>
                <div>Hello {this.props.globalstate.message} World!</div>
                <button onClick={this.setStatus}>click me</button>
            </div>
       );
    }
}

module.exports = reactGlobalState.connect(Component, {message: "original"});
```

The signature of `globalstate.setState` is the same as React is setState(): you can use a function as first argument as well and set a second argument as callback. Additional, `globalstate.setState` returns a Promise that resolves with the new global state.

### Automatically deep cloned separated state objects
Whenever `globalstate.setState()` is called, the object that is passed through will be completely deep cloned, leaving no references to the original object. The same is the case whenever you call `this.props.globalstate`. Which means that `this.props.globalstate` twice will give you two completely separated objects with no shared references.

This way unexpected changes, made outside the global state routine, is avoided. Disadvantage is that it is less performant, especially with large lists (arrays inside the global state). Therefore it is recomended to leave the global state as simple as possible: don't put anything in the global state that is not needed accross the whole web-app.

### Using sub states
Not only you can use the global state itself, but you can directly use `sub states` at its first level. Sub-states are just properties of globalstate, which are properties themselve. They can act as a statemanager on its own. However, they are always direct part of the global state object, meaning that whenever you change one, the other is also changed.

You can connect a substate with `reactGlobalState.connect(Component, 'substate_name', inititalSubState)`. This wil lead to the generation of the global state:
```js
this.props.globalstate //  => {substate_name: inititalSubState}
```

However, the Component that was connected will have a "local" global state `this.props.globalstate` that equals the substate, in this case: `inititalSubState`.

#### Complete working example sub state:
```js
const React = require("react"),
    reactGlobalState = require("itsa-react-globalstate"),
    connect = reactGlobalState.connect,
    subState = reactGlobalState.globalstate.getSubState('env');

class Component extends React.Component {
    setStatus() {
        subState.setState({status: "Changed!"});
        // or, you could also use:
        //
        // reactGlobalState.globalstate.setState({substate: {status: "Changed!"}});
    }

    render() {
        // Note: Inside this Component, `this.props.globalstate` equals `reactGlobalState.globalstate.state.substate`
        return (
            <div>
                <div>Hello {this.props.globalstate.message} World!</div>
                <button onClick={this.setStatus}>click me</button>
            </div>
        );
    }
}

module.exports = reactGlobalState.connect(Component, "env", {message: "original"});
```


### All members of reactGlobalState.globalstate:
`reactGlobalState.globalstate.state` -> a getter for the globalstate: this equals this.props.globalstate inside a Component
`reactGlobalState.globalstate.setInitialState(initialState, force)`
`reactGlobalState.globalstate.clearState()`
`reactGlobalState.globalstate.defineState(newState, callBack)`
`reactGlobalState.globalstate.setState(newState, callBack)`
`reactGlobalState.globalstate.getSubState(env)`

### All methods of reactGlobalState.globalstate.getSubState(env):
`reactGlobalState.globalstate.getSubState().state` -> a getter for a substate of globalstate: this equals this.props.globalstate inside a Component that is connected as a substate
`reactGlobalState.globalstate.getSubState().setInitialState(initialState, force)`
`reactGlobalState.globalstate.getSubState().clearState()`
`reactGlobalState.globalstate.getSubState().defineState(newState, callBack)`
`reactGlobalState.globalstate.getSubState().setState(newState, callBack)`

#### If you want to express your appreciation, you're free to make a small donation:

* Ether: 0xE096EBC2D19eaE7dA8745AA5D71d4830Ef3DF963
* Bitcoin: 37GgB6MrvuxyqkQnGjwxcn7vkcdont1Vmg
