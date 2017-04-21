console.log("started loading kuroapp.js");
var kuroapp = {
    init: function() {
        this.log("KuroApp starting...");
        this.origin = window.location;
        this.base_url = "https://booru.room208.org";
        this.site_username = "";
        this.site_password = "";
        this.path = "/posts.json";
        this.path_tags = "/tags.json";
        this.url_queries = {};
        this.url_queries.limit = "18";
        this.url_queries.page = 1;
        this.updateCurrentPath();
        this.log(this.template_dir);
        this.screenMain = document.getElementById("main-app");
        this.screenImage = document.getElementById("image-app");
        this.screenSettings = document.getElementById("settings-app");
        this.contentContainer = document.getElementById("content");

        this.current_image = 0;

        this.bindEvents();
        this.log("KuroApp initialized!");
        this.settings = {};
        this.refreshMainPage();
    },

    changeAPI: function() {
        if (kuroapp.base_url.indexOf("safebooru") > 0) {
            // load danbooru api
            kuroapp.log("API changed to: danbooru");
            this.path = "/posts.json";
        }
        if (kuroapp.base_url.indexOf("e621") > 0) {
            // load e621 api
            kuroapp.log("API changed to: e621");
            kuroapp.path = "/post/index.json";
        } else if (kuroapp.base_url.indexOf("danbooru") > 0) {
            // load danbooru api
            kuroapp.log("API changed to: danbooru");
            this.path = "/posts.json";
        } else if (kuroapp.base_url.indexOf("konachan") > 0) {
            // load konachan api
            kuroapp.log("API changed to: konachan");
            this.path = "/post.json";
        } else if (kuroapp.base_url.indexOf("room208") > 0) {
            // load room208 api
            kuroapp.log("API changed to: danbooru");
            kuroapp.path = "/posts.json";
        }
    },

    bindEvents: function() {
        // bind events
        kuroapp.loadSettings();
        $(".tag-search-form").on("submit", function() {
            kuroapp.updateRefresh();
        });


        $(".setting-base-url-input").val(kuroapp.base_url);
        $(".setting-site-login-username-input").val(kuroapp.site_username);
        $(".setting-site-login-password-input").val(kuroapp.site_password);

        $(".setting-list-item-per-page-input").val(kuroapp.url_queries.limit);

        $(".settings-form").on("submit", function() {
            kuroapp.updateSettings();
        });

        // hammerIt(this.screenImage);
        kuroapp.log("starting mc bind");
        HammerPinch.init(this.contentContainer);

        HammerPinch.mc.on('doubletap', HammerPinch.doubletapEvent);
        HammerPinch.mc.on('pan panend pinch pinchend', HammerPinch.pEvents);
        // HammerPinch.mc.on('pinch pinchend', HammerPinch.pinchEvent);
        // HammerPinch.mc.on('pan panend', HammerPinch.panendEvent);

        HammerPinch.mc.get('doubletap').set({enable: false});
        HammerPinch.mc.get('pan').set({enable: false});
        HammerPinch.mc.get('pinch').set({enable: false});

        // add event for update settings button
        var updateSettingsButton = document.getElementById("setting-update-setting-button");
        kuroapp.mcUpdateSettingsButton = new Hammer.Manager(updateSettingsButton);
        kuroapp.mcUpdateSettingsButton.add(new Hammer.Tap({ enable: true }));
        kuroapp.mcUpdateSettingsButton.on("tap press", function(ev) {
            kuroapp.log(ev.type + " gesture detected on home button.");
            kuroapp.updateSettings();
        });


        // set some dom obj variables
        var homeButton = document.getElementById("top-nav-button-home"),
        refreshButton = document.getElementById("top-nav-button-refresh"),
        settingsButton = document.getElementById("top-nav-button-settings"),
        previousButton = document.getElementById("top-nav-button-previous"),
        nextButton = document.getElementById("top-nav-button-next");

        kuroapp.mcButtonHome = new Hammer(homeButton);
        kuroapp.mcButtonRefresh = new Hammer(refreshButton);
        kuroapp.mcButtonSettings = new Hammer(settingsButton);

        // previous button setup main
        kuroapp.mcButtonPreviousPage = new Hammer.Manager(previousButton);
        kuroapp.mcButtonPreviousPage.add(new Hammer.Tap({ enable: true }));

        // previous button setup image
        kuroapp.mcButtonPreviousImage = new Hammer.Manager(previousButton);
        kuroapp.mcButtonPreviousImage.add(new Hammer.Tap({ enable: false }));

        // next button setup main
        kuroapp.mcButtonNextPage = new Hammer.Manager(nextButton);
        kuroapp.mcButtonNextPage.add(new Hammer.Tap({ enable: true }));

        // next button setup image
        kuroapp.mcButtonNextImage = new Hammer.Manager(nextButton);
        kuroapp.mcButtonNextImage.add(new Hammer.Tap({ enable: false }));

        // event setup
        kuroapp.mcButtonHome.on("tap press", function(ev) {
            kuroapp.log(ev.type + " gesture detected on home button.");
            kuroapp.activateMainApp();
        });

        kuroapp.mcButtonRefresh.on("tap press", function(ev) {
            kuroapp.log(ev.type + " gesture detected on refresh button.");
            kuroapp.refreshMainPage();
        });

        kuroapp.mcButtonSettings.on("tap press", function(ev) {
            kuroapp.log(ev.type + " gesture detected on settings button.");
            kuroapp.activateSettingsApp();
        });

        kuroapp.mcButtonPreviousPage.on("tap press", function(ev) {
            kuroapp.log(ev.type + " gesture detected on main previous button.");
            kuroapp.pagingPreviousMain();
        });

        kuroapp.mcButtonPreviousImage.on("tap press", function(ev) {
            kuroapp.log(ev.type + " gesture detected on image previous button.");
            kuroapp.pagingPreviousImage();
        });

        kuroapp.mcButtonNextPage.on("tap press", function(ev) {
            kuroapp.log(ev.type + " gesture detected on next button.");
            kuroapp.pagingNextMain();
        });

        kuroapp.mcButtonNextImage.on("tap press", function(ev) {
            kuroapp.log(ev.type + " gesture detected on next button.");
            kuroapp.pagingNextImage();
        });

        // swipe setup on image
        kuroapp.mcSwipeNextImage = new Hammer.Manager(kuroapp.screenImage);
        kuroapp.mcSwipeNextImage.add(new Hammer.Swipe({enable: true}));

        kuroapp.mcSwipeNextImage.on("swipeleft", function(ev) {
            kuroapp.log(ev.type + " gesture detected on image.");
            kuroapp.pagingNextImage();
        });

        kuroapp.mcSwipePreviousImage = new Hammer.Manager(kuroapp.screenImage);
        kuroapp.mcSwipePreviousImage.add(new Hammer.Swipe({enable: true}));

        kuroapp.mcSwipePreviousImage.on("swiperight", function(ev) {
            kuroapp.log(ev.type + " gesture detected on image.");
            kuroapp.pagingPreviousImage();
        });


        // swipe setup on main page
        kuroapp.mcSwipeNextPage = new Hammer.Manager(kuroapp.screenMain);
        kuroapp.mcSwipeNextPage.add(new Hammer.Swipe({enable: true}));

        kuroapp.mcSwipeNextPage.on("swipeleft", function(ev) {
            kuroapp.log(ev.type + " gesture detected on image.");
            kuroapp.pagingNextMain();
        });

        kuroapp.mcSwipePreviousPage = new Hammer.Manager(kuroapp.screenMain);
        kuroapp.mcSwipePreviousPage.add(new Hammer.Swipe({enable: true}));

        kuroapp.mcSwipePreviousPage.on("swiperight", function(ev) {
            kuroapp.log(ev.type + " gesture detected on image.");
            kuroapp.pagingPreviousMain();
        });

        // kuroapp.activateMainApp();
        kuroapp.changeAPI();
        kuroapp.refreshMainPage();
    },

    updateRefresh: function() {
        // next page of image thumbs
        kuroapp.log("updating path and refreshing");
        kuroapp.updateCurrentPath();
        kuroapp.refreshMainPage();
    },

    pagingNextMain: function() {
        // next page of image thumbs
        kuroapp.log("getting next page of image results for main");
        kuroapp.url_queries.page++;
        kuroapp.log("after page increment " + kuroapp.url_queries.page);
        kuroapp.updateRefresh();
    },

    pagingPreviousMain: function() {
        // next page of image thumbs
        kuroapp.log("getting previous page of image results for main");
        if (kuroapp.url_queries.page > 1) {
            kuroapp.url_queries.page--;
        };
        kuroapp.updateRefresh();
    },

    pagingNextImage: function() {
        kuroapp.log("getting next image");
        kuroapp.log("current image: " + kuroapp.current_image);

        for( var i = 0; i <= kuroapp.current_results.length; i++) {
            var r = kuroapp.current_results[i];
            if (r.id == kuroapp.current_image) {
                kuroapp.log("found image: " + r.id);
                var c = i + 1;
                var target = kuroapp.current_results[c];
                if (target === undefined) {
                    kuroapp.log("image on next page");

                    kuroapp.url_queries.page++;
                    kuroapp.updateCurrentPath();
                    kuroapp.get_callback = kuroapp.update_image;
                    kuroapp.update_image_val = 0;
                    kuroapp.get(kuroapp.current_path);
                    break;


                } else {
                    kuroapp.log("next image: " + target.id);
                    kuroapp.loadFullImage(target);
                    break;


                };
            };
        };
    },

    update_image: function(val) {
        var target = kuroapp.current_results[kuroapp.update_image_val];
        kuroapp.loadFullImage(target);
    },

    pagingPreviousImage: function() {
        kuroapp.log("getting previous image");
        kuroapp.log("current image: " + kuroapp.current_image);

        for( var i = 0; i <= kuroapp.current_results.length; i++) {
            var r = kuroapp.current_results[i];
            if (r.id == kuroapp.current_image) {
                kuroapp.log("found image: " + r.id);
                var c = i - 1;
                var target = kuroapp.current_results[c];
                if (target === undefined) {
                    kuroapp.log("image on next page");

                    kuroapp.url_queries.page--;
                    kuroapp.updateCurrentPath();
                    kuroapp.get_callback = kuroapp.update_image;
                    kuroapp.update_image_val = kuroapp.current_results.length - 1;

                    kuroapp.get(kuroapp.current_path);
                    break;


                } else {
                    kuroapp.log("next image: " + target.id);
                    kuroapp.loadFullImage(target);
                    break;


                };
            };
        };
    },

    saveSettings: function() {
        var storage = window.localStorage;
        log("saving settings");
        storage.setItem("base_url", kuroapp.base_url);
        storage.setItem("site_username", kuroapp.site_username);
        storage.setItem("site_password", kuroapp.site_password);
        storage.setItem("last_tags", $(".tag-input").val());
        storage.setItem("query_limit", kuroapp.url_queries.limit);
        log("saved base url: " + storage.getItem("base_url"))
        log("saved username: " + storage.getItem("site_username"))
        log("saved password: " + storage.getItem("site_password"))
        log("saved last tags: " + storage.getItem("last_tags"))
        log("saved query limit: " + storage.getItem("query_limit"))

    },

    loadSettings: function() {
        log("loading settings");

        var storage = window.localStorage;
        kuroapp.base_url = storage.getItem("base_url") || kuroapp.base_url;
        kuroapp.site_username = storage.getItem("site_username") || kuroapp.site_username;
        kuroapp.site_password = storage.getItem("site_password") || kuroapp.site_password;
        kuroapp.url_queries.tags = storage.getItem("last_tags") || kuroapp.url_queries.tags;
        kuroapp.url_queries.limit = storage.getItem("query_limit") || kuroapp.url_queries.limit;
        log("loaded base url: " + storage.getItem("base_url"));
        log("loaded username: " + storage.getItem("site_username"));
        log("loaded password: " + storage.getItem("site_password"));
        log("loaded last tags: " + storage.getItem("last_tags"));
        log("loaded query limit: " + storage.getItem("query_limit"));
        $(".tag-input").val(kuroapp.url_queries.tags);

        kuroapp.updateCurrentPath();
    },

    updateSettings: function() {
        kuroapp.url_queries.page = 1;
        kuroapp.updateQueryLimit();
        kuroapp.changeAPI();
        kuroapp.saveSettings();

        kuroapp.updateBaseURL();
        kuroapp.updateSiteLogin();
        kuroapp.refreshMainPage();
    },

    updateBaseURL: function() {
        kuroapp.base_url = $(".setting-base-url-input").val();
    },

    updateSiteLogin: function() {
        kuroapp.site_username = $(".setting-site-login-username-input").val();
        kuroapp.site_password = $(".setting-site-login-password-input").val();
    },

    formatFullURL: function(path) {
        // use base url and append to path
        if (typeof path != "undefined") {
            if (path.startsWith("http://") == false && path.startsWith("https://") == false) {
                return kuroapp.base_url + path;
            } else {
                return path;
            };
        };
    },

    updateQueryLimit: function() {
        kuroapp.url_queries.limit = $(".setting-list-item-per-page-input").val();
        kuroapp.log("query limit set to: " + kuroapp.url_queries.limit);
    },

    updateCurrentPath: function(query) {
        var query = query || "*";
        query = $(".tag-input").val();
        var url_limit = "limit=" + kuroapp.url_queries.limit;
        var url_page = "page=" + kuroapp.url_queries.page;
        var tag_search = "tags=" + query;
        kuroapp.url_queries.tags = query;
        // path = "/tags.json"
        // /tags.json?search[name_matches]=a*.
        if (kuroapp.path.startsWith("https") || kuroapp.path.startsWith("http")) {
            kuroapp.current_path = kuroapp.path;
        } else {
            kuroapp.current_path = kuroapp.base_url + kuroapp.path;
        }
        if (kuroapp.base_url.indexOf("konachan") >= 0) {
            kuroapp.current_path = kuroapp.current_path;
        };
        if (typeof query != "undefined") {
            kuroapp.current_path = kuroapp.current_path + "?" + url_limit;
            kuroapp.current_path = kuroapp.current_path + "&" + url_page;
            kuroapp.current_path = kuroapp.current_path + "&" + tag_search;
        } else {
            kuroapp.current_path = kuroapp.current_path + "?" + url_limit;
            kuroapp.current_path = kuroapp.current_path + "&" + url_page;

        };

        if (kuroapp.base_url.indexOf("danbooru") >= 0) {
            // use login for danbooru if supplied
            $(".setting-site-login-view").removeClass("hidden");
            if (kuroapp.site_username != "" && kuroapp.site_password != "") {
                kuroapp.current_path = kuroapp.current_path + "&login="+kuroapp.site_username+"&api_key="+kuroapp.site_password;
            }
        } else {
            $(".setting-site-login-view").addClass("hidden");
        };

        kuroapp.log("updated url: " + kuroapp.current_path);
    },

    stringIt: function(str) {
        return atob(str);
    },

    b64It: function(str) {
        return btoa(str);
    },

    log: function(logString) {
        // body...
        var template = "<li class=\"table-view-cell content-padded\">{{text}}</li>";
        console.log(logString);
        $("#logging-container").append(template.replace("{{text}}", logString));
    },

    get: function(url) {
        kuroapp.log("making get request");
        $.get(url, kuroapp.onGetSuccess);

        kuroapp.log("get request done");
    },

    onGetSuccess: function(data) {
        tmp = data;
        kuroapp.current_results = data;
        $("#main-view").empty();

        if (typeof kuroapp.get_callback != 'undefined') {
            kuroapp.get_callback();
            kuroapp.get_callback = undefined;
        };

        kuroapp.log("current data len: " + data.length);
        for( var i = 0; i < data.length; i++) {
            var d = data[i];
            kuroapp.log(d.id);
            kuroapp.updateImageList(d, i);
        };

    },

    refreshMainPage: function() {
        $("#main-view").empty();
        kuroapp.updateCurrentPath();
        kuroapp.get(kuroapp.current_path);
        kuroapp.activateMainApp();
    },

    updateImageList: function(imageData, counter) {
        counter = counter || 0;
        kuroapp.log("counter: " + counter);
        var newImage;
        var imageLine, divid;
        imageData.preview_file_url = imageData.preview_file_url || imageData.preview_url;
        kuroapp.log("preview url: " + imageData.preview_file_url);

        newImage = '<div id="container-{{id}}" class="div-img-line">{{image}}</div>'.replace("{{id}}", imageData.id);
        theImage = '<img id="{{id}}" class="img-line" src="{{preview_url}}" alt="use id here later" />';
        newImage = newImage.replace("{{image}}", theImage);
        imageLine = newImage.replace("{{preview_url}}", kuroapp.formatFullURL(imageData.preview_file_url));
        imageLine = imageLine.replace("{{id}}", imageData.id);
        $("#main-view").append(imageLine);
        kuroapp.log("imageLine: " + imageLine);
        kuroapp.log("image data: " + JSON.stringify(imageData));


        // resize based on height and width
        // if height > width then width = 100% and height = auto
        if (imageData.height >= imageData.width) {
            kuroapp.log(imageData.id + " imageData.height >= imageData.width");
            kuroapp.log(imageData.id + " height: " + imageData.height + "  width: " + imageData.width);
            $("#container-" + imageData.id).css("height", 'auto');
            $("#container-" + imageData.id).css("width", '10em');
            $("#container-" + imageData.id).css("align", 'center');
            $("#" + imageData.id).css("vertical-align", 'middle');

        } else if (imageData.width >= imageData.height) {
            kuroapp.log(imageData.id + " imageData.width >= imageData.height");
            kuroapp.log(imageData.id + " height: " + imageData.height + "  width: " + imageData.width);

            $("#container-" + imageData.id).css("width", 'auto');
            $("#container-" + imageData.id).css("height", '10em');
            $("#container-" + imageData.id).css("align", 'center');

            $("#" + imageData.id).css("vertical-align", 'middle');

        }

        // setup image tap event for full image
        mcImage = Hammer(document.getElementById(imageData.id));
        mcImage.on("tap press", function(ev) {
            kuroapp.log(ev.type + " gesture detected on image.");
            kuroapp.loadFullImage(imageData);
        });

    },

    loadFullImage: function(imageData) {
        imageData.url = kuroapp.formatFullURL(imageData.file_url)
        kuroapp.log("loading full image for {{id}}".replace("{{id}}", imageData.id));
        var newImage = '<img id="img-{{id}}" class="hidden" src="{{file_url}}" alt="use id here later" />'
        var imageLine = newImage.replace("{{file_url}}", imageData.url);
        imageLine = imageLine.replace("{{id}}", imageData.id);
        kuroapp.log("full image loading " + imageData.url);
        $("#image-view").append(imageLine);
        kuroapp.setBackroundImage(imageData);
        kuroapp.current_image = imageData.id;
    },

    setBackroundImage: function(imageData) {
        $(".content").css('background-image', 'url(' + imageData.url + ')');
        $(".content").css('background-repeat', 'no-repeat');
        $(".content").css('background-size', 'contain');
        kuroapp.activateImageApp();
    },

    activateMainApp: function() {
        // body...
        kuroapp.log("activating main app");
        kuroapp.screenMain.setAttribute('style', 'display: block;');
        kuroapp.screenImage.setAttribute('style', 'display: none;');
        kuroapp.screenSettings.setAttribute('style', 'display: none;');
        $(".content").css('background-image', 'none');


        kuroapp.mcButtonPreviousPage.get('tap').set({ enable: true });
        kuroapp.mcButtonNextPage.get('tap').set({ enable: true });

        kuroapp.mcButtonPreviousImage.get('tap').set({ enable: false });
        kuroapp.mcButtonNextImage.get('tap').set({ enable: false });
        kuroapp.disableZoom();
        HammerPinch.resetScreenScale();

        document.addEventListener("backbutton", kuroapp.onBackKeyDownMainScreen, false);

        document.removeEventListener("keypress", kuroapp.imageHotkeys, false);
        document.addEventListener("keypress", kuroapp.mainHotkeys, false);

        kuroapp.log("all hardware buttons complete")
    },

    mainHotkeys: function() {
        kuroapp.log('keypress: ' + event.keyCode);
        if (event.keyCode == 97) {
            kuroapp.pagingPreviousMain();
        } else if (event.keyCode == 100) {
            kuroapp.pagingNextMain();
        } else if (event.keyCode == 113) {
            kuroapp.activateMainApp();
        }
    },

    imageHotkeys: function() {
        kuroapp.log('keypress: ' + event.keyCode);
        if (event.keyCode == 97) {
            kuroapp.pagingPreviousImage();
        } else if (event.keyCode == 100) {
            kuroapp.pagingNextImage();
        } else if (event.keyCode == 113) {
            kuroapp.activateMainApp();
        }
    },


    activateImageApp: function() {
        // body...
        kuroapp.log("activating scan app");
        kuroapp.screenMain.setAttribute('style', 'display: none;');
        kuroapp.screenImage.setAttribute('style', 'display: block;');
        kuroapp.screenSettings.setAttribute('style', 'display: none;');


        // stop hammer for main
        kuroapp.mcButtonPreviousPage.get('tap').set({ enable: false });
        kuroapp.mcButtonNextPage.get('tap').set({ enable: false });

        // start hammer for image
        kuroapp.mcButtonPreviousImage.get('tap').set({ enable: true });
        kuroapp.mcButtonNextImage.get('tap').set({ enable: true });
        kuroapp.enableZoom();
        HammerPinch.resetScreenScale();

        document.addEventListener("backbutton", kuroapp.onBackKeyDownImageScreen, false);
        document.removeEventListener("keypress", kuroapp.mainHotkeys, false);
        document.addEventListener("keypress", kuroapp.imageHotkeys, false);

    },

    onBackKeyDownImageScreen: function() {
        kuroapp.activateMainApp();
    },

    onBackKeyDownMainScreen: function() {
        kuroapp.refreshMainPage();
    },

    onBackKeyDownSettingsScreen: function() {
        kuroapp.refreshMainPage();
    },


    activateSettingsApp: function() {
        // body...
        kuroapp.log("activating settings app");
        kuroapp.screenMain.setAttribute('style', 'display: none;');
        kuroapp.screenImage.setAttribute('style', 'display: none;');
        kuroapp.screenSettings.setAttribute('style', 'display: block;');
        $(".content").css('background-image', 'none');
        kuroapp.disableZoom();
        HammerPinch.resetScreenScale();
        document.addEventListener("backbutton", kuroapp.onBackKeyDownSettingsScreen, false);
        document.removeEventListener("keypress", kuroapp.mainHotkeys, false);
        document.removeEventListener("keypress", kuroapp.imageHotkeys, false);

    },

    enableZoom: function() {
        log("enabling zoom");
        HammerPinch.mc.get('doubletap').set({enable: true});
        HammerPinch.mc.get('pan').set({enable: true});
        HammerPinch.mc.get('pinch').set({enable: true});
    },

    disableZoom: function() {
        log("disabling zoom");
        HammerPinch.mc.get('doubletap').set({enable: false});
        HammerPinch.mc.get('pan').set({enable: false});
        HammerPinch.mc.get('pinch').set({enable: false});
    },

    disableSwipe: function() {
        log("disabling swipe");
        kuroapp.mcSwipePreviousImage.get('swipe').set({enable: false});
        kuroapp.mcSwipeNextImage.get('swipe').set({enable: false});
    },

    enableSwipe: function() {
        log("enabling swipe");
        kuroapp.mcSwipePreviousImage.get('swipe').set({enable: true});
        kuroapp.mcSwipeNextImage.get('swipe').set({enable: true});
    },

};



