var React = require('react/addons');
var Actions = require('../../actions/Actions');
var Store = require('../../stores/Store');

var PersonalBio = React.createClass({

    mixins: [React.addons.LinkedStateMixin],

    _getState: function () {
        return {
            bio: this.props.user.get('meta').bio
        };
    },
    _updateState: function () {
        this.setState(this._getState());
    },
    getInitialState: function () {
        return this._getState();
    },
    componentDidMount: function () {
        Store.addSaveProfileListener(this._onSaveProfile);
        Store.addSetCurrentUserListener(this._updateState);

        var avatar = document.getElementById('profile-img');
        this.props.user.profilePic(avatar);
        
        this.props.user.on('sync', function () {
            if (this.newUrl) {
                $('.avatar').css({'background-image': 'url("' + this.newUrl + '")'});
                this.newUrl = false;
            }
        }.bind(this));
    },
    componentDidUpdate: function() {
        var avatar = document.getElementById('profile-img');

        if (!this.newUrl) {
            this.props.user.profilePic(avatar);
        }
    },
    componentWillUnmount: function () {
        Store.removeSaveProfileListener(this._onSaveProfile);
        Store.removeSetCurrentUserListener(this._updateState);
        this.props.user.off();
    },
    render: function () {
        return (
            <div className="row">
                <div className="col-xs-12 text-center no-padding">
                    <form className="basic-form with-border">
                        <div className="form-group mb40">
                            <label>Select a profile icon:</label>
                            <div className="profile-icon clearfix">
                                <div id="profile-img" className="icon-preview"></div>
                                <input onChange={this.uploadImage} className="hidden" type="file"/>
                                <button onClick={this.clickFileInput} className="btn btn-default btn-outline btn-blue upload-icon">Browse...</button>
                            </div>
                        </div>

                        <div className="form-group bio-text-container">
                            <label htmlFor="short-bio">Add a short bio:</label>
                            <textarea onKeyUp={this.setEnabledButton} valueLink={this.linkState('bio')} id="short-bio" rows="10" className="form-control bio-input"></textarea>
                        </div>
                    </form>
                </div>
            </div>
        );
    },
    clickFileInput: function (e) {
        e.preventDefault();
        $('input[type=file]').trigger('click');
    },
    uploadImage: function (e) {
        var selectedFile = e.target.files[0];

        if (!selectedFile) { return; }

        if (selectedFile.type !== 'image/png' && selectedFile.type !== 'image/jpg' && selectedFile.type !== 'image/jpeg') {
            return Actions.okpAlert({body:'Valid file types are .png, .jpg, .jpeg'});
        }

        if (selectedFile.size > 2100000) {
            return Actions.okpAlert({body:'Size limit is 2MB'});
        }

        if (!FileReader) {
            return Actions.okpAlert({body:'This browser doesn\'t support picture upload'});
        }

        var reader = new FileReader();

        var imgtag = document.getElementById('profile-img');
        imgtag.title = selectedFile.name;

        reader.onload = function(ev) {
            this.newUrl = ev.target.result;
            imgtag.style.backgroundImage = 'url("' + ev.target.result + '")';

            this.convertImgToBase64URL(ev.target.result, function(base64Img){
                this.setState({profileIcon: base64Img});
                this.setEnabledButton();
            }.bind(this));
        }.bind(this);

        reader.readAsDataURL(selectedFile);

    },
    convertImgToBase64URL: function(url, callback, outputFormat) {
        var canvas = document.createElement('CANVAS'),
            ctx = canvas.getContext('2d'),
            img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function(){
            var dataURL;
            canvas.height = img.height;
            canvas.width = img.width;
            ctx.drawImage(img, 0, 0);
            dataURL = canvas.toDataURL(outputFormat);
            callback(dataURL);
            canvas = null;
        };
        img.src = url;
    },
    setEnabledButton: function () {
        Actions.setEnabledButton(!!(this.state.profileIcon || this.state.bio));
    },
    _onSaveProfile: function () {
        var meta = this.props.user.get('meta');
        meta.picture = this.state.profileIcon;
        meta.bio = this.state.bio;
        this.props.user.set({ meta: meta });
    }
});

module.exports = PersonalBio;
