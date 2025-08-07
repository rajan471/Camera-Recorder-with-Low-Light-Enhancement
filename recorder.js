/**
 * High-Quality Audio/Video Recorder
 * Professional-grade recording with advanced quality settings
 */

class HighQualityRecorder {
    constructor() {
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this.stream = null;
        this.isRecording = false;
        this.isPaused = false;
        this.startTime = null;
        this.timerInterval = null;
        this.currentRecording = null;
        this.recordings = JSON.parse(localStorage.getItem('recordings') || '[]');
        
        // Initialize UI elements
        this.initializeElements();
        this.attachEventListeners();
        this.updateBitrateDisplays();
        this.updateExposureDisplay();
        this.renderRecordings();
    }

    initializeElements() {
        // Control buttons
        this.previewBtn = document.getElementById('previewBtn');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        
        // Preview and indicators
        this.preview = document.getElementById('preview');
        this.previewCanvas = document.getElementById('previewCanvas');
        this.canvasContext = this.previewCanvas.getContext('2d', { 
            willReadFrequently: true,
            alpha: false 
        });
        this.recordingIndicator = document.getElementById('recordingIndicator');
        this.enhancementIndicator = document.getElementById('enhancementIndicator');
        this.timer = document.getElementById('timer');
        this.previewPlaceholder = document.getElementById('previewPlaceholder');
        
        // Video processing
        this.animationId = null;
        this.isProcessingVideo = false;
        this.isPreviewActive = false;
        this.enhancedStream = null;
        
        // Settings
        this.videoBitrate = document.getElementById('videoBitrate');
        this.audioBitrate = document.getElementById('audioBitrate');
        this.videoBitrateValue = document.getElementById('videoBitrateValue');
        this.audioBitrateValue = document.getElementById('audioBitrateValue');
        this.videoResolution = document.getElementById('videoResolution');
        this.videoFramerate = document.getElementById('videoFramerate');
        this.audioSampleRate = document.getElementById('audioSampleRate');
        this.audioChannels = document.getElementById('audioChannels');
        
        // Low Light Enhancement Settings
        this.lowLightMode = document.getElementById('lowLightMode');
        this.exposureMode = document.getElementById('exposureMode');
        this.exposureCompensation = document.getElementById('exposureCompensation');
        this.exposureValue = document.getElementById('exposureValue');
        this.whiteBalanceMode = document.getElementById('whiteBalanceMode');
        this.iso = document.getElementById('iso');
        this.nightMode = document.getElementById('nightMode');
        this.noiseReduction = document.getElementById('noiseReduction');
        
        // Recording mode
        this.recordingModes = document.querySelectorAll('input[name="recordingMode"]');
        
        // Status and recordings
        this.statusMessage = document.getElementById('statusMessage');
        this.recordingsList = document.getElementById('recordingsList');
    }

    attachEventListeners() {
        // Control buttons
        this.previewBtn.addEventListener('click', () => this.togglePreview());
        this.startBtn.addEventListener('click', () => this.startRecording());
        this.pauseBtn.addEventListener('click', () => this.pauseRecording());
        this.stopBtn.addEventListener('click', () => this.stopRecording());
        this.downloadBtn.addEventListener('click', () => this.downloadRecording());
        
        // Bitrate sliders
        this.videoBitrate.addEventListener('input', () => this.updateBitrateDisplays());
        this.audioBitrate.addEventListener('input', () => this.updateBitrateDisplays());
        
        // Low Light Enhancement controls
        this.exposureCompensation.addEventListener('input', () => this.updateExposureDisplay());
        this.lowLightMode.addEventListener('change', () => this.onLowLightToggle());
        this.nightMode.addEventListener('change', () => this.onNightModeToggle());
        this.exposureMode.addEventListener('change', () => this.onExposureSettingsChange());
        this.whiteBalanceMode.addEventListener('change', () => this.onExposureSettingsChange());
        this.iso.addEventListener('change', () => this.onExposureSettingsChange());
        this.noiseReduction.addEventListener('change', () => this.onExposureSettingsChange());
        
        // Recording mode change
        this.recordingModes.forEach(mode => {
            mode.addEventListener('change', () => this.onModeChange());
        });
    }

