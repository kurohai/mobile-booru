/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.getElementById("obj_id").addEventListener("click", this.startKordovaTemplateApp, false);
        document.getElementById("activate-main").addEventListener("click", kuroapp.activateMainApp, false);
        document.getElementById("activate-scan").addEventListener("click", kuroapp.activateScanApp, false);
        document.getElementById("activate-debug").addEventListener("click", kuroapp.activateDebugApp, false);
    },

    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        kuroapp.init();
        kuroapp.screenMain = document.getElementById("main-app");
        kuroapp.screenScan = document.getElementById("image-app");
        kuroapp.screenDebug = document.getElementById("debug-app");
        kuroapp.get("http://danbooru.donmai.us/posts.json");
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        // var parentElement = document.getElementById(id);
        // var listeningElement = parentElement.querySelector('.listening');
        // var receivedElement = parentElement.querySelector('.received');
        // listeningElement.setAttribute('style', 'display:none;');
        // receivedElement.setAttribute('style', 'display:block;');
        kuroapp.log('Received Event: ' + id);
    },

    startKordovaTemplateApp: function() {
        // onclick callback to initialize ble and start scan
        kuroapp.log("inside app button event");
        kuroapp.refreshMainPage();
        // kuroapp.get("http://danbooru.donmai.us/posts.json");
    },



};


app.initialize();
