
Android Bundle
--------------

./gradlew clean

curl "http://localhost:8081/index.android.bundle?platform=android&dev=false&minify=true" -o "android/app/src/main/assets/index.android.bundle"

cd android && ./gradlew assembleRelease && ./gradlew installRelease && cd ..


generate key
------------

keytool -genkey -v -keystore recipes.keystore -storepass extra -alias ricette -keyalg RSA -keysize 2048 -validity 10000

mv recipes.keystore android/app/recipes.keystore 