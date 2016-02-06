var React = require('react');
var UserModel = require('../../models/UserModel');

var RegisterVerifyView = React.createClass({
    render: function () {
    	return (
    		<div>
    			<section className="registration verify">
		            <div className="container">
		                <div className="row">
		                    <div className="col-xs-12">
		                        <h2 className="step-title">Almost Done!</h2>

		                        <p className="register-text">
		                            We have sent an email to {this.props.user.get('email')}. <br/> Please click on the link provided in it to verify your email address.
		                        </p>
		                    </div>
		                </div>
		            </div>
		        </section>

		        {/*<section className="registration congratulation">
		            <div className="container">
		                <div className="row">
		                    <div className="col-xs-12">
		                        <h2 className="step-title">Congratulations !</h2>

		                        <p className="register-text">
		                            Your account is complete. <br/> All accounts are reviewed by our personnel. We will contact you <br/> shortly to verify the authenticity of your account
		                        </p>
		                    </div>
		                </div>
		            </div>
		        </section>*/}
    		</div>
    	);
    },
    componentDidMount: function () {
    	// clear currentUser to prevent access to other pages
		this.props.user = new UserModel();
    }
});

module.exports = RegisterVerifyView;
