"use strict";
const connect = require('../lib/connector'),
    globalState = require('../lib/globalstate');
/**
 * Description here
 *
 *
 *
 * <i>Copyright (c) 2016 ItsAsbreuk - http://itsasbreuk.nl</i><br>
 * New BSD License - http://choosealicense.com/licenses/bsd-3-clause/
 *
 *
 * @module component.jsx
 * @class Component
 * @since 15.0.0
*/

const React = require("react"),
    PropTypes = require("prop-types");

class Component extends React.Component {
    setStatus() {
        globalState.getSubState('sub2').setState({status: 'Changed!'});
    }
    /**
     * React render-method --> renderes the Component.
     *
     * @method render
     * @return ReactComponent
     * @since 15.0.0
     */
    render() {
        return (
            <div>
                {this.props.desc} <span ref={node => this.spanNode=node}>{this.props.globalstate.status}</span>
                <br />
                <button className="changebutton" onClick={this.setStatus} ref={node => this.buttonNode=node}>click me</button>
            </div>
        );
    }

}

Component.propTypes = {
    /**
     * The Component its children
     *
     * @property children
     * @type String || Object || Array
     * @since 15.0.0
    */

    children: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array])
};

module.exports = connect(Component, 'sub2', {status: 'Original'});
