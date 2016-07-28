

### Install Latest Java JDK

    cd /opt/
    wget --no-cookies --no-check-certificate --header "Cookie: gpw_e24=http%3A%2F%2Fwww.oracle.com%2F; oraclelicense=accept-securebackup-cookie" "http://download.oracle.com/otn-pub/java/jdk/8u101-b13/jdk-8u101-linux-x64.rpm"
    rpm -ivh ./jdk-8u101-linux-x64.rpm


### Export Java Env Vars

    export JAVA_HOME=/usr/java/jdk1.8.0_101/
    export PATH=$PATH:$JAVA_HOME


