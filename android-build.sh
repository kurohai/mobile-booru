#!/usr/bin/env bash


if [ -e ./env ];
then
    source ./env
else
    export JAVA_HOME=/opt/android-studio/jre/
    export ANDROID_SDK_ROOT=/mnt/data/code/android/sdk/
    export ANDROID_HOME=/mnt/data/code/android/sdk/
fi

cordova prepare android --verbose

/opt/android-studio/plugins/android/lib/templates/gradle/wrapper/gradlew \
    cdvBuildDebug \
    -b /mnt/data/code/mobile-booru/platforms/android/build.gradle \
    -Dorg.gradle.daemon=true \
    -Dorg.gradle.jvmargs=-Xmx2048m \
    -Pandroid.useDeprecatedNdk=true \
    --stacktrace

    # --upload-file /mnt/data/code/cadmob/platforms/android/app/build/outputs/apk/debug/app-debug.apk \

#curl \
#    --upload-file /mnt/data/code/mobile-booru/platforms/android/build/outputs/apk/android-debug.apk \
#    -u "${PHONE_FTP_USERNAME}":"${PHONE_FTP_PASSWORD}" \
#    ftp://"${PHONE_FTP_IP}":"${PHONE_FTP_PORT}"/mobile-booru-debug-$(date +%Y-%m-%d-%H%M%S).apk
