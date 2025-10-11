# 📱 How to Build and Install Jetsetterss APK

## 🚀 **Method 1: EAS Build (Recommended)**

EAS Build is the easiest way to create APK files without setting up Android SDK locally.

### **Step 1: Install EAS CLI**
```bash
npm install -g @expo/cli
```

### **Step 2: Login to Expo**
```bash
npx expo login
```

### **Step 3: Build APK**
```bash
# For development/testing
npx eas build --platform android --profile preview

# For production
npx eas build --platform android --profile production
```

### **Step 4: Download APK**
- EAS will provide a download link
- Download the APK file to your computer
- Transfer to Android device and install

---

## 🔧 **Method 2: Local Build (Advanced)**

### **Prerequisites:**
- Android Studio installed
- Android SDK configured
- ANDROID_HOME environment variable set

### **Step 1: Install Android SDK**
```bash
# Install Android Studio from https://developer.android.com/studio
# Set ANDROID_HOME environment variable
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### **Step 2: Build APK Locally**
```bash
# Generate native Android project
npx expo prebuild --platform android

# Build APK
cd android
./gradlew assembleRelease

# APK will be in: android/app/build/outputs/apk/release/
```

---

## 📲 **Method 3: Expo Go (Development Only)**

### **For Testing During Development:**
1. Install **Expo Go** app from Google Play Store
2. Run `npm start` in your project
3. Scan QR code with Expo Go app
4. App runs directly in Expo Go (no APK needed)

---

## 📋 **Installation Steps**

### **On Android Device:**

1. **Enable Unknown Sources:**
   - Go to Settings > Security > Unknown Sources (enable)
   - Or Settings > Apps > Special Access > Install Unknown Apps

2. **Transfer APK:**
   - Copy APK file to device via USB, email, or cloud storage
   - Or download directly on device

3. **Install APK:**
   - Open file manager and locate APK file
   - Tap to install
   - Follow installation prompts

4. **Launch App:**
   - Find "Jetsetterss" in app drawer
   - Tap to launch

---

## ⚙️ **Build Profiles Explained**

### **Development Profile:**
- Includes debugging tools
- Larger file size
- For development testing

### **Preview Profile:**
- Optimized for testing
- Smaller than development
- Good for internal testing

### **Production Profile:**
- Fully optimized
- Smallest file size
- Ready for Play Store

---

## 🔐 **Signing APK for Production**

### **For Play Store Release:**
```bash
# Generate keystore
keytool -genkey -v -keystore jetsetterss-key.keystore -alias jetsetterss -keyalg RSA -keysize 2048 -validity 10000

# Configure signing in eas.json
{
  "build": {
    "production": {
      "android": {
        "buildType": "apk",
        "credentialsSource": "local"
      }
    }
  }
}
```

---

## 📊 **APK File Locations**

### **EAS Build:**
- Download link provided after build completion
- Usually ~20-50MB file size

### **Local Build:**
- `android/app/build/outputs/apk/release/app-release.apk`
- `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 🐛 **Troubleshooting**

### **Common Issues:**

1. **"App not installed" error:**
   - Check if device has enough storage
   - Ensure APK is not corrupted
   - Try uninstalling previous version first

2. **"Unknown sources" error:**
   - Enable installation from unknown sources
   - Check device security settings

3. **Build fails:**
   - Check internet connection
   - Verify Expo account login
   - Check app.json configuration

### **Performance Tips:**
- Use production build for best performance
- Test on multiple Android versions
- Check app permissions after installation

---

## 📱 **Testing Checklist**

- [ ] App launches successfully
- [ ] Navigation works properly
- [ ] Authentication flow works
- [ ] API calls function correctly
- [ ] UI displays properly on different screen sizes
- [ ] Performance is acceptable
- [ ] No crashes during normal usage

---

**Ready to build your APK! Choose the method that works best for your setup.**



