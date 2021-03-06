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

// tags
var TagsNav = React.createClass({
    render: function() {
        return (
            <button
            id="top-nav-button-tags"
            className="btn pull-right icon-info icon-small">
            </button>
        );
    }
});

// tags
var DownloadNav = React.createClass({
    render: function() {
        return (
            <a
            id="top-nav-button-download"
            className="btn pull-right icon-download icon-small" href="#" download=""/>
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
                <TagsNav />
                <DownloadNav />
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
                <TagsApp />
                <SettingsApp />
            </div>
        );
    }
});

var MainApp = React.createClass({
    render: function() {
        return (
            <div id="main-app">
                <span id="main-view"></span>
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

var TagsApp = React.createClass({
    render: function() {
        return (
            <div id="tags-app">
                <div className="table-view" id="tags-view">
                    <div className="table-view" id="tags-view-left"></div>
                    <div id="tags-view-right"></div>

                </div>
            </div>
        );
    }
});


// logging container lives here for debugging
// <LoggingContainer />
var SettingsApp = React.createClass({
    render: function() {
        return (
            <div id="settings-app">
                <SettingsContainer />
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
                <form id="settings-form" className="settings-form" method="GET" action="#">
                        <TagSearchSetting />
                        <BaseUrlSetting />
                        <SiteLoginSetting />
                        <ListItemPerPageSetting />
                        <ToggleLoggingSetting />
                        <UpdateSettingButton />
                </form>
                <LoggingContainer />

            </div>
        );
    }
});

var UpdateSettingButton = React.createClass({
    render: function() {
        return (
            <div id="setting-update-setting-view" className="setting-update-setting-view">
                <button
                    id="setting-update-setting-button"
                    className="setting-update-setting-button">
                    Update
                </button>
            </div>
        );
    }
});

var BaseUrlSetting = React.createClass({
    render: function() {
        return (
                <div id="setting-base-url-view" className="setting-base-url-view">
                    <label className="title">Base URL
                    </label>

                    <input
                        type="text"
                        id="setting-base-url-input"
                        className="setting-base-url-input"
                        placeholder="http://" />

                </div>
        );
    }
});

var SiteLoginSetting = React.createClass({
    render: function() {
        return (
                <div id="setting-site-login-view" className="setting-site-login-view hidden">
                    <label className="title">
                        Site Username
                    </label>

                    <input
                        type="text"
                        id="setting-site-login-username-input"
                        className="setting-site-login-username-input"
                        placeholder="username"
                    />

                    <label className="title">
                        Site Password
                    </label>
                    <input
                        type="text"
                        id="setting-site-login-password-input"
                        className="setting-site-login-password-input"
                        placeholder="password" />

                </div>
        );
    }
});

var TagSearchSetting = React.createClass({
    render: function() {
        return (
                <div id="tag-input-view" className="tag-input-view">
                    <label className="title">Tag Search
                    </label>
                    <input
                        type="text"
                        id="tag-input"
                        className="tag-input"
                        placeholder="*" />
                </div>
        );
    }
});

var ListItemPerPageSetting = React.createClass({
    render: function() {
        return (
                <div id="setting-list-item-per-page-view" className="setting-list-item-per-page-view">
                    <label className="title">Results Per Page
                    </label>

                    <input
                        type="text"
                        className="setting-list-item-per-page-input"
                        placeholder="18" />
                </div>
        );
    }
});
var ToggleLoggingSetting = React.createClass({
    render: function() {
        return (
                <div id="setting-toggle-logging-view" className="setting-toggle-logging-view">
                    <label className="title">Enable Logging
                    </label>

                    <input
                        type="checkbox"
                        className="setting-toggle-logging-input"
                    />
                </div>
        );
    }
});




ReactDOM.render(<BaseContainer />, document.body);
