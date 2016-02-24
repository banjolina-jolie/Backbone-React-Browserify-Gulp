'use strict';

let React = require('react/addons');

let SearchBar = React.createClass({

	mixins: [React.addons.LinkedStateMixin],

	getInitialState() {
		return {
			address: ''  ,
			autocomplete: window.google ? new google.maps.places.Autocomplete(document.getElementById('autocomplete'),{types: ['geocode']}) : null
		};
	},

	componentDidMount() {
	    if (window.google) {
			this.setState({ autocomplete: new google.maps.places.Autocomplete(document.getElementById('autocomplete'),{types: ['geocode']}) });
	    } else {
	    	$(window).on('googleapis:loaded', _ => {
	    		let autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'),{types: ['geocode']});
	    		this.setState({ autocomplete: autocomplete });
	    	});
	    }
	},

	render() {
		return (
			<div className="search-bar">
				<input id="autocomplete" onKeyPress={this.checkEnter} onFocus={this.geolocate} className="address search ma" valueLink={this.linkState('address')} placeholder="Where are you interested?"/>
				<button onClick={this.submitAddress}>Search</button>
			</div>
		);
	},
	checkEnter(e) {
    	if (e && e.which === 13) {
    		this.submitAddress();
    	}
    },
    submitAddress() {
    	// TODO: look at this.state.autocomplete to store lat/lon
    	console.log($('#autocomplete').val());
    },
    geolocate() {
	 	if (navigator.geolocation && this.state.autocomplete) {
		    navigator.geolocation.getCurrentPosition(position => {
		      	let geolocation = {
		        	lat: position.coords.latitude,
		        	lng: position.coords.longitude
		      	};
		      	let circle = new google.maps.Circle({
		        	center: geolocation,
		        	radius: position.coords.accuracy
		      	});
		      	this.state.autocomplete.setBounds(circle.getBounds());
		    });
	  	}
	}
});

module.exports = SearchBar;
