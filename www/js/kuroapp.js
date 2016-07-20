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
        document.getElementById("activate-main").addEventListener("click", kuroapp.activateMainApp, false);
        document.getElementById("activate-scan").addEventListener("click", kuroapp.activateImageApp, false);
        document.getElementById("activate-debug").addEventListener("click", kuroapp.activateDebugApp, false);
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
                // kuroapp.log("trying target: " + target.id);

                if (target === undefined) {
                    kuroapp.log("image on next page");

                    kuroapp.url_queries.page++;
                    kuroapp.updateCurrentPath();
                    kuroapp.get_callback = kuroapp.update_image;
                    kuroapp.get(kuroapp.current_path);
                    // kuroapp.pagingNextImage();
                    // kuroapp.derpHardre();
                    // kuroapp.log("length of data: " + kuroapp.current_results.length);
                    // target = kuroapp.current_results[0];
                    // kuroapp.log("next image: " + target.id);
                    // kuroapp.loadFullImage(target);
                    break;


                } else {
                    kuroapp.log("next image: " + target.id);
                    kuroapp.loadFullImage(target);
                    break;


                };
            };
        };
    },

    update_image: function() {
        var target = kuroapp.current_results[0];
        kuroapp.loadFullImage(target);
    },

    pagingPreviousImage: function() {
        kuroapp.log("getting previous image");
        kuroapp.log("current image: " + kuroapp.current_image);

        for( var i = 0; i < kuroapp.current_results.length; i++) {
            var r = kuroapp.current_results[i];
            // kuroapp.log(r.id);
            if (r.id == kuroapp.current_image) {
                kuroapp.log("found image: " + r.id);
                var target_image = i--;
                kuroapp.log("previous image: " + kuroapp.current_results[target_image--].id);

                kuroapp.loadFullImage(kuroapp.current_results[target_image--]);
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

    post: function(url) {
        $.post(url, kuroapp.onPostSuccess);
    },

    onPostSuccess: function(data) {
        kuroapp.log("Post result: " + JSON.stringify(data));
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
        };

        kuroapp.log("current data len: " + data.length);
        for( var i = 0; i < data.length; i++) {
            var d = data[i];
            kuroapp.log(d.id);
            kuroapp.updateImageList(d);
        };
    },

    refreshMainPage: function() {
        $("#imageListMain").empty();
        kuroapp.get(kuroapp.current_path);
        kuroapp.activateMainApp();
    },

    updateImageList: function(imageData) {
        kuroapp.log("adding {{id}} to imageListMain".replace("{{id}}", imageData.id));
        var newImage = '<img id="{{id}}" src="{{preview_url}}" alt="use id here later" />'
        var imageLine = newImage.replace("{{preview_url}}", kuroapp.formatFullURL(imageData.preview_file_url));
        imageLine = imageLine.replace("{{id}}", imageData.id);
        $("#imageListMain").append(imageLine);
        document.getElementById(imageData.id).addEventListener("click", kuroapp.loadFullImage.bind(null, imageData), false);
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
        $("#deviceListRatchet").append(imageLine);
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
        document.getElementById("top-nav-button-next").addEventListener("click", kuroapp.pagingNextMain, false);
        document.getElementById("top-nav-button-next").removeEventListener("click", kuroapp.pagingNextImage, false);

        // setup paging buttons for previous
        document.getElementById("top-nav-button-previous").addEventListener("click", kuroapp.pagingPreviousMain, false);
        document.getElementById("top-nav-button-previous").removeEventListener("click", kuroapp.pagingPreviousImage, false);
        document.addEventListener("backbutton", kuroapp.onBackKeyDownMainScreen, false);

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
        document.getElementById("top-nav-button-next").addEventListener("click", kuroapp.pagingNextImage, false);

        // setup paging buttons for previous
        document.getElementById("top-nav-button-previous").removeEventListener("click", kuroapp.pagingPreviousMain, false);
        document.getElementById("top-nav-button-previous").addEventListener("click", kuroapp.pagingPreviousImage, false);

        // document.getElementById("top-nav-button-previous").addEventListener("click", kuroapp.pagingPreviousMain, false);


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
