/*global describe, it, before, after */

"use strict";

const React = require("react");
const ReactDOM = require("react-dom");
var ReactTestUtils = require("react-dom/test-utils");
const act = ReactTestUtils.act;
const chai = require("chai");
const expect = chai.expect;
const Component = require("../examples/component.jsx");
const Component1 = require("../examples/component1.jsx");
const Component2 = require("../examples/component2.jsx");
const globalstate = require("../index").globalstate;

describe("React Component", function () {
    let container, container2;

    before(function () {
        this.jsdom = require("jsdom-global")();
        globalstate.setInitialState({}, true);
    });

    after(function () {
        this.jsdom();
    });

    beforeEach(() => {
        globalstate.clearState();
      container = document.createElement('div');
      container2 = document.createElement('div');
      document.body.appendChild(container);
      document.body.appendChild(container2);
    });

    afterEach(() => {
      document.body.removeChild(container);
      document.body.removeChild(container2);
      container = null;
      container2 = null;
    });

    it("should change the global state and reflected into the dom", function () {
        act(() => {
            ReactDOM.render(<Component />, container);
        });
        const button = container.querySelector('button');
        const span = container.querySelector('span');

        act(() => {
            button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
        });

        expect(globalstate.state).to.be.eql({status: 'Changed!'});
        expect(span.textContent).to.be.eql('Changed!');
    });

    it("should change a substate and reflected into the dom", function () {
        act(() => {
            ReactDOM.render(<Component1/>, container);
        });
        const button = container.querySelector('button');
        const span = container.querySelector('span');

        act(() => {
            button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
        });
        expect(globalstate.state).to.be.eql({sub1: {status: 'Changed!'}});
        expect(globalstate.getSubState('sub1').state).to.be.eql({status: 'Changed!'});
        expect(span.textContent).to.be.eql('Changed!');
    });

    it("should change a second substate, reflected into the dom and not interfere with first component", function () {
        act(() => {
            ReactDOM.render(<Component1 />, container);
        });
        act(() => {
            ReactDOM.render(<Component2 />, container2);
        });
        const button = container.querySelector('button');
        const span = container.querySelector('span');
        const span2 = container2.querySelector('span');

        act(() => {
            button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
        });

        expect(globalstate.state).to.be.eql({sub1: {status: 'Changed!'}, sub2: {status: 'Original'}});
        expect(span.textContent).to.be.eql('Changed!');
        expect(span2.textContent).to.be.eql('Original');
    });
});
