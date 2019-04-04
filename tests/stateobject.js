/*global describe, it, before, after, beforeEach, afterEach */

const globalstate = require("../index").globalstate;
const chai = require("chai");
const expect = chai.expect;

describe("Testing global state initially", function() {
    before(function () {
        this.jsdom = require("jsdom-global")();
    });

    after(function () {
        this.jsdom();
    });

    it("global state should be able to be set initially", function () {
        globalstate.setInitialState({a: 33}, true);
        expect(globalstate.state).be.eql({a: 33});
    });

    it("initially global state can only be set once", function () {
        globalstate.setInitialState({a: 44, b: true});
        expect(globalstate.state).be.eql({a: 33});
    });

    it("initially global state can not be set once the state is changed", function () {
        globalstate.setState({c: 'new value'});
        globalstate.setInitialState({a: 44, b: true});
        expect(globalstate.state).be.eql({a: 33, c: 'new value'});
    });
});

describe("Testing substate initially", function() {
    before(function () {
        this.jsdom = require("jsdom-global")();
        globalstate.clearState();
    });

    after(function () {
        this.jsdom();
    });

    it("substate should be able to be set initially", function () {
        const substate = globalstate.getSubState('menu');
        substate.setInitialState({a: 33}, true);
        expect(substate.state).be.eql({a: 33});
        expect(globalstate.state).be.eql({menu: {a: 33}});
    });

    it("initially substate can only be set once", function () {
        const substate = globalstate.getSubState('menu');
        substate.setInitialState({a: 44, b: true});
        expect(substate.state).be.eql({a: 33});
        expect(globalstate.state).be.eql({menu: {a: 33}});
    });

    it("initially substate can not be set once the state is changed", function () {
        const substate = globalstate.getSubState('menu');
        substate.setState({c: 'new value'});
        substate.setInitialState({a: 44, b: true});
        expect(substate.state).be.eql({a: 33, c: 'new value'});
        expect(globalstate.state).be.eql({menu: {a: 33, c: 'new value'}});
    });

    it("second substate be able to be set initially", function () {
        const substate = globalstate.getSubState('menu2');
        substate.setInitialState({a: 66}, true);
        expect(substate.state).be.eql({a: 66});
        expect(globalstate.state).be.eql({menu: {a: 33, c: 'new value'}, menu2: {a: 66}});
    });

    it("second initially substate can only be set once", function () {
        const substate = globalstate.getSubState('menu2');
        substate.setInitialState({a: 44, b: true});
        expect(substate.state).be.eql({a: 66});
        expect(globalstate.state).be.eql({menu: {a: 33, c: 'new value'}, menu2: {a: 66}});
    });

    it("isecond nitially substate can not be set once the state is changed", function () {
        const substate = globalstate.getSubState('menu2');
        substate.setState({c: 'new value2'});
        substate.setInitialState({a: 44, b: true});
        expect(substate.state).be.eql({a: 66, c: 'new value2'});
        expect(globalstate.state).be.eql({menu: {a: 33, c: 'new value'}, menu2: {a: 66, c: 'new value2'}});
    });
});

