// left side nav bar
// home button
var HomeNav = React.createClass({
    render: function() {
        return (
            <button
            id="top-nav-button-home"
            className="btn pull-left">
            Main
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
            className="btn pull-left">
            Refresh
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
            className="btn pull-right">
            Next
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
            className="btn pull-right">
            Previous
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
            <div id="logging-container" className="logging-view content-padded"></div>
        );
    }
});

var SettingsContainer = React.createClass({
    render: function() {
        return (
            <div id="settings-container" className="settings-view content-padded">
                <BaseUrlSetting />
            </div>
        );
    }
});

var BaseUrlSetting = React.createClass({
    render: function() {
        return (
            <div id="setting-base-url-container" className="setting-base-url-view content-padded">
                <input
                    type="text"
                    className="setting-base-url-input"
                    placeholder="http://"
                />
                <button
                    className="setting-base-url-button">
                    Update
                </button>
            </div>
        );
    }
});




ReactDOM.render(<BaseContainer />, document.body);