    updateBitrateDisplays() {
        this.videoBitrateValue.textContent = this.videoBitrate.value;
        this.audioBitrateValue.textContent = this.audioBitrate.value;
    }

    updateExposureDisplay() {
        const value = this.exposureCompensation.value;
        this.exposureValue.textContent = value > 0 ? `+${value}` : value;
    }

    onLowLightToggle() {
        const isEnabled = this.lowLightMode.checked;
        const selectedMode = document.querySelector('input[name="recordingMode"]:checked').value;
        
        if (isEnabled) {
            this.showStatus('Low light mode enabled - optimizing for dark environments', 'info');
            // Auto-adjust settings for low light
            this.exposureCompensation.value = '1.0';
            this.updateExposureDisplay();
            
            // Only start processing if preview is active and not audio mode
            if (this.isPreviewActive && selectedMode !== 'audio' && this.preview.readyState >= 2) {
                this.startVideoProcessing();
                setTimeout(() => this.switchToCanvas(), 100);
            } else if (this.isPreviewActive && selectedMode !== 'audio') {
                // Wait for video to be ready
                const waitForVideo = () => {
                    if (this.preview.readyState >= 2) {
                        this.startVideoProcessing();
                        setTimeout(() => this.switchToCanvas(), 100);
                    } else {
                        setTimeout(waitForVideo, 100);
                    }
                };
                waitForVideo();
            }
        } else {
            this.showStatus('Low light mode disabled', 'info');
            this.exposureCompensation.value = '0';
            this.updateExposureDisplay();
            this.stopVideoProcessing();
            
            // Switch back to regular video if preview is active
            if (this.isPreviewActive && selectedMode !== 'audio') {
                this.switchToVideo();
            }
        }
    }

    onNightModeToggle() {
        const isEnabled = this.nightMode.checked;
        const selectedMode = document.querySelector('input[name="recordingMode"]:checked').value;
        
        if (isEnabled) {
            this.showStatus('Night mode boost enabled - maximum sensitivity', 'info');
            // Auto-set extreme low light settings
            this.lowLightMode.checked = true;
            this.exposureCompensation.value = '2.0';
            this.iso.value = '3200';
            this.exposureMode.value = 'continuous';
            this.updateExposureDisplay();
            
            // Start processing if preview is active and not audio mode
            if (this.isPreviewActive && selectedMode !== 'audio' && this.preview.readyState >= 2) {
                this.startVideoProcessing();
                setTimeout(() => this.switchToCanvas(), 100);
            } else if (this.isPreviewActive && selectedMode !== 'audio') {
                // Wait for video to be ready
                const waitForVideo = () => {
                    if (this.preview.readyState >= 2) {
                        this.startVideoProcessing();
                        setTimeout(() => this.switchToCanvas(), 100);
                    } else {
                        setTimeout(waitForVideo, 100);
                    }
                };
                waitForVideo();
            }
        } else {
            this.showStatus('Night mode boost disabled', 'info');
            
            // If low light is also disabled, switch back to video
            if (!this.lowLightMode.checked && this.isPreviewActive && selectedMode !== 'audio') {
                this.stopVideoProcessing();
                this.switchToVideo();
            }
        }
    }

    onExposureSettingsChange() {
        if (this.lowLightMode.checked || this.nightMode.checked) {
            this.showStatus('Low light settings updated', 'info');
        }
    }

    startVideoProcessing() {
        if (this.isProcessingVideo) return;
        
        console.log('Starting video processing...');
        this.isProcessingVideo = true;
        
        // Give the video a moment to be ready
        setTimeout(() => {
            this.processVideoFrame();
        }, 100);
    }

    stopVideoProcessing() {
        console.log('Stopping video processing');
        this.isProcessingVideo = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        // Clear canvas
        if (this.previewCanvas && this.canvasContext) {
            this.canvasContext.clearRect(0, 0, this.previewCanvas.width, this.previewCanvas.height);
        }
    }