var HammerPinch = {
    init: function(elm) {
        this.posX = 0;
        this.posY = 0;
        this.scale = 1;
        this.last_scale = 1;
        this.last_posX = 0;
        this.last_posY = 0;
        this.max_pos_x = 0;
        this.max_pos_y = 0;
        this.transform = "translate3d(0, 0, 0) " + "scale3d(1, 1, 1) ";
        this.el = elm;
        log("begining mc init");
        this.mc = new Hammer(elm, {});
        log("mc init finished");
        log("finished init");
        // this.doubletapEvent(elm);
    },

    doubletapEvent: function(ev) {
        // doubletap event
        log("detected doubletap event");

        if (ev.type == "doubletap") {
            HammerPinch.transform =
                "translate3d(0, 0, 0) " +
                "scale3d(2, 2, 1) ";
            HammerPinch.scale = 2;
            HammerPinch.last_scale = 2;
            HammerPinch.matrix = window.getComputedStyle(HammerPinch.el, null).getPropertyValue('-webkit-transform').toString();
            if (HammerPinch.matrix == 'none') {
                log("first doubletap detected");
                HammerPinch.matrix = "matrix(1, 0, 0, 1, 0, 0)";
            }
            try {
                if (HammerPinch.matrix != "matrix(1, 0, 0, 1, 0, 0)") {
                    log("doubletap if tested false: " + HammerPinch.matrix);

                    HammerPinch.transform =
                        "translate3d(0, 0, 0) " +
                        "scale3d(1, 1, 1) ";
                    HammerPinch.scale = 1;
                    HammerPinch.last_scale = 1;
                } else {

                }
            } catch (err) {
                log("error in doubletap" + err);
            }
            log("hammerpinch transform pre apply: " + HammerPinch.transform);
            HammerPinch.el.style.webkitTransform = HammerPinch.transform;
            HammerPinch.transform = "";
        }
        HammerPinch.closeEvent();


    },

    panEvent: function(ev) {
        if (HammerPinch.scale != 1) {
            HammerPinch.posX = HammerPinch.last_posX + ev.deltaX;
            HammerPinch.posY = HammerPinch.last_posY + ev.deltaY;
            HammerPinch.max_pos_x = Math.ceil((HammerPinch.scale - 1) * HammerPinch.el.clientWidth / 2);
            HammerPinch.max_pos_y = Math.ceil((HammerPinch.scale - 1) * HammerPinch.el.clientHeight / 2);
            if (HammerPinch.posX > HammerPinch.max_pos_x) {
                HammerPinch.posX = HammerPinch.max_pos_x;
            }
            if (HammerPinch.posX < -HammerPinch.max_pos_x) {
                HammerPinch.posX = -HammerPinch.max_pos_x;
            }
            if (HammerPinch.posY > HammerPinch.max_pos_y) {
                HammerPinch.posY = HammerPinch.max_pos_y;
            }
            if (HammerPinch.posY < -HammerPinch.max_pos_y) {
                HammerPinch.posY = -HammerPinch.max_pos_y;
            }
        }
        HammerPinch.closeEvent();


    },

    pEvents: function(ev) {
        if (HammerPinch.scale <= 1) {
            kuroapp.enableSwipe();
        } else {
            kuroapp.disableSwipe();
        }
        HammerPinch.panEvent(ev);
        HammerPinch.panendEvent(ev);
        HammerPinch.pinchEvent(ev);
    },

    panendEvent: function(ev) {
        //panend
        if(ev.type == "panend"){
            HammerPinch.last_posX = HammerPinch.posX < HammerPinch.max_pos_x ? HammerPinch.posX : HammerPinch.max_pos_x;
            HammerPinch.last_posY = HammerPinch.posY < HammerPinch.max_pos_y ? HammerPinch.posY : HammerPinch.max_pos_y;
        }
        HammerPinch.closeEvent();

    },

    pinchEvent: function(ev) {
        if (ev.type == "pinch") {
            HammerPinch.scale = Math.max(.999, Math.min(HammerPinch.last_scale * (ev.scale), 4));
        }

        if(ev.type == "pinchend") {
            HammerPinch.last_scale = HammerPinch.scale;
        }
        HammerPinch.closeEvent();

    },

    closeEvent: function() {
        if (HammerPinch.scale != 1) {
            HammerPinch.transform =
                "translate3d(" + HammerPinch.posX + "px," + HammerPinch.posY + "px, 0) " +
                "scale3d(" + HammerPinch.scale + ", " + HammerPinch.scale + ", 1)";
        }

        if (HammerPinch.transform) {
            HammerPinch.el.style.webkitTransform = HammerPinch.transform;
            HammerPinch.transform = "";
        }

    },

    resetScreenScale: function() {
        HammerPinch.transform =
            "translate3d(0, 0, 0) " +
            "scale3d(1, 1, 1) ";
        HammerPinch.scale = 1;
        HammerPinch.last_scale = 1;
        HammerPinch.el.style.webkitTransform = HammerPinch.transform;
        this.posX = 0;
        this.posY = 0;
        this.last_posX = 0;
        this.last_posY = 0;
    },


}

if (typeof String.prototype.startsWith != 'function') {
  // see below for better implementation!
  String.prototype.startsWith = function (str){
    return this.indexOf(str) === 0;
  };
}

var log = kuroapp.log
