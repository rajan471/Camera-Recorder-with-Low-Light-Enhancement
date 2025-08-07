# High-Quality Audio/Video Recorder

A professional-grade web-based audio and video recorder that captures content at the highest possible quality using modern browser APIs.

## Features

### 🎥 Recording Modes
- **Video + Audio**: Record camera with microphone (up to 4K resolution)
- **Audio Only**: High-fidelity audio recording (up to 48kHz stereo)
- **Screen + Audio**: Screen recording with system and microphone audio

### 🔧 Quality Settings

#### Video Quality
- **Resolutions**: 4K (3840×2160), 1440p, 1080p, 720p
- **Frame Rates**: 60fps, 30fps, 24fps
- **Bitrate**: Adjustable from 1-50 Mbps
- **Codecs**: VP9, VP8, H.264 (browser dependent)

#### Audio Quality
- **Sample Rates**: 48kHz, 44.1kHz, 22kHz
- **Channels**: Stereo, Mono
- **Bitrate**: Adjustable from 64-320 kbps
- **Advanced**: Echo cancellation, noise suppression, auto gain control

### 💾 Recording Management
- **Real-time Preview**: Live camera/screen preview during setup
- **Recording Controls**: Start, Pause/Resume, Stop
- **Timer**: Accurate recording duration display
- **File Management**: Download, play, and delete recordings
- **Persistent Storage**: Recordings list saved locally

### 🌟 Advanced Features
- **Multi-source Audio**: Combines system and microphone audio for screen recordings
- **Browser Compatibility**: Automatic codec selection for optimal quality
- **Responsive Design**: Works on desktop and mobile devices
- **Professional UI**: Modern, intuitive interface with visual feedback
- **Error Handling**: Comprehensive error messages and status updates

## Usage

1. **Open the Application**
   - Open `index.html` in a modern web browser
   - Grant camera/microphone permissions when prompted

2. **Configure Quality Settings**
   - Select desired video resolution and frame rate
   - Adjust video and audio bitrates for quality vs. file size
   - Choose audio sample rate and channel configuration

3. **Select Recording Mode**
   - **Video + Audio**: Standard camera recording
   - **Audio Only**: Microphone-only recording
   - **Screen + Audio**: Screen capture with audio

4. **Start Recording**
   - Click "Start Recording" button
   - Monitor the timer and recording indicator
   - Use pause/resume as needed

5. **Stop and Save**
   - Click "Stop" to end recording
   - Download immediately or access from recordings list
   - Recordings are saved with timestamps and quality metadata

## Technical Specifications

### Supported Formats
- **Video**: WebM (VP9/VP8), MP4 (H.264)
- **Audio**: WebM (Opus), MP4 (AAC), MP3

### Maximum Quality Limits
- **Video**: Up to 4K resolution at 60fps
- **Audio**: Up to 48kHz stereo at 320kbps
- **Bitrate**: Up to 50 Mbps for video, 320 kbps for audio

### Browser Requirements
- **Chrome/Edge**: Full support for all features
- **Firefox**: Full support with some codec limitations
- **Safari**: Limited support (no screen recording)

## File Structure

```
/
├── index.html          # Main application interface
├── styles.css          # Professional UI styling
├── recorder.js         # Core recording functionality
└── README.md          # Documentation (this file)
```

## Browser Permissions

The application requires the following permissions:
- **Camera**: For video recording mode
- **Microphone**: For all audio recording
- **Screen Capture**: For screen recording mode

## Quality Optimization Tips

1. **For Maximum Quality**:
   - Use 4K resolution with 60fps for video
   - Set video bitrate to 50 Mbps
   - Use 48kHz stereo audio at 320kbps

2. **For Balanced Quality/Size**:
   - Use 1080p at 30fps
   - Set video bitrate to 8-15 Mbps
   - Use 48kHz stereo audio at 256kbps

3. **For Smaller Files**:
   - Use 720p at 30fps
   - Set video bitrate to 3-5 Mbps
   - Use 44.1kHz audio at 128kbps

## Troubleshooting

### Common Issues
- **No camera/microphone access**: Check browser permissions
- **Recording fails to start**: Ensure latest browser version
- **Poor quality**: Increase bitrate settings
- **Large file sizes**: Reduce resolution or bitrate

### Performance Tips
- Close other applications during recording
- Use Chrome or Edge for best performance
- Ensure adequate storage space
- For long recordings, pause periodically

## Browser Support

| Browser | Video Recording | Audio Recording | Screen Recording |
|---------|----------------|----------------|------------------|
| Chrome  | ✅ Full        | ✅ Full        | ✅ Full          |
| Edge    | ✅ Full        | ✅ Full        | ✅ Full          |
| Firefox | ✅ Full        | ✅ Full        | ✅ Limited       |
| Safari  | ⚠️ Limited     | ✅ Full        | ❌ None          |

## License

This project is open source and available for personal and commercial use.