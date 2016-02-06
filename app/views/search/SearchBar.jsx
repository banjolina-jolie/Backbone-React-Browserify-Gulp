var React = require('react/addons');

var SearchBar = React.createClass({

	mixins: [React.addons.LinkedStateMixin],

	getInitialState() {
		return {
			address: ''  ,
			autocomplete: window.google ? new google.maps.places.Autocomplete(document.getElementById('autocomplete'),{types: ['geocode']}) : null
		};
	},

	componentDidMount() {
		var self = this;
	    if (window.google) {
			this.setState({ autocomplete: new google.maps.places.Autocomplete(document.getElementById('autocomplete'),{types: ['geocode']}) });
	    } else {
	    	$(window).on('googleapis:loaded', function () {
	    		var autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'),{types: ['geocode']});
	    		self.setState({ autocomplete: autocomplete });
	    	});
	    }
	},

	render: function () {
		return (
			<div className="search-bar">
				<input id="autocomplete" onKeyPress={this.checkEnter} onFocus={this.geolocate} className="address search ma" valueLink={this.linkState('address')} placeholder="Where are you interested?"/>
				<button onClick={this.submitAddress}>Search</button>
			</div>
		);
	},
	checkEnter: function (e) {
    	if (e && e.which === 13) {
    		this.submitAddress();
    	}
    },
    submitAddress: function () {
    	// TODO: look at this.state.autocomplete to store lat/lon
    	console.log($('#autocomplete').val());
    },
    geolocate: function () {
    	var self = this;
	 	if (navigator.geolocation && this.state.autocomplete) {
		    navigator.geolocation.getCurrentPosition(function(position) {
		      	var geolocation = {
		        	lat: position.coords.latitude,
		        	lng: position.coords.longitude
		      	};
		      	var circle = new google.maps.Circle({
		        	center: geolocation,
		        	radius: position.coords.accuracy
		      	});
		      	self.state.autocomplete.setBounds(circle.getBounds());
		    });
	  	}
	}
});

module.exports = SearchBar;