describe("Testing global state", function () {
    const dateNow = new Date();

    before(function () {
        this.jsdom = require("jsdom-global")();
    });

    after(function () {
        this.jsdom();
    });

    // Code to execute before every test.
    beforeEach(function() {
        globalstate.clearState();
    });

    it("initial global state should be empty", function () {
        expect(globalstate.state).be.eql({});
    });

    it("global state should get a value", function () {
        globalstate.setState({a: 10});
        expect(globalstate.state).be.eql({a: 10});
    });

    it("global state should be able to clear", function () {
        globalstate.setState({a: 10});
        expect(globalstate.state).be.eql({a: 10});
        globalstate.clearState();
        expect(globalstate.state).be.eql({});
    });

    it("global state should get multiple types of values", function () {
        globalstate.setState({
            a: 15,
            b: true,
            c: {c1: 5, c2: false, c3: {c31: 9}, c4: [4, 5], c5: new Date(dateNow)},
            d: [1, 2, 3],
            e: new Date(dateNow)
        });
        expect(globalstate.state).be.eql({
            a: 15,
            b: true,
            c: {c1: 5, c2: false, c3: {c31: 9}, c4: [4, 5], c5: new Date(dateNow)},
            d: [1, 2, 3],
            e: new Date(dateNow)
        });
    });

    it("global state should be able to be overruled by defineState", function () {
        globalstate.setState({
            a: 15,
            b: true,
            c: {c1: 5, c2: false, c3: {c31: 9}, c4: [4, 5], c5: new Date(dateNow)},
            d: [1, 2, 3],
            e: new Date(dateNow)
        });
        globalstate.defineState({
            b: false,
            f: [4, 5]
        });
        expect(globalstate.state).be.eql({
            b: false,
            f: [4, 5]
        });
    });

    it("global state completely replace main properties that are being set", function () {
        globalstate.setState({
            a: {c1: 5, c2: 10}
        });
        expect(globalstate.state).be.eql({
            a: {c1: 5, c2: 10}
        });
        globalstate.setState({
            a: {c1: 20}
        });
        expect(globalstate.state).be.eql({
            a: {c1: 20}
        });
    });

    it("global state should not be set through setter", function () {
        let errored = false;
        globalstate.setState({
            a: 2
        });
        expect(globalstate.state).be.eql({
            a: 2
        });
        try {
            globalstate.state = {b: 1};
        }
        catch (err) {
            errored = true;
        }
        expect(globalstate.state).be.eql({
            a: 2
        });
        expect(errored).be.true;
    });

    it("global state should not return a shallow object", function () {
        let a, b, c, d, e;
        globalstate.setState({
            x: 15,
            y: {y1: 5}
        });
        a = globalstate.state;
        b = globalstate.state;
        c = globalstate.state;
        d = globalstate.state;
        e = globalstate.state;
        b.x = 25;
        c.y = {y1: 10}
        d.y.y1 = 50;
        expect(a).be.eql(e);
        expect(a).not.be.eql(b);
        expect(a).not.be.eql(c);
        expect(a).not.be.eql(d);
        expect(b).not.be.eql(c);
        expect(b).not.be.eql(d);
        expect(c).not.be.eql(d);
    });

    it("global setState should call its callback with a non shallow new state", function () {
        globalstate.setState({
            a: {b: 5}
        }, state => {
            expect(state).be.eql({
                a: {b: 5}
            });
            state.a.b = 8;
            expect(state).be.eql({
                a: {b: 8}
            });
            expect(globalstate.state).be.eql({
                a: {b: 5}
            });
        });
    });

    it("global state should return a promise with a non shallow new state", function (done) {
        let statePromise = globalstate.setState({
            a: {b: 5}
        });
        statePromise.then(state => {
            expect(state).be.eql({
                a: {b: 5}
            });
            state.a.b = 8;
            expect(state).be.eql({
                a: {b: 8}
            });
            expect(globalstate.state).be.eql({
                a: {b: 5}
            });
            done();
        }, done);
    });

    it("global state should trigger onChange when global state is changed", function () {
        let changed = false;
        globalstate.onChange(function() {
            changed = true;
        });
        globalstate.setState({a: 10});
        expect(changed).be.true;
    });

    it("global state should not trigger onChange when global state is not changed", function () {
        let changed = false;
        globalstate.setState({a: 10});
        globalstate.onChange(function() {
            changed = true;
        });
        globalstate.setState({a: 10});
        expect(changed).be.false;
    });

    it("clearing global state should trigger onChange when the global state had a value", function () {
        let changed = false;
        globalstate.setState({a: 10});
        globalstate.onChange(function() {
            changed = true;
        });
        globalstate.clearState();
        expect(changed).be.true;
    });

    it("clearing global state should not trigger onChange when the global state had no value", function () {
        let changed = false;
        globalstate.onChange(function() {
            changed = true;
        });
        globalstate.clearState();
        expect(changed).be.false;
    });

    it("should be able to be set global state with a function as first argument", function () {
        globalstate.setState((state, props) => {
            return {a: 10};
        });
        expect(globalstate.state).be.eql({a: 10});
    });

    it("should return current state when set global state with a function as first argument", function () {
        globalstate.setState({a: 10});
        globalstate.setState((state, props) => {
            expect(state).be.eql({a: 10});
            return {b: 15};
        });
        expect(globalstate.state).be.eql({a: 10, b: 15});
    });
});

