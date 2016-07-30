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
            kuroapp.disableSwipe();
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
