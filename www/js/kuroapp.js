console.log("started loading kuroapp.js");
var kuroapp = {
    init: function() {
        this.origin = window.location;
        this.base_url = "https://booru.room208.org";
        this.path = "/posts.json";
        this.path_tags = "/tags.json";
        this.url_queries = {};
        this.url_queries.limit = "18";
        this.url_queries.page = 1;
        this.updateCurrentPath();
        this.log(this.template_dir);
        this.log("KuroApp starting...");
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
        if (kuroapp.base_url.indexOf("e621")) {
            // load e621 api
            kuroapp.log("API changed to: e621");
            kuroapp.path = "/post/index.json";
        } else if (kuroapp.base_url.indexOf("danbooru")) {
            // load danbooru api
            kuroapp.log("API changed to: danbooru");
            this.path = "/posts.json";
        } else if (kuroapp.base_url.indexOf("konachan")) {
            // load konachan api
            kuroapp.log("API changed to: konachan");
            this.path = "/post.json";
        } else if (kuroapp.base_url.indexOf("room208")) {
            // load room208 api
            kuroapp.log("API changed to: danbooru");
            kuroapp.path = "/posts.json";
        };
    },

    bindEvents: function() {
        // bind events
        kuroapp.loadSettings();
        $(".tag-search-form").on("submit", function() {
            kuroapp.updateRefresh();
        });


        $(".setting-base-url-input").val(kuroapp.base_url);
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
        storage.setItem("last_tags", $(".tag-input").val());
        storage.setItem("query_limit", kuroapp.url_queries.limit);
        log("saved base url: " + storage.getItem("base_url"))
        log("saved last tags: " + storage.getItem("last_tags"))
        log("saved query limit: " + storage.getItem("query_limit"))

    },

    loadSettings: function() {
        log("loading settings");

        var storage = window.localStorage;
        kuroapp.base_url = storage.getItem("base_url") || kuroapp.base_url;
        kuroapp.url_queries.tags = storage.getItem("last_tags") || kuroapp.url_queries.tags;
        kuroapp.url_queries.limit = storage.getItem("query_limit") || kuroapp.url_queries.limit;
        log("loaded base url: " + storage.getItem("base_url"));
        log("loaded last tags: " + storage.getItem("last_tags"));
        log("loaded query limit: " + storage.getItem("query_limit"));
        $(".tag-input").val(kuroapp.url_queries.tags);

        kuroapp.updateCurrentPath();
    },

    updateSettings: function() {
        kuroapp.updateQueryLimit();
        kuroapp.updateBaseURL();
        kuroapp.changeAPI();
        kuroapp.saveSettings();

        kuroapp.refreshMainPage();
    },

    updateBaseURL: function() {
        kuroapp.base_url = $(".setting-base-url-input").val();

    },

    updateQueryLimit: function() {
        kuroapp.url_queries.limit = $(".setting-list-item-per-page-input").val();
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

        if (kuroapp.base_url.indexOf("konachan")) {
            kuroapp.current_path = kuroapp.base_url + kuroapp.path;
        } else if (typeof query != "undefined") {
            kuroapp.current_path = kuroapp.base_url + kuroapp.path;
            kuroapp.current_path = kuroapp.current_path + "?" + url_limit;
            kuroapp.current_path = kuroapp.current_path + "&" + url_page;
            kuroapp.current_path = kuroapp.current_path + "&" + tag_search;
        } else {
            kuroapp.current_path = kuroapp.base_url + kuroapp.path;
            kuroapp.current_path = kuroapp.current_path + "?" + url_limit;
            kuroapp.current_path = kuroapp.current_path + "&" + url_page;

        }

        kuroapp.log("updated url: " + kuroapp.current_path);
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
        $("#imageListMain").empty();

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
        $("#imageListMain").empty();
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
        newImage = '<img id="{{id}}" class="img-line" src="{{preview_url}}" alt="use id here later" />'
        imageLine = newImage.replace("{{preview_url}}", kuroapp.formatFullURL(imageData.preview_file_url));
        imageLine = imageLine.replace("{{id}}", imageData.id);

        if (counter % 2 == 0) {
            kuroapp.log("counter mod 0");
            kuroapp.divHolder = "<div id='{{divid}}' class='div-img-line'>{{img-01}}</div>";
            kuroapp.divHolder = kuroapp.divHolder.replace("{{img-01}}", imageLine);
            kuroapp.divHolder = kuroapp.divHolder.replace("{{divid}}", "img-div-" + counter);
            $("#imageListMain").append(kuroapp.divHolder);

            // setup image tap event for full image
            mcImage = Hammer(document.getElementById(imageData.id));
            mcImage.on("tap press", function(ev) {
                kuroapp.log(ev.type + " gesture detected on image.");
                kuroapp.loadFullImage(imageData);
            });

        } else {
            kuroapp.divHolder = kuroapp.divHolder.replace("{{img-02}}", imageLine);
            c = counter-1;
            divid = "#img-div-" + c;
            kuroapp.log("appending image to div: " + divid);
            $(divid).append(imageLine);

            mcImage = Hammer(document.getElementById(imageData.id));
            mcImage.on("tap press", function(ev) {
                kuroapp.log(ev.type + " gesture detected on image.");
                kuroapp.loadFullImage(imageData);
            });

        };
    },

    formatFullURL: function(path) {
        // use base url and append to path
        if (path.indexOf("http://") == false && path.indexOf("https://") == false) {
            return kuroapp.base_url + path;
        } else {
            return path;
        }
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
        kuroapp.log("all hardware buttons complete")
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


var log = kuroapp.log
