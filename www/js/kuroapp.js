var kuroapp = {
    init: function() {
        this.base_url = "http://danbooru.donmai.us";
        this.log(this.template_dir);
        this.log("KuroApp starting...");
        this.bindEvents();
        this.log("KuroApp initialized!");
    },

    bindEvents: function() {
        // body
        $("#oop-btn-01").on("click", kuroapp.hello);
    },

    hello: function() {
        kuroapp.log("Connecting...");
    },

    setName: function(input) {
        // body...
        alert("setting name attribute");
        kuroapp.name = input;
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
        $.get(url, kuroapp.onGetSuccess);
        kuroapp.log("starting get request");
        kuroapp.log("get request done?");
    },

    onGetSuccess: function(data) {
        // kuroapp.log("Get result: " + JSON.stringify(data));
        for( var i = 0; i < data.length; i++) {
            var d = data[i];
            kuroapp.log(d.id);
            kuroapp.updateImageList(d);
        };

    },
    refreshMainPage: function() {

    },


    updateImageList: function(imageData) {
        kuroapp.log("adding {{id}} to imageListMain".replace("{{id}}", imageData.id));
        var newImage = '<div class="image-thumb"><img id="{{id}}" src="{{preview_url}}" alt="use id here later"></div>'
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
        var newImage = '<img id="img-{{id}}" src="{{file_url}}" alt="use id here later" />'
        var imageLine = newImage.replace("{{file_url}}", imageData.url);
        imageLine = imageLine.replace("{{id}}", imageData.id);
        kuroapp.log("full image loading " + imageData.url);
        // $("#deviceListRatchet").append(imageLine);
        // $("#img-" + imageData.id).css("back")
        // kuroapp.doStuffWithImage(imageData);
        kuroapp.setBackroundImage(imageData);
    },

    setBackroundImage: function(imageData) {
        $(".app").css('background-image', 'url(' + imageData.url + ')');
        $(".app").css('background-repeat', 'no-repeat');
        $(".app").css('background-size', 'contain');
        kuroapp.activateScanApp();
        // $("#img-" + imageData.id).css('background-image', 'url(' + imageData.url + ')');
        // $("#img-" + imageData.id).css('background-repeat', 'no-repeat');
        // $("#img-" + imageData.id).css('background-size', 'contain');
        // background-image: url("path/to/img");
        // background-repeat: no-repeat;
        // background-size: contain;


    },

    doStuffWithImage: function(imageData) {
        kuroapp.log("doing stuff with image " + imageData.url);
        var myScroll;
        options = {
            zoom: true,
            scrollX: true,
            scrollY: true,
            mouseWheel: true,
            wheelAction: 'zoom'
        };
        myScroll = new IScroll('.iscroll-wrapper', options);
    },

    activateMainApp: function() {
        // body...
        kuroapp.log("activating main app");
        kuroapp.screenMain.setAttribute('style', 'display: block;');
        kuroapp.screenScan.setAttribute('style', 'display: none;');
        kuroapp.screenDebug.setAttribute('style', 'display: none;');
        $("#activate-main").addClass("active");
        $("#activate-scan").removeClass("active");
        $("#activate-debug").removeClass("active");
    },

    activateScanApp: function() {
        // body...
        kuroapp.log("activating scan app");
        kuroapp.screenMain.setAttribute('style', 'display: none;');
        kuroapp.screenScan.setAttribute('style', 'display: block;');
        kuroapp.screenDebug.setAttribute('style', 'display: none;');
        $("#activate-main").removeClass("active");
        $("#activate-scan").addClass("active");
        $("#activate-debug").removeClass("active");
    },

    activateDebugApp: function() {
        // body...
        kuroapp.log("activating debug app");
        kuroapp.screenMain.setAttribute('style', 'display: none;');
        kuroapp.screenScan.setAttribute('style', 'display: none;');
        kuroapp.screenDebug.setAttribute('style', 'display: block;');
        $("#activate-main").removeClass("active");
        $("#activate-scan").removeClass("active");
        $("#activate-debug").addClass("active");
    },

}
