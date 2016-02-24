'use strict';

let React = require('react/addons');
let Actions = require('../../actions/Actions');
let Store = require('../../stores/Store');

let PersonalBio = React.createClass({

    mixins: [React.addons.LinkedStateMixin],

    _getState() {
        return {
            bio: this.props.user.get('bio')
        };
    },
    _updateState() {
        this.setState(this._getState());
    },
    getInitialState() {
        return this._getState();
    },
    componentDidMount() {
        Store.addSaveProfileListener(this._onSaveProfile);
        Store.addSetCurrentUserListener(this._updateState);

        let avatar = document.getElementById('profile-img');
        this.props.user.profilePic(avatar);

        this.props.user.on('sync', _ => {
            if (this.newUrl) {
                $('.avatar').css({'background-image': 'url("' + this.newUrl + '")'});
                this.newUrl = false;
            }
        });
    },
    componentDidUpdate() {
        let avatar = document.getElementById('profile-img');

        if (!this.newUrl) {
            this.props.user.profilePic(avatar);
        }
    },
    componentWillUnmount() {
        Store.removeSaveProfileListener(this._onSaveProfile);
        Store.removeSetCurrentUserListener(this._updateState);
        this.props.user.off();
    },
    render() {
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
    clickFileInput(e) {
        e.preventDefault();
        $('input[type=file]').trigger('click');
    },
    uploadImage(e) {
        let selectedFile = e.target.files[0];

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

        let reader = new FileReader();

        let imgtag = document.getElementById('profile-img');
        imgtag.title = selectedFile.name;

        reader.onload = function(ev) {
            this.newUrl = ev.target.result;
            imgtag.style.backgroundImage = 'url("' + ev.target.result + '")';

            this.convertImgToBase64URL(ev.target.result, function(base64Img){
                this.setState({profileIcon: base64Img});
                this.setEnabledButton();
            });
        };

        reader.readAsDataURL(selectedFile);

    },
    convertImgToBase64URL(url, callback, outputFormat) {
        let canvas = document.createElement('CANVAS'),
            ctx = canvas.getContext('2d'),
            img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = _ => {
            let dataURL;
            canvas.height = img.height;
            canvas.width = img.width;
            ctx.drawImage(img, 0, 0);
            dataURL = canvas.toDataURL(outputFormat);
            callback(dataURL);
            canvas = null;
        };
        img.src = url;
    },
    setEnabledButton() {
        Actions.setEnabledButton(!!(this.state.profileIcon || this.state.bio));
    },
    _onSaveProfile() {
        this.props.user.set({
            picture: this.state.profileIcon,
            bio: this.state.bio
        });
    }
});

module.exports = PersonalBio;
