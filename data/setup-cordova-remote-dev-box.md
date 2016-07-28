
# Setup a Remote Cordova Dev Environment

This will take you step-by-step through the process I use to create a Cordova development environment for Android on CentOS 7.2.
The remote environment allows me to build my Cordova projects using the same JDK, Android SDK, and Cordova versions.
This can be very useful when trying to develop on different computers (laptop and office desktop).
It also provides the ability to use a phone or tablet for developing.
Just push code changes to the build server, run your build scripts, then download your .apk.
I use SFTP or scp depending on what device I am using.


This tutorial is compiled from other separate tutorials referenced at the end.


## Install Java JDK


### Download and install JDK

    cd /opt/
    wget --no-cookies --no-check-certificate --header "Cookie: gpw_e24=http%3A%2F%2Fwww.oracle.com%2F; oraclelicense=accept-securebackup-cookie" "http://download.oracle.com/otn-pub/java/jdk/8u101-b13/jdk-8u101-linux-x64.rpm"
    rpm -ivh ./jdk-8u101-linux-x64.rpm


### Export Java Env Vars

    export JAVA_HOME=/usr/java/jdk1.8.0_101/
    export PATH=$PATH:$JAVA_HOME


<!--
Add java environment profile setup
-->

## Install Android SDK


### Download Latest SDK Tarball

    cd /opt
    wget http://dl.google.com/android/android-sdk_r24.4.1-linux.tgz


### unzip, rename, permissions, symlink

    tar zxvf android-sdk_r24.4.1-linux.tgz
    mv android-sdk-linux android-sdk_r24.4.1-linux
    chown -R root:root android-sdk_r24.4.1-linux
    ln -s android-sdk_r24.4.1-linux android-sdk


### Create SDK environment profile

    nano /etc/profile.d/android-sdk-env.sh


### Add vars to profile

    export ANDROID_HOME="/opt/android-sdk"
    export PATH="$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools:$PATH"


### Load new profile

    source /etc/profile.d/android-sdk-env.sh


### Update SDK

    cd /opt/android-sdk/tools
    ./android update sdk --no-ui


### This is an example.

    /opt/android-sdk/tools/android list sdk --all
    /opt/android-sdk/tools/android update sdk -u -a -t 1,2,5,28,102,137,138,144


## References and Thanks
<!-- Add reference links -->