describe("Testing substate", function () {
    const dateNow = new Date();

    // Code to execute before every test.
    beforeEach(function() {
        globalstate.clearState();
    });

    it("getSubstate without argument should be undefined", function () {
        globalstate.setState({
            name: 'module',
            menu: {opened: true}
        });
        expect(globalstate.getSubState()).be.undefined;
    });

    it("substate should get the proper value", function () {
        globalstate.setState({
            name: 'module',
            menu: {opened: true}
        });
        expect(globalstate.getSubState('menu').state).be.eql({
            opened: true
        });
    });

    it("substate should be available when defined upfront", function () {
        const menuState = globalstate.getSubState('menu');
        globalstate.setState({
            name: 'module',
            menu: {opened: true}
        });
        expect(menuState.state).be.eql({
            opened: true
        });
    });

    it("substate should be able to clear", function () {
        const menuState = globalstate.getSubState('menu');
        globalstate.setState({
            name: 'module',
            menu: {opened: true}
        });
        menuState.clearState();
        expect(menuState.state).be.eql({});
        expect(globalstate.state).be.eql({name: 'module', menu: {}});
    });

    it("substate should clear only its own substate", function () {
        const menuState = globalstate.getSubState('menu1');
        globalstate.setState({
            name: 'module',
            menu1: {opened: false},
            menu2: {opened: true}
        });
        menuState.clearState();
        expect(menuState.state).be.eql({});
        expect(globalstate.state).be.eql({name: 'module', menu1: {}, menu2: {opened: true}});
    });

    it("substate should get multiple types of values", function () {
        const menuState = globalstate.getSubState('menu');
        menuState.setState({
            a: 15,
            b: true,
            c: {c1: 5, c2: false, c3: {c31: 9}, c4: [4, 5], c5: new Date(dateNow)},
            d: [1, 2, 3],
            e: new Date(dateNow)
        });
        expect(menuState.state).be.eql({
            a: 15,
            b: true,
            c: {c1: 5, c2: false, c3: {c31: 9}, c4: [4, 5], c5: new Date(dateNow)},
            d: [1, 2, 3],
            e: new Date(dateNow)
        });
        expect(globalstate.state).be.eql({
            menu: {
                a: 15,
                b: true,
                c: {c1: 5, c2: false, c3: {c31: 9}, c4: [4, 5], c5: new Date(dateNow)},
                d: [1, 2, 3],
                e: new Date(dateNow)
            }
        });
    });

    it("substate completely replace main properties that are being set", function () {
        const menuState = globalstate.getSubState('menu');
        menuState.setState({
            a: {c1: 5, c2: 10}
        });
        expect(menuState.state).be.eql({
            a: {c1: 5, c2: 10}
        });
        menuState.setState({
            a: {c1: 20}
        });
        expect(menuState.state).be.eql({
            a: {c1: 20}
        });
    });

    it("substate should not be set through setter", function () {
        const menuState = globalstate.getSubState('menu');
        let errored = false;
        menuState.setState({
            a: 2
        });
        expect(menuState.state).be.eql({
            a: 2
        });
        try {
            menuState.state = {b: 1};
        }
        catch (err) {
            errored = true;
        }
        expect(menuState.state).be.eql({
            a: 2
        });
        expect(errored).be.true;
    });

    it("substate should not return a shallow object", function () {
        const menuState = globalstate.getSubState('menu');
        let a, b, c, d, e;
        menuState.setState({
            x: 15,
            y: {y1: 5}
        });
        a = menuState.state;
        b = menuState.state;
        c = menuState.state;
        d = menuState.state;
        e = menuState.state;
        b.x = 25;
        c.y = {y1: 10}
        d.y.y1 = 50;
        expect(a).be.eql(e);
        expect(a).not.be.eql(b);
        expect(a).not.be.eql(c);
        expect(a).not.be.eql(d);
        expect(b).not.be.eql(c);
        expect(b).not.be.eql(d);
        expect(c).not.be.eql(d);
    });

    it("substate.setState should call its callback with a non shallow new state", function () {
        const menuState = globalstate.getSubState('menu');
        menuState.setState({
            a: {b: 5}
        }, state => {
            expect(state).be.eql({
                a: {b: 5}
            });
            state.a.b = 8;
            expect(state).be.eql({
                a: {b: 8}
            });
            expect(menuState.state).be.eql({
                a: {b: 5}
            });
        });
    });

    it("substate should return a promise with a non shallow new state", function (done) {
        const menuState = globalstate.getSubState('menu');
        let statePromise = menuState.setState({
            a: {b: 5}
        });
        statePromise.then(state => {
            expect(state).be.eql({
                a: {b: 5}
            });
            state.a.b = 8;
            expect(state).be.eql({
                a: {b: 8}
            });
            expect(menuState.state).be.eql({
                a: {b: 5}
            });
            done();
        }, done);
    });

    it("global state should trigger onChange when global state is changed", function () {
        const menuState = globalstate.getSubState('menu');
        let changed = false;
        globalstate.onChange(function() {
            changed = true;
        });
        menuState.setState({a: 10});
        expect(changed).be.true;
    });

    it("global state should not trigger onChange when global state is not changed", function () {
        const menuState = globalstate.getSubState('menu');
        let changed = false;
        menuState.setState({a: 10});
        globalstate.onChange(function() {
            changed = true;
        });
        menuState.setState({a: 10});
        expect(changed).be.false;
    });

    it("clearing substate should trigger onChange when the substate had a value", function () {
        const menuState = globalstate.getSubState('menu');
        let changed = false;
        menuState.setState({a: 10});
        globalstate.onChange(function() {
            changed = true;
        });
        menuState.clearState();
        expect(changed).be.true;
    });

    it("clearing global state should not trigger onChange when the global state had no value", function () {
        const menuState = globalstate.getSubState('menu');
        let changed = false;
        globalstate.onChange(function() {
            changed = true;
        });
        menuState.clearState();
        expect(changed).be.false;
    });

    it("should be able to be set substate with a function as first argument", function () {
        const menuState = globalstate.getSubState('menu');
        menuState.setState((state, props) => {
            return {a: 10};
        });
        expect(menuState.state).be.eql({a: 10});
    });

    it("should return current state when set substate with a function as first argument", function () {
        const menuState = globalstate.getSubState('menu');
        menuState.setState({a: 10});
        menuState.setState((state, props) => {
            expect(state).be.eql({a: 10});
            return {b: 15};
        });
        expect(menuState.state).be.eql({a: 10, b: 15});
    });

    it("substate should be able to be overruled by defineState", function () {
        const menuState = globalstate.getSubState('menu');
        menuState.setState({
            a: 15,
            b: true,
            c: {c1: 5, c2: false, c3: {c31: 9}, c4: [4, 5], c5: new Date(dateNow)},
            d: [1, 2, 3],
            e: new Date(dateNow)
        });
        menuState.defineState({
            b: false,
            f: [4, 5]
        });
        expect(menuState.state).be.eql({
            b: false,
            f: [4, 5]
        });
    });

    it("substate.defineState should not mess other global params", function () {
        const menuState = globalstate.getSubState('menu');
        globalstate.setState({
            x: 15,
            y: {y1: 15, y2: {y21: 99}}
        });
        menuState.setState({
            a: 15,
            b: true,
            c: {c1: 5, c2: false, c3: {c31: 9}, c4: [4, 5], c5: new Date(dateNow)},
            d: [1, 2, 3],
            e: new Date(dateNow)
        });
        menuState.defineState({
            b: false,
            f: [4, 5]
        });
        expect(menuState.state).be.eql({
            b: false,
            f: [4, 5]
        });
        expect(globalstate.state).be.eql({
            x: 15,
            y: {y1: 15, y2: {y21: 99}},
            menu: {
                b: false,
                f: [4, 5]
            }
        });
    });

});