    processVideoFrame() {
        if (!this.isProcessingVideo) {
            return;
        }

        // Check if video is ready and playing
        if (!this.preview.videoWidth || !this.preview.videoHeight || 
            this.preview.readyState < 2 || this.preview.paused) {
            console.log('Video not ready:', {
                width: this.preview.videoWidth,
                height: this.preview.videoHeight,
                readyState: this.preview.readyState,
                paused: this.preview.paused
            });
            this.animationId = requestAnimationFrame(() => this.processVideoFrame());
            return;
        }

        // Set canvas size to match video
        const videoWidth = this.preview.videoWidth;
        const videoHeight = this.preview.videoHeight;
        
        if (this.previewCanvas.width !== videoWidth || this.previewCanvas.height !== videoHeight) {
            this.previewCanvas.width = videoWidth;
            this.previewCanvas.height = videoHeight;
            console.log(`Canvas resized to: ${videoWidth}x${videoHeight}`);
        }

        try {
            // Clear canvas first
            this.canvasContext.clearRect(0, 0, videoWidth, videoHeight);
            
            // Draw the current video frame
            this.canvasContext.drawImage(this.preview, 0, 0, videoWidth, videoHeight);
            
            // Log frame drawing for debugging
            if (Math.random() < 0.01) { // Log occasionally
                console.log('Drew video frame at:', Date.now());
            }

            // Apply low light enhancements
            if (this.lowLightMode.checked || this.nightMode.checked) {
                this.applyLowLightEnhancements();
            }
        } catch (error) {
            console.error('Error processing video frame:', error);
            // Fall back to regular video on error
            this.switchToVideo();
            return;
        }

        // Continue processing
        this.animationId = requestAnimationFrame(() => this.processVideoFrame());
    }

