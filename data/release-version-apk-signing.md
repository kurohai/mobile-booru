
## Release APK Signing

### Create Keystore

    /d/Program Files/Java/jdk1.8.0_101/bin/keytool -genkey -v -keystore kurohai-mobile.keystore -alias KurohaiMobile -keyalg RSA -keysize 2048 -validity 10000

### Sign APK with Keystore

    cd /d/Dropbox/git/mobile-booru/platforms/android/build/outputs/apk
    /d/Program\ Files/Java/jdk1.8.0_101/bin/jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore kurohai-mobile.keystore android-release-unsigned.apk KurohaiMobile
    /c/Program\ Files/Java/jdk1.8.0_31/bin/jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore kurohai-mobile.keystore android-release-unsigned.apk KurohaiMobile

### Zipalign APK

    /c/Users/root/AppData/Local/Android/sdk/build-tools/23.0.3/zipalign -v 4 android-release-unsigned.apk com.kurohai.mobilebooru.apk
    /c/Users/root/AppData/Local/Android/sdk/build-tools/23.0.1/zipalign -v 4 android-release-unsigned.apk com.kurohai.mobilebooru.apk
