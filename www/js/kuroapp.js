var kuroapp = {
    init: function() {
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

    bindEvents: function() {
        // bind events

        $(".tag-search-form").on("submit", function() {
            kuroapp.updateRefresh();
        });

        $(".base-url-input").val(kuroapp.base_url);

        $(".base-url-form").on("submit", function() {
            kuroapp.base_url = $(".base-url-input").val();
            kuroapp.updateRefresh();
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

        kuroapp.activateMainApp();
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

    updateCurrentPath: function(query) {
        var query = query || "*";
        query = $(".tag-input").val();
        var url_limit = "limit=" + kuroapp.url_queries.limit;
        var url_page = "page=" + kuroapp.url_queries.page;
        var tag_search = "tags=" + query;
        kuroapp.url_queries.tags = true
        // path = "/tags.json"
         // /tags.json?search[name_matches]=a*.
        if (typeof query != "undefined") {
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
        kuroapp.get(kuroapp.current_path);
        kuroapp.activateMainApp();
    },

    updateImageList: function(imageData, counter) {
        counter = counter || 0;
        kuroapp.log("counter: " + counter);
        var newImage;
        var imageLine, divid;
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
        return kuroapp.base_url + path;
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


    activateSettingsApp: function() {
        // body...
        kuroapp.log("activating debug app");
        kuroapp.screenMain.setAttribute('style', 'display: none;');
        kuroapp.screenImage.setAttribute('style', 'display: none;');
        kuroapp.screenSettings.setAttribute('style', 'display: block;');
        $(".content").css('background-image', 'none');
        kuroapp.disableZoom();
        HammerPinch.resetScreenScale();

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

};

var log = kuroapp.log