    applyLowLightEnhancements() {
        // Apply REAL pixel-level enhancements to the stream data
        try {
            const imageData = this.canvasContext.getImageData(0, 0, this.previewCanvas.width, this.previewCanvas.height);
            const data = imageData.data;
            
            // Get enhancement settings
            const exposureCompensation = parseFloat(this.exposureCompensation.value);
            const isNightMode = this.nightMode.checked;
            const noiseReduction = this.noiseReduction.checked;
            const exposureMode = this.exposureMode.value;
            const whiteBalanceMode = this.whiteBalanceMode.value;
            const isoSetting = this.iso.value;
            
            // Calculate enhancement factors
            let brightnessFactor = 1.0 + (exposureCompensation * 0.4);
            const contrastFactor = isNightMode ? 1.5 : 1.3;
            let gamma = isNightMode ? 0.6 : 0.7; // Lower gamma brightens dark areas
            
            // Apply ISO setting (simulated sensor sensitivity)
            let isoMultiplier = 1.0;
            if (isoSetting !== 'auto') {
                const isoValue = parseInt(isoSetting);
                isoMultiplier = Math.sqrt(isoValue / 100); // ISO 100 = baseline
            }
            brightnessFactor *= isoMultiplier;
            
            // Auto-exposure calculation (for continuous mode)
            let autoExposureAdjustment = 1.0;
            if (exposureMode === 'continuous') {
                // Calculate average brightness of frame
                let totalBrightness = 0;
                for (let i = 0; i < data.length; i += 4) {
                    totalBrightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
                }
                const avgBrightness = totalBrightness / (data.length / 4);
                
                // Auto-adjust exposure based on average brightness
                if (avgBrightness < 80) {
                    autoExposureAdjustment = 1.3; // Brighten dark scenes
                } else if (avgBrightness > 180) {
                    autoExposureAdjustment = 0.9; // Darken bright scenes
                }
            }
            
            // White balance calculation
            let whiteBalanceR = 1.0, whiteBalanceG = 1.0, whiteBalanceB = 1.0;
            if (whiteBalanceMode === 'continuous' || whiteBalanceMode === 'single-shot') {
                // Calculate average color temperature
                let avgR = 0, avgG = 0, avgB = 0;
                for (let i = 0; i < data.length; i += 4) {
                    avgR += data[i];
                    avgG += data[i + 1];
                    avgB += data[i + 2];
                }
                const pixelCount = data.length / 4;
                avgR /= pixelCount;
                avgG /= pixelCount;
                avgB /= pixelCount;
                
                // Auto white balance - normalize to green channel
                if (avgG > 0) {
                    whiteBalanceR = avgG / Math.max(avgR, 1);
                    whiteBalanceB = avgG / Math.max(avgB, 1);
                    // Clamp adjustments
                    whiteBalanceR = Math.min(1.3, Math.max(0.8, whiteBalanceR));
                    whiteBalanceB = Math.min(1.3, Math.max(0.8, whiteBalanceB));
                }
            }
            
            // Process every pixel in the video frame
            for (let i = 0; i < data.length; i += 4) {
                let r = data[i];
                let g = data[i + 1];
                let b = data[i + 2];
                
                // Apply white balance correction first
                r = r * whiteBalanceR;
                g = g * whiteBalanceG;
                b = b * whiteBalanceB;
                
                // Gamma correction - brighten dark areas more than bright areas
                r = 255 * Math.pow(r / 255, gamma);
                g = 255 * Math.pow(g / 255, gamma);
                b = 255 * Math.pow(b / 255, gamma);
                
                // Apply exposure adjustments
                const finalBrightness = brightnessFactor * autoExposureAdjustment;
                r = r * finalBrightness;
                g = g * finalBrightness;
                b = b * finalBrightness;
                
                // Contrast enhancement around midpoint
                const midpoint = 128;
                r = ((r - midpoint) * contrastFactor) + midpoint;
                g = ((g - midpoint) * contrastFactor) + midpoint;
                b = ((b - midpoint) * contrastFactor) + midpoint;
                
                // Night mode special processing
                if (isNightMode) {
                    // Boost shadows more aggressively
                    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
                    if (luminance < 100) {
                        const shadowBoost = 1.6;
                        r *= shadowBoost;
                        g *= shadowBoost;
                        b *= shadowBoost;
                    }
                    
                    // Enhance the brightest channel for better detail
                    const maxChannel = Math.max(r, g, b);
                    if (maxChannel > 80) {
                        const boost = 1.2;
                        if (r === maxChannel || Math.abs(r - maxChannel) < 10) r *= boost;
                        if (g === maxChannel || Math.abs(g - maxChannel) < 10) g *= boost;
                        if (b === maxChannel || Math.abs(b - maxChannel) < 10) b *= boost;
                    }
                }
                
                // Noise reduction for very dark pixels
                if (noiseReduction) {
                    const pixelBrightness = (r + g + b) / 3;
                    if (pixelBrightness < 40) {
                        // Smooth very dark pixels
                        const smoothFactor = 1.15;
                        r = Math.min(r * smoothFactor, 255);
                        g = Math.min(g * smoothFactor, 255);
                        b = Math.min(b * smoothFactor, 255);
                    }
                }
                
                // Clamp values to valid range
                data[i] = Math.min(255, Math.max(0, Math.round(r)));
                data[i + 1] = Math.min(255, Math.max(0, Math.round(g)));
                data[i + 2] = Math.min(255, Math.max(0, Math.round(b)));
                // Alpha channel (data[i + 3]) stays unchanged
            }
            
            // Put the enhanced data back to canvas
            this.canvasContext.putImageData(imageData, 0, 0);
            
            if (Math.random() < 0.002) { // Log occasionally
                console.log('Applied real pixel enhancement:', {
                    brightness: brightnessFactor,
                    autoExposure: autoExposureAdjustment,
                    whiteBalance: { r: whiteBalanceR, g: whiteBalanceG, b: whiteBalanceB },
                    contrast: contrastFactor,
                    gamma: gamma,
                    iso: isoMultiplier,
                    nightMode: isNightMode
                });
            }
            
        } catch (error) {
            console.error('Enhancement processing error:', error);
        }
    }
    


    async togglePreview() {
        if (this.isPreviewActive) {
            this.stopPreview();
        } else {
            await this.startPreview();
        }
    }

