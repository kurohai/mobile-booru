// left side nav bar
// home button
var HomeNav = React.createClass({
    render: function() {
        return (
            <button
            id="top-nav-button-home"
            className="btn pull-left icon-home icon-small">

            </button>
        );
    }
});

// refresh button
var RefreshNav = React.createClass({
    render: function() {
        return (
            <button
            id="top-nav-button-refresh"
            className="btn pull-left icon-refresh icon-small">

            </button>
        );
    }
});






// Nav Bar Right Side
// settings
var SettingsNav = React.createClass({
    render: function() {
        return (
            <button
            id="top-nav-button-settings"
            className="btn pull-right icon-gear icon-small">
            </button>
        );
    }
});

//next
var NextNav = React.createClass({
    render: function() {
        return (
            <button
            id="top-nav-button-next"
            className="btn pull-right icon-right-nav icon-small">
            </button>
        );
    }
});

// previous
var PreviousNav = React.createClass({
    render: function() {
        return (
            <button
            id="top-nav-button-previous"
            className="btn pull-right icon-left-nav icon-small">
            </button>
        );
    }
});



// Base Nav Bar
var BaseHeader = React.createClass({
    render: function() {
        return (
            <header className="bar nav-bar">
                <HomeNav />
                <RefreshNav />
                <SettingsNav />
                <NextNav />
                <PreviousNav />
            </header>
        );
    }
});



// main app container and react root
var BaseContainer = React.createClass({
    render: function() {
        return (
            <div className="app">
                <BaseHeader />
                <Content />
            </div>
        );
    }
});

// main app container and react root
var Content = React.createClass({
    componentDidMount: function() {
        kuroapp.init();
    },
    render: function() {
        return (
            <div className="content" id="content">
                <MainApp />
                <ImageApp />
                <SettingsApp />
            </div>
        );
    }
});

var MainApp = React.createClass({
    render: function() {
        return (
            <div id="main-app">
                <span id="imageListMain"></span>
            </div>
        );
    }
});

var ImageApp = React.createClass({
    render: function() {
        return (
            <div id="image-app">
                <div id="image-view"></div>
            </div>
        );
    }
});

var SettingsApp = React.createClass({
    render: function() {
        return (
            <div id="settings-app">
                <SettingsContainer />
                <LoggingContainer />
            </div>
        );
    }
});


var LoggingContainer = React.createClass({
    render: function() {
        return (
            <div id="logging-container" className="logging-view"></div>
        );
    }
});

var SettingsContainer = React.createClass({
    render: function() {
        return (
            <div id="settings-container" className="settings-view">
                <BaseUrlSetting />
            </div>
        );
    }
});

var BaseUrlSetting = React.createClass({
    render: function() {
        return (
            <form className="input-group">
                <div id="setting-base-url-container" className="setting-base-url-view input-row">
                    <button
                        className="setting-base-url-button ">
                        Update
                    </button>
                    <input
                        type="text"
                        className="setting-base-url-input "
                        placeholder="http://" />
                </div>
            </form>
        );
    }
});




ReactDOM.render(<BaseContainer />, document.body);
