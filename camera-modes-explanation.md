# Camera Modes Explanation

## 📷 **Exposure Mode Settings**

### **Auto (Continuous)**
- **What it does**: Continuously analyzes each frame and automatically adjusts brightness
- **How it works**: Calculates average brightness of the entire frame and adjusts exposure in real-time
- **Best for**: Changing lighting conditions, moving between light and dark areas
- **Technical**: Monitors frame brightness and applies dynamic exposure compensation

### **Single Shot** 
- **What it does**: Calculates optimal exposure once and locks it
- **How it works**: Uses the first few frames to set exposure, then keeps it constant
- **Best for**: Stable lighting conditions, preventing exposure "hunting"
- **Technical**: Sets exposure based on initial analysis, no further adjustments

### **Manual**
- **What it does**: Uses only your manual exposure compensation setting
- **How it works**: Applies your exact +/- exposure setting without any automatic adjustments
- **Best for**: When you know exactly how bright you want the image
- **Technical**: Pure manual control, no automatic algorithms

---

## ⚪ **White Balance Mode Settings**

### **Auto (Continuous)**
- **What it does**: Continuously corrects color temperature for natural-looking colors
- **How it works**: Analyzes average R/G/B values per frame and normalizes color cast
- **Best for**: Mixed lighting (fluorescent + daylight), changing color temperatures
- **Technical**: Real-time color temperature correction based on frame analysis

### **Single Shot**
- **What it does**: Sets white balance once based on the scene, then locks it
- **How it works**: Uses initial frames to calculate color correction, then applies consistently
- **Best for**: Consistent lighting conditions, avoiding color shifts during recording
- **Technical**: One-time calibration, prevents white balance "hunting"

### **Manual**  
- **What it does**: No automatic color correction - uses raw camera colors
- **How it works**: Bypasses all white balance algorithms
- **Best for**: When you want the natural color cast, or will color-correct in post-production
- **Technical**: No color temperature processing applied

---

## 📊 **ISO Setting (Sensor Sensitivity)**

### **Auto**
- Uses default sensor sensitivity, optimized for current lighting

### **100-6400**  
- **ISO 100**: Lowest noise, darkest image, best for bright conditions
- **ISO 800**: Good balance for indoor lighting
- **ISO 1600**: Higher sensitivity for dim conditions, some noise
- **ISO 3200**: High sensitivity for dark environments, noticeable noise
- **ISO 6400**: Maximum sensitivity for very dark scenes, significant noise

**Higher ISO = Brighter image but more noise/grain**

---

## 🎯 **Recommended Combinations**

### **Indoor/Office Lighting**
- Exposure: Auto (Continuous)
- White Balance: Auto (Continuous) 
- ISO: 800-1600

### **Outdoor/Daylight**
- Exposure: Single Shot
- White Balance: Single Shot
- ISO: 100-400

### **Very Dark/Night**
- Exposure: Manual (+2.0)
- White Balance: Manual
- ISO: 3200-6400
- Enable Night Mode Boost

### **Mixed Lighting**
- Exposure: Auto (Continuous)
- White Balance: Auto (Continuous)
- ISO: Auto

### **Studio/Controlled**
- Exposure: Manual (your preference)
- White Balance: Single Shot
- ISO: 100-800

---

## 🔧 **Technical Implementation**

Our system implements these modes through real-time pixel processing:

1. **Auto Exposure**: Calculates frame brightness average and adjusts
2. **White Balance**: Normalizes color channels based on scene analysis  
3. **ISO**: Multiplies brightness based on sensitivity setting
4. **Integration**: All modes work together for professional results

The processing happens at 30fps on every single pixel for broadcast-quality enhancement.