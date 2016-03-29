'use strict';

let Store = require('../stores/Store');
let React = require('react/addons');
let Actions = require('../actions/Actions');


let AppBaseView = React.createClass({
    _getState() {
        return {
            loading: false,
            view: Store.getView().view,
            viewData: Store.getView().data
        };
    },

    getInitialState() {
        return this._getState();
    },

    componentDidMount() {
        Store.addUIChangeListener(this._onUIChange);
        Store.addSetLoadingListener(this._updateLoading);
    },

    componentWillUnmount() {
        Store.removeUIChangeListener(this._onUIChange);
        Store.removeLoadingListener(this._updateLoading);
    },

    render() {
        let classes = 'spinner';
        let divStyle = { height: 0 };

        if (this.state.loading) {
            classes += ' loading';
            divStyle.height = $(window).height() + 'px';
        }

        return (
            <div>
                <div className={classes} style={divStyle}></div>
                <div className="triangle-bg"></div>
                <div id="content"></div>
            </div>
        );
    },

    _onUIChange() {
        this.setState(this._getState(), _ => {
            if (this.state.view) {
                React.render(React.createElement(this.state.view, this.state.viewData), document.getElementById('content'));
            }
        });
    },

    _updateLoading() {
        this.setState({loading: Store.getLoading()});
    }

});

module.exports = AppBaseView;
