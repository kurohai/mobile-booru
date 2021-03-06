# Mobile Booru

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/0371b7c4cd0c4aef996cd3000c8af753)](https://www.codacy.com/app/kurohai/mobile-booru?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=kurohai/mobile-booru&amp;utm_campaign=Badge_Grade)

## Overview

A small booru image viewer. Supports any danbooru forked image board with json api.

## Release 0.1.0 Beta

[Mobile Booru v0.1.1](./build/com.kurohai.mobilebooru-0.1.1.apk)

## Release 0.1.1 Beta

[Mobile Booru v0.1.0 Beta](./build/com.kurohai.mobilebooru-0.1.0.apk)

## To-Do


### Version 0.1.1

1. find all differences in api types
1. add api detection
1. create api model
1. move all api specific code to api class methods
1. try fixed width thumbnail size


### Later

1. keyboard shortcuts
1. find a way to handle videos
1. deactivate prev and next buttons on settings page
1. create model for json responses
    1. one for each api type
    1. Zenbooru (全ボール) is a client for image boards implementing the Gelbooru v0.2, Danbooru (v1 & v2) and Moebooru APIs and supporting booru.org sites.
    - Gelbooru v0.2
    - Danbooru (v1 & v2)
    - Moebooru
    - booru.org
    - e621.net - partial support tested
1. create settings page
    1. add base url change option in settings
    1. add api change based on base url
    1. auto screen rotate option in settings
1. add user login
1. load full image in higher resolution


### API Object

- Each API type will subclass an APIObject
- Each parameter in the API that is used will be mapped to a common name
- Find a method of accurately fingerprinting an api type based off of json fields

```javascript
var api = {
    init() {
    // init stuff
    this.id = 0;
    this.url_file = "";
    this.url_large_file = "";
    this.url_preview = "";
    this.tags = [];
    this.author = "";
    this.date_created = ""; // convert to datetime object with class method
    this.date_other stuff = "";
    },
}

```

### Done

1. change .app width in css
1. add swipe for paging on main page
1. refresh main page function
    1. remove all images from main page
    1. populate with most recent thumbs
1. add swipe for paging on main page
1. add swipe for next image
1. reflow main page thumbs into grid 3x6
1. Create new logo and icons
1. change default baseurl to SFW booru
1. add base url change option in settings
1. release version 0.1.0
1. fix settings screen
1. feature disable swipeleft and swiperight while scale != 1
1. pinch to zoom page 2 images
    1. [hammer.js for pinch to zoom and swipe](http://hammerjs.github.io/)
    1. [this is neat css](http://bl.ocks.org/mbostock/35964711079355050ff1)
    1. [p2z in css3](http://stackoverflow.com/questions/10802176/pinch-to-zoom-with-css3)
    1. jquery mobile option
    1. [viewport docs](https://developer.mozilla.org/en-US/docs/Mozilla/Mobile/Viewport_meta_tag)
1. add baseurl setting
1. add list images per page setting
1. add tag search setting
1. save settings in persist
