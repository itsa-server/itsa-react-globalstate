"use strict";

const React = require("react"),
    ReactDOM = require("react-dom"),
    Component = require("./examples/component.jsx");

const props = {
    desc: 'Status'
};

ReactDOM.render(
    <Component {...props} />,
    document.getElementById("component-container")
);