    async startPreview() {
        try {
            this.showStatus('Starting camera preview...', 'info');
            
            // Get media stream for preview
            this.stream = await this.getMediaStream();
            
            // Set up preview
            const selectedMode = document.querySelector('input[name="recordingMode"]:checked').value;
            if (selectedMode !== 'audio') {
                this.preview.srcObject = this.stream;
                this.previewPlaceholder.style.display = 'none';
                
                // Start video processing if low light mode is enabled
                this.preview.onloadeddata = () => {
                    console.log('Video loaded, dimensions:', this.preview.videoWidth, 'x', this.preview.videoHeight);
                };
                
                // Use playing event instead for better timing
                this.preview.onplaying = () => {
                    console.log('Video is playing, ready for processing');
                    if (this.lowLightMode.checked || this.nightMode.checked) {
                        setTimeout(() => {
                            this.startVideoProcessing();
                            this.switchToCanvas();
                        }, 300);
                    }
                };
            } else {
                this.previewPlaceholder.style.display = 'none';
                this.showStatus('Audio preview active', 'success');
            }
            
            this.isPreviewActive = true;
            this.previewBtn.innerHTML = '<i class="fas fa-eye-slash"></i> Stop Preview';
            this.startBtn.disabled = false;
            
            this.showStatus('Camera preview started', 'success');
            
        } catch (error) {
            this.showStatus(`Preview failed: ${error.message}`, 'error');
            console.error('Preview error:', error);
        }
    }

    stopPreview() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        
        if (this.enhancedStream) {
            this.enhancedStream.getTracks().forEach(track => track.stop());
            this.enhancedStream = null;
        }
        
        this.stopVideoProcessing();
        this.preview.srcObject = null;
        this.previewCanvas.style.display = 'none';
        this.preview.style.display = 'block';
        this.previewPlaceholder.style.display = 'flex';
        this.enhancementIndicator.classList.remove('active');
        
        this.isPreviewActive = false;
        this.previewBtn.innerHTML = '<i class="fas fa-eye"></i> Start Preview';
        this.startBtn.disabled = true;
        
