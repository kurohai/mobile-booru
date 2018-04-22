# AdMob Mobile Booru #


## Ad Unit Settings ##

|               AdMob App ID               |   Ad Unit Name   | Ad Format |               Ad Unit ID               |              Ad type               | Automatic refresh | eCPM floor |
|------------------------------------------|------------------|-----------|----------------------------------------|------------------------------------|-------------------|------------|
| `ca-app-pub-1225122818360214~5065268548` | banner-bottom-01 | Banner    | ca-app-pub-1225122818360214/7810851384 | Text, image, and rich media, Video | Google optimized  | Disabled   |
|                                          |                  |           |                                        |                                    |                   |            |


## Instructions ##


**Follow these instructions:**

1. Complete the instructions in the Google Mobile Ads SDK guide using this app ID:
    1. Mobile Booru `ca-app-pub-1225122818360214~5065268548`
1. Follow the banner implementation guide to integrate the SDK. You'll specify ad type, size, and placement when you integrate the code using this ad unit ID:
    1. banner-bottom-01 `ca-app-pub-1225122818360214/7810851384`
1. Review the AdMob policies to ensure your implementation complies.


> Note: If you haven't created an AdMob account and registered an app yet, now's a great time to do so. If you're just looking to experiment with the SDK in a Hello World app, though, you can use this App ID to initialize the SDK: `ca-app-pub-3940256099942544~3347511713`.


## Install Cordova Plugins ##

- [Monetizing Your PhoneGap Build App with AdMob](https://www.joshmorony.com/monetizing-your-phonegap-build-app-with-admob/) 
    + [Google AdMob Cordova GitHub](https://github.com/admob-google/admob-cordova)

- [Integrate Google Ads In Apache Cordova Mobile Apps](https://www.spritle.com/blogs/2016/07/20/google-ads-mobile-application-using-cordova/)
- [Cordova AdMob Pro](https://github.com/floatinghotpot/cordova-admob-pro)
    + [Difference of Plugin ID](https://github.com/floatinghotpot/cordova-admob-pro/wiki/Difference-of-Plugin-IDs)



https://www.joshmorony.com/games/source/candy-crush-tutorial/index.html


## Testing ##

```bash
# test cordova-plugin-admobpro

cordova create ./admob-pro-test com.kurohai.mobile.admobprotest AdMobProTest
cd ./admob-pro-test/

cordova platform add android
cordova platform add browser
cordova plugin add cordova-plugin-admobpro --save

rm -r www/*
cp plugins/cordova-plugin-admobpro/test/* www/

cordova prepare
cordova run android
cordova run browser


# test cordova-plugin-admob-free

cordova create ./cordova-plugin-admob-free com.kurohai.mobile.cordovapluginadmobfree CordovaPluginAdmobFree
cd ./cordova-plugin-admob-free

cordova platform add android
cordova platform add browser

cordova plugin add cordova-plugin-admob-free --save

rm -r ./www/ ./plugins/ ./.idea/ 
rsync -havt plugins/cordova-plugin-admob-free/examples/basic/* ./
rsync -havt ./examples/basic/ ../../

cordova prepare
cordova run browser
cordova run android

```
