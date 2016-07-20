var kuroapp = {
    init: function() {
        this.base_url = "http://danbooru.donmai.us";
        this.path = "/posts.json";
        this.url_queries = {};
        this.url_queries.limit = "18";
        this.url_queries.page = 1;
        this.updateCurrentPath();
        this.log(this.template_dir);
        this.log("KuroApp starting...");
        this.screenMain = document.getElementById("main-app");
        this.screenImage = document.getElementById("image-app");
        this.screenDebug = document.getElementById("debug-app");
        this.current_image = 0;

        this.bindEvents();
        this.log("KuroApp initialized!");
        this.settings = {};
    },

    bindEvents: function() {
        // bind events
        document.getElementById("top-nav-button-home").addEventListener("click", kuroapp.activateMainApp, false);
        document.getElementById("top-nav-button-refresh").addEventListener("click", kuroapp.refreshMainPage, false);
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
        kuroapp.url_queries.page--;
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

    updateCurrentPath: function() {
        var url_limit = "limit=" + kuroapp.url_queries.limit;
        var url_page = "page=" + kuroapp.url_queries.page;
        kuroapp.current_path = kuroapp.base_url + kuroapp.path;
        kuroapp.current_path = kuroapp.current_path + "?" + url_limit;
        kuroapp.current_path = kuroapp.current_path + "&" + url_page;
    },

    log: function(logString) {
        // body...
        var template = "<li class=\"table-view-cell content-padded\">{{text}}</li>";
        console.log(logString);
        $("#oop-test-01").append(template.replace("{{text}}", logString));
    },

    // post: function(url) {
    //     $.post(url, kuroapp.onPostSuccess);
    // },

    // onPostSuccess: function(data) {
    //     kuroapp.log("Post result: " + JSON.stringify(data));
    // },

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
        };

        kuroapp.log("current data len: " + data.length);
        for( var i = 0; i < data.length; i++) {
            var d = data[i];
            kuroapp.log(d.id);
            kuroapp.updateImageList(d, i);
        };

        // forEach example use
        // data.forEach(function(d) {
        //     kuroapp.log("inside forEach loop hanging out with my buddy " + d.id);
        // });
    },

    refreshMainPage: function() {
        $("#imageListMain").empty();
        kuroapp.get(kuroapp.current_path);
        kuroapp.activateMainApp();
        $$('#imageListMain').style('display', 'none');

    },

    updateImageList: function(imageData, counter) {
        counter = counter || 0;
        kuroapp.log("counter: " + counter);
        // var kuroapp.divHolder;
        var newImage;
        var imageLine, divid;
        newImage = '<img id="{{id}}" class="img-line" src="{{preview_url}}" alt="use id here later" />'
        imageLine = newImage.replace("{{preview_url}}", kuroapp.formatFullURL(imageData.preview_file_url));
        imageLine = imageLine.replace("{{id}}", imageData.id);

        if (counter % 2 == 0) {
            kuroapp.log("counter mod 0");
            kuroapp.divHolder = "<div id='{{divid}}'>{{img-01}}</div>";
            kuroapp.divHolder = kuroapp.divHolder.replace("{{img-01}}", imageLine);
            kuroapp.divHolder = kuroapp.divHolder.replace("{{divid}}", "img-div-" + counter);
            $("#imageListMain").append(kuroapp.divHolder);
            document.getElementById(imageData.id).addEventListener("click", kuroapp.loadFullImage.bind(null, imageData), false);


        } else {
            kuroapp.divHolder = kuroapp.divHolder.replace("{{img-02}}", imageLine);
            c = counter-1;
            divid = "#img-div-" + c;
            kuroapp.log("appending image to div: " + divid);
            $(divid).append(imageLine);
            document.getElementById(imageData.id).addEventListener("click", kuroapp.loadFullImage.bind(null, imageData), false);

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
        $(".app").css('background-image', 'url(' + imageData.url + ')');
        $(".app").css('background-repeat', 'no-repeat');
        $(".app").css('background-size', 'contain');
        kuroapp.activateImageApp();
    },

    activateMainApp: function() {
        // body...
        kuroapp.log("activating main app");
        kuroapp.screenMain.setAttribute('style', 'display: block;');
        kuroapp.screenImage.setAttribute('style', 'display: none;');
        kuroapp.screenDebug.setAttribute('style', 'display: none;');
        $(".app").css('background-image', 'none');
        $("#activate-main").addClass("active");
        $("#activate-scan").removeClass("active");
        $("#activate-debug").removeClass("active");

        // setup paging buttons for next
        document.getElementById("top-nav-button-next").removeEventListener("click", kuroapp.pagingNextImage, false);
        document.getElementById("top-nav-button-next").removeEventListener("click", kuroapp.pagingNextMain, false);
        document.getElementById("top-nav-button-next").addEventListener("click", kuroapp.pagingNextMain, false);
        kuroapp.log("all next buttons complete");
        // setup paging buttons for previous
        document.getElementById("top-nav-button-previous").removeEventListener("click", kuroapp.pagingPreviousImage, false);
        document.getElementById("top-nav-button-previous").removeEventListener("click", kuroapp.pagingPreviousMain, false);
        document.getElementById("top-nav-button-previous").addEventListener("click", kuroapp.pagingPreviousMain, false);
        kuroapp.log("all previous buttons complete")

        document.addEventListener("backbutton", kuroapp.onBackKeyDownMainScreen, false);
        kuroapp.log("all hardware buttons complete")

        $$("#activate-main").on("swipeLeft", function() {
            kuroapp.log("received swipeLeft");
        });
        // $$("#activate-main").on("swipeLeft", kuroapp.pagingNextMain);
        // $$("#activate-main").swipe(kuroapp.pagingNextMain);



    },

    activateImageApp: function() {
        // body...
        kuroapp.log("activating scan app");
        kuroapp.screenMain.setAttribute('style', 'display: none;');
        kuroapp.screenImage.setAttribute('style', 'display: block;');
        kuroapp.screenDebug.setAttribute('style', 'display: none;');
        $("#activate-main").removeClass("active");
        $("#activate-scan").addClass("active");
        $("#activate-debug").removeClass("active");

        // setup paging buttons for next
        document.getElementById("top-nav-button-next").removeEventListener("click", kuroapp.pagingNextMain, false);
        document.getElementById("top-nav-button-next").removeEventListener("click", kuroapp.pagingNextImage, false);
        document.getElementById("top-nav-button-next").addEventListener("click", kuroapp.pagingNextImage, false);

        // setup paging buttons for previous
        document.getElementById("top-nav-button-previous").removeEventListener("click", kuroapp.pagingPreviousMain, false);
        document.getElementById("top-nav-button-previous").removeEventListener("click", kuroapp.pagingPreviousImage, false);
        document.getElementById("top-nav-button-previous").addEventListener("click", kuroapp.pagingPreviousImage, false);

        document.addEventListener("backbutton", kuroapp.onBackKeyDownImageScreen, false);
    },

    onBackKeyDownImageScreen: function() {
        kuroapp.activateMainApp();
    },

    onBackKeyDownMainScreen: function() {
        kuroapp.refreshMainPage();
    },


    activateDebugApp: function() {
        // body...
        kuroapp.log("activating debug app");
        kuroapp.screenMain.setAttribute('style', 'display: none;');
        kuroapp.screenImage.setAttribute('style', 'display: none;');
        kuroapp.screenDebug.setAttribute('style', 'display: block;');
        $(".app").css('background-image', 'none');
        $("#activate-main").removeClass("active");
        $("#activate-scan").removeClass("active");
        $("#activate-debug").addClass("active");
    },

};