        this.showStatus('Preview stopped', 'info');
    }

    switchToCanvas() {
        // Wait for video to be ready before switching
        if (this.preview.readyState < 2 || !this.preview.videoWidth) {
            console.log('Waiting for video to be ready...', this.preview.readyState);
            setTimeout(() => this.switchToCanvas(), 100);
            return;
        }
        
        console.log('Switching to canvas mode', {
            videoWidth: this.preview.videoWidth,
            videoHeight: this.preview.videoHeight,
            readyState: this.preview.readyState
        });
        
        // Make sure video keeps playing in background
        this.preview.play().catch(e => console.log('Video play error:', e));
        
        // Switch display
        this.preview.style.display = 'none';
        this.previewCanvas.style.display = 'block';
        this.enhancementIndicator.classList.add('active');
        
        // Ensure canvas is properly sized and styled
        this.previewCanvas.style.width = '100%';
        this.previewCanvas.style.height = '100%';
        this.previewCanvas.style.objectFit = 'cover';
        
        // Force an initial frame draw
        setTimeout(() => {
            if (this.isProcessingVideo) {
                console.log('Drawing initial canvas frame');
                this.canvasContext.drawImage(this.preview, 0, 0, this.preview.videoWidth, this.preview.videoHeight);
            }
        }, 50);
    }

    switchToVideo() {
        this.previewCanvas.style.display = 'none';
        this.preview.style.display = 'block';
        this.enhancementIndicator.classList.remove('active');
    }

    onModeChange() {
        const selectedMode = document.querySelector('input[name="recordingMode"]:checked').value;
        
        // Update UI for different modes
        this.showStatus(`Switched to ${selectedMode} mode`, 'info');
        
        // If preview is active, restart it with new mode
        if (this.isPreviewActive) {
            this.stopPreview();
            setTimeout(() => this.startPreview(), 500);
        }
    }

    getVideoConstraints() {
        const resolution = this.videoResolution.value;
        const framerate = parseInt(this.videoFramerate.value);
        
        let constraints = {
            frameRate: { ideal: framerate },
            facingMode: 'user'
        };
        
        // Basic resolution settings
        switch (resolution) {
            case '4K':
                constraints.width = { ideal: 3840 };
                constraints.height = { ideal: 2160 };
                break;
            case '1440p':
                constraints.width = { ideal: 2560 };
                constraints.height = { ideal: 1440 };
                break;
            case '1080p':
                constraints.width = { ideal: 1920 };
                constraints.height = { ideal: 1080 };
                break;
            case '720p':
                constraints.width = { ideal: 1280 };
                constraints.height = { ideal: 720 };
                break;
        }
        
        // Note: Complex camera constraints are not well supported by most browsers
        // Low-light enhancement is now handled by real-time canvas processing
        
        return constraints;
    }

    getAudioConstraints() {
        const sampleRate = parseInt(this.audioSampleRate.value);
        const channelCount = parseInt(this.audioChannels.value);
        
        return {
            sampleRate: sampleRate,
            channelCount: channelCount,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
        };
    }

    getRecorderOptions() {
        const videoBitrate = parseInt(this.videoBitrate.value) * 1000000; // Convert Mbps to bps
        const audioBitrate = parseInt(this.audioBitrate.value) * 1000; // Convert kbps to bps
        const selectedMode = document.querySelector('input[name="recordingMode"]:checked').value;
        
        let mimeType = '';
        let options = {};
        
        if (selectedMode === 'audio') {
            // Audio-only recording with highest quality
            if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
                mimeType = 'audio/webm;codecs=opus';
            } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
                mimeType = 'audio/mp4';
            } else {
                mimeType = 'audio/webm';
            }
            options.audioBitsPerSecond = audioBitrate;
        } else {
            // Video recording with highest quality
            if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')) {
                mimeType = 'video/webm;codecs=vp9,opus';
            } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')) {
                mimeType = 'video/webm;codecs=vp8,opus';
            } else if (MediaRecorder.isTypeSupported('video/mp4')) {
                mimeType = 'video/mp4';
            } else {
                mimeType = 'video/webm';
            }
            options.videoBitsPerSecond = videoBitrate;
            options.audioBitsPerSecond = audioBitrate;
        }
        
        options.mimeType = mimeType;
        return options;
    }

    async getMediaStream() {
        const selectedMode = document.querySelector('input[name="recordingMode"]:checked').value;
        const audioConstraints = this.getAudioConstraints();
        
        try {
            let stream;
            
            switch (selectedMode) {
                case 'video':
                    stream = await navigator.mediaDevices.getUserMedia({
                        video: this.getVideoConstraints(),
                        audio: audioConstraints
                    });
                    break;
                    
                case 'audio':
                    stream = await navigator.mediaDevices.getUserMedia({
                        audio: audioConstraints
                    });
                    break;
                    
                case 'screen':
                    const screenStream = await navigator.mediaDevices.getDisplayMedia({
                        video: {
                            frameRate: { ideal: parseInt(this.videoFramerate.value) }
                        },
                        audio: true
                    });
                    
                    // Add microphone audio if available
                    try {
                        const micStream = await navigator.mediaDevices.getUserMedia({
                            audio: audioConstraints
                        });
                        
                        // Combine screen and microphone audio
                        const audioContext = new AudioContext();
                        const destination = audioContext.createMediaStreamDestination();
                        
                        const screenAudio = audioContext.createMediaStreamSource(screenStream);
                        const micAudio = audioContext.createMediaStreamSource(micStream);
                        
                        screenAudio.connect(destination);
                        micAudio.connect(destination);
                        
                        // Combine video from screen with combined audio
                        const combinedStream = new MediaStream();
                        screenStream.getVideoTracks().forEach(track => combinedStream.addTrack(track));
                        destination.stream.getAudioTracks().forEach(track => combinedStream.addTrack(track));
                        
                        stream = combinedStream;
                    } catch (micError) {
                        // Fallback to screen audio only
                        stream = screenStream;
                    }
                    break;
                    
                default:
                    throw new Error('Invalid recording mode');
            }
            
            return stream;
        } catch (error) {
            throw new Error(`Failed to get media stream: ${error.message}`);
        }
    }

    async startRecording() {
        try {
            this.showStatus('Initializing recording...', 'info');
            
            // Use existing preview stream if available, otherwise get new stream
            if (!this.isPreviewActive) {
                this.stream = await this.getMediaStream();
                
                const selectedMode = document.querySelector('input[name="recordingMode"]:checked').value;
                if (selectedMode !== 'audio') {
                    this.preview.srcObject = this.stream;
                    this.previewPlaceholder.style.display = 'none';
                }
            }
            
            const selectedMode = document.querySelector('input[name="recordingMode"]:checked').value;
            
            // Configure MediaRecorder with highest quality options
            const options = this.getRecorderOptions();
            
            // Use enhanced canvas stream if low light processing is active
            let recordingStream = this.stream;
            if (selectedMode !== 'audio' && (this.lowLightMode.checked || this.nightMode.checked)) {
                console.log('Creating enhanced video stream from canvas');
                
                // Create high-quality stream from processed canvas
                const canvasStream = this.previewCanvas.captureStream(30); // 30 FPS
                
                // Combine enhanced video with original audio
                const combinedStream = new MediaStream();
                
                // Add enhanced video track
                const videoTrack = canvasStream.getVideoTracks()[0];
                if (videoTrack) {
                    combinedStream.addTrack(videoTrack);
                    console.log('Added enhanced video track');
                }
                
                // Add original audio tracks
                this.stream.getAudioTracks().forEach(track => {
                    combinedStream.addTrack(track);
                    console.log('Added original audio track');
                });
                
                recordingStream = combinedStream;
                this.showStatus('Recording enhanced video stream', 'info');
            } else {
                this.showStatus('Recording original stream', 'info');
            }
            
            this.mediaRecorder = new MediaRecorder(recordingStream, options);
            
            // Reset recorded chunks
            this.recordedChunks = [];
            
            // Set up event handlers
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.recordedChunks.push(event.data);
                }
            };
            
            this.mediaRecorder.onstop = () => {
                this.handleRecordingStop();
            };
            
            this.mediaRecorder.onerror = (event) => {
                this.showStatus('Recording error occurred', 'error');
                console.error('MediaRecorder error:', event.error);
            };
            
            // Start recording
            this.mediaRecorder.start(1000); // Collect data every second for better quality
            this.isRecording = true;
            this.startTime = Date.now();
            
            // Update UI
            this.updateControlsState();
            this.startTimer();
            this.recordingIndicator.classList.add('active');
            
            this.showStatus('Recording started successfully!', 'success');
            
        } catch (error) {
            this.showStatus(`Failed to start recording: ${error.message}`, 'error');
            console.error('Start recording error:', error);
        }
    }

    pauseRecording() {
        if (this.mediaRecorder && this.isRecording) {
            if (this.isPaused) {
                this.mediaRecorder.resume();
                this.isPaused = false;
                this.startTimer();
                this.recordingIndicator.classList.add('active');
                this.pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
                this.showStatus('Recording resumed', 'info');
            } else {
                this.mediaRecorder.pause();
                this.isPaused = true;
                this.stopTimer();
                this.recordingIndicator.classList.remove('active');
                this.pauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
                this.showStatus('Recording paused', 'info');
            }
        }
    }

    stopRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;
            this.isPaused = false;
            
            // Stop all tracks
            if (this.stream) {
                this.stream.getTracks().forEach(track => track.stop());
            }
            
            // Update UI
            this.updateControlsState();
            this.stopTimer();
            this.recordingIndicator.classList.remove('active');
            
            // Don't stop preview if it was active before recording
            if (!this.isPreviewActive) {
                this.stopVideoProcessing();
                this.preview.srcObject = null;
                this.previewPlaceholder.style.display = 'flex';
            }
            
            this.showStatus('Recording stopped', 'info');
        }
    }

    handleRecordingStop() {
        const selectedMode = document.querySelector('input[name="recordingMode"]:checked').value;
        const mimeType = this.getRecorderOptions().mimeType;
        const blob = new Blob(this.recordedChunks, { type: mimeType });
        
        // Create recording object
        const recording = {
            id: Date.now(),
            name: `${selectedMode}_recording_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}`,
            blob: blob,
            size: this.formatFileSize(blob.size),
            duration: this.timer.textContent,
            type: selectedMode,
            mimeType: mimeType,
            timestamp: new Date().toLocaleString()
        };
        
        this.currentRecording = recording;
        this.downloadBtn.disabled = false;
        
        // Add to recordings list
        this.recordings.unshift(recording);
        this.saveRecordings();
        this.renderRecordings();
        
        this.showStatus('Recording ready for download!', 'success');
    }

    downloadRecording() {
        if (this.currentRecording) {
            this.downloadBlob(this.currentRecording.blob, this.currentRecording.name);
        }
    }

    downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename + this.getFileExtension(blob.type);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showStatus('Download started!', 'success');
    }

    getFileExtension(mimeType) {
        const extensions = {
            'video/webm': '.webm',
            'video/mp4': '.mp4',
            'audio/webm': '.webm',
            'audio/mp4': '.m4a',
            'audio/mpeg': '.mp3'
        };
        return extensions[mimeType] || '.webm';
    }

    updateControlsState() {
        this.startBtn.disabled = this.isRecording || !this.isPreviewActive;
        this.pauseBtn.disabled = !this.isRecording;
        this.stopBtn.disabled = !this.isRecording;
        this.previewBtn.disabled = this.isRecording;
        
        if (!this.isRecording) {
            this.pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
        }
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            const elapsed = Date.now() - this.startTime;
            this.timer.textContent = this.formatTime(elapsed);
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    saveRecordings() {
        // Save recordings metadata (without blobs) to localStorage
        const recordingsMetadata = this.recordings.map(rec => ({
            ...rec,
            blob: null // Don't save blob data to localStorage
        }));
        localStorage.setItem('recordings', JSON.stringify(recordingsMetadata));
    }

    renderRecordings() {
        if (this.recordings.length === 0) {
            this.recordingsList.innerHTML = '<p class="empty-state">No recordings yet. Start recording to see them here!</p>';
            return;
        }
        
        const recordingsHTML = this.recordings.map(recording => `
            <div class="recording-item" data-id="${recording.id}">
                <div class="recording-info">
                    <div class="recording-name">${recording.name}</div>
                    <div class="recording-details">
                        ${recording.type} • ${recording.duration} • ${recording.size} • ${recording.timestamp}
                    </div>
                </div>
                <div class="recording-actions">
                    ${recording.blob ? `
                        <button class="btn-small btn-play" onclick="recorder.playRecording(${recording.id})">
                            <i class="fas fa-play"></i> Play
                        </button>
                        <button class="btn-small btn-download-item" onclick="recorder.downloadRecordingById(${recording.id})">
                            <i class="fas fa-download"></i> Download
                        </button>
                    ` : `
                        <span style="color: #999; font-size: 0.8rem;">Blob not available</span>
                    `}
                    <button class="btn-small btn-delete" onclick="recorder.deleteRecording(${recording.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
        
        this.recordingsList.innerHTML = recordingsHTML;
    }

    playRecording(id) {
        const recording = this.recordings.find(rec => rec.id === id);
        if (recording && recording.blob) {
            const url = URL.createObjectURL(recording.blob);
            
            if (recording.type === 'audio') {
                const audio = new Audio(url);
                audio.play();
            } else {
                // Open video in new window/tab
                window.open(url, '_blank');
            }
        }
    }

    downloadRecordingById(id) {
        const recording = this.recordings.find(rec => rec.id === id);
        if (recording && recording.blob) {
            this.downloadBlob(recording.blob, recording.name);
        }
    }

    deleteRecording(id) {
        if (confirm('Are you sure you want to delete this recording?')) {
            this.recordings = this.recordings.filter(rec => rec.id !== id);
            this.saveRecordings();
            this.renderRecordings();
            this.showStatus('Recording deleted', 'info');
        }
    }

    showStatus(message, type = 'info') {
        this.statusMessage.textContent = message;
        this.statusMessage.className = `status-message ${type} show`;
        
        setTimeout(() => {
            this.statusMessage.classList.remove('show');
        }, 3000);
    }

    // Check browser compatibility
    checkCompatibility() {
        const issues = [];
        
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            issues.push('getUserMedia not supported');
        }
        
        if (!MediaRecorder) {
            issues.push('MediaRecorder not supported');
        }
        
        if (!navigator.mediaDevices.getDisplayMedia) {
            issues.push('Screen recording not supported');
        }
        
        if (issues.length > 0) {
            this.showStatus(`Browser compatibility issues: ${issues.join(', ')}`, 'error');
        }
        
        return issues.length === 0;
    }
}

// Initialize recorder when page loads
let recorder;

document.addEventListener('DOMContentLoaded', () => {
    recorder = new HighQualityRecorder();
    
    if (!recorder.checkCompatibility()) {
        console.error('Browser not fully compatible with all recording features');
    }
    
    console.log('High-Quality Audio/Video Recorder initialized successfully!');
});