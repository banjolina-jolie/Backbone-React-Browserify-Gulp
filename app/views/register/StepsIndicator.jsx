var React = require('react/addons');

var Step = React.createClass({
	render: function () {
		var classes = this.props.total === 3 ? 'col-xs-4 step' : 'col-xs-3 step';
		classes += this.props.current ? ' current' : '';
		classes += this.props.done ? ' done' : '';

		return (
			<div className={classes}>
	            <div className="step-number">Step {this.props.step}</div>
	            <div className="progress">
	                <div className="progress-bar"></div>
	            </div>
	            <span className="step-dot"></span>
	        </div>
		);
	}
});


var StepsIndicatorView = React.createClass({

    render: function () {
    	var steps = [];

    	// start at step 1 (not 0)
        for (var i = 1; i <= this.props.totalSteps; i++) {
			var done = this.props.currentStep > i ? 'done' : null;
			var current = this.props.currentStep === i ? 'current' : null;
        	steps.push(<Step key={'step' + i} step={i} done={done} current={current} total={this.props.totalSteps} />);
        }
    	
    	return (
    		<section className="steps-indicators">
                <div className="container">
                    <div className="row">
	                    {steps}
                    </div>
                </div>
            </section>
    	);
    }

});

module.exports = StepsIndicatorView;
