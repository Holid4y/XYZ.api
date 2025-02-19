document.addEventListener('DOMContentLoaded', () => {
    const videoPlayer = document.querySelector('.video-player');
    const progressBarContainer = document.querySelector('.video-progress-bar-container');
    const progressBar = document.querySelector('.video-progress-bar');
    const progressLoaded = document.querySelector('.progress-loaded');
    const playBtn = document.querySelector('.play-btn');
    const playIcon = document.querySelector('#play-btn');
    const pauseIcon = document.querySelector('#pause-btn');
    const volumeBtn = document.querySelector('.volume-btn');
    const volumeIcons = {
        mute: document.querySelector('#volume-mute'),
        min: document.querySelector('#volume-min'),
        mid: document.querySelector('#volume-mid'),
        max: document.querySelector('#volume-max')
    };
    const currentTime = document.querySelector('.video-time-current');
    const duration = document.querySelector('.video-time-duration');
    const fullscreenBtn = document.querySelector('.fullscreen-btn');
    const fullscreenIcon = document.querySelector('#fullscreen-icon');
    const fullscreenIconExit = document.querySelector('#fullscreen-icon-exit');
    const volumeContainer = document.querySelector('.volume-container');
    const volumeSliderContainer = document.querySelector('.volume-slider-container');
    const videoContainer = document.querySelector('.video-fluid');
    const controlsTop = videoContainer.querySelector('.controls-top');
    const controlsBottom = videoContainer.querySelector('.controls-bottom');
    const videoLoading = document.querySelector('.video-loading');
    const previewImage = document.querySelector('.preview-image');
    const videoInfoBlock = document.querySelector('.video-info-block');
    const videoInfoTime = document.querySelector('.video-info-time');
    const videoInfoVolume = document.querySelector('.video-info-volume');

    let isVolumeDragging = false;
    let hideTimeout;
    let lastVolume = 1; // Сохраняем последнее значение громкости
    let mouseTimer;
    let lastMousePosition = { x: 0, y: 0 };
    const MOUSE_THRESHOLD = 2;
    let isFirstMove = true;

    // Format time in MM:SS
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // Update volume icon based on level
    const updateVolumeIcon = (value) => {
        Object.values(volumeIcons).forEach(icon => icon.style.display = 'none');
        
        if (value > 66) {
            volumeIcons.max.style.display = 'block';
        } else if (value > 33) {
            volumeIcons.mid.style.display = 'block';
        } else if (value > 0) {
            volumeIcons.min.style.display = 'block';
        } else {
            volumeIcons.mute.style.display = 'block';
        }
    };

    // Toggle play/pause
    const togglePlay = () => {
        if (videoPlayer.paused) {
            videoPlayer.play();
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        } else {
            videoPlayer.pause();
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        }
    };

    // Event Listeners
    playBtn.addEventListener('click', () => {
        togglePlay();
    });

    // Space bar to toggle play/pause
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && document.activeElement.tagName !== 'BUTTON') {
            e.preventDefault();
            togglePlay();
        }
    });

    // Arrow keys for seeking and volume control
    document.addEventListener('keydown', (e) => {
        switch(e.code) {
            case 'ArrowLeft':
                videoPlayer.currentTime = Math.max(videoPlayer.currentTime - 5, 0);
                break;
            case 'ArrowRight':
                videoPlayer.currentTime = Math.min(videoPlayer.currentTime + 5, videoPlayer.duration);
                break;
            case 'ArrowUp':
                videoPlayer.volume = Math.min(videoPlayer.volume + 0.1, 1);
                updateVolumeIcon(videoPlayer.volume * 100);
                break;
            case 'ArrowDown':
                videoPlayer.volume = Math.max(videoPlayer.volume - 0.1, 0);
                updateVolumeIcon(videoPlayer.volume * 100);
                break;
        }
    });

    // Volume control with mouse wheel
    volumeBtn.addEventListener('wheel', (e) => {
        e.preventDefault();
        const currentVolume = videoPlayer.volume * 100;
        let newVolume;
        
        if (e.deltaY < 0) {
            newVolume = Math.min(currentVolume + 5, 100);
        } else {
            newVolume = Math.max(currentVolume - 5, 0);
        }
        
        videoPlayer.volume = newVolume / 100;
        updateVolumeSlider(newVolume);
    });

    // Update volume slider when muting
    volumeBtn.addEventListener('click', (e) => {
        // Проверяем, был ли клик на ползунке или его контейнере
        if (e.target.closest('.volume-slider-container')) {
            return;
        }
        
        if (videoPlayer.volume > 0) {
            lastVolume = videoPlayer.volume;
            videoPlayer.volume = 0;
            updateVolumeSlider(0);
        } else {
            videoPlayer.volume = lastVolume;
            updateVolumeSlider(lastVolume * 100);
        }
    });

    // Обновление прогресса воспроизведения
    videoPlayer.addEventListener('timeupdate', () => {
        const percent = (videoPlayer.currentTime / videoPlayer.duration) * 100;
        progressBar.value = percent;
        progressBarContainer.style.setProperty('--progress', `${percent}%`);
        currentTime.textContent = formatTime(videoPlayer.currentTime);
    });

    // Обновление прогресса загрузки
    videoPlayer.addEventListener('progress', () => {
        if (videoPlayer.buffered.length > 0) {
            const bufferedEnd = videoPlayer.buffered.end(videoPlayer.buffered.length - 1);
            const duration = videoPlayer.duration;
            progressLoaded.style.width = `${(bufferedEnd / duration) * 100}%`;
        }
    });

    // Перемотка видео
    progressBar.addEventListener('input', () => {
        const time = (progressBar.value / 100) * videoPlayer.duration;
        videoPlayer.currentTime = time;
    });

    // Update duration when metadata is loaded
    videoPlayer.addEventListener('loadedmetadata', () => {
        duration.textContent = formatTime(videoPlayer.duration);
        // Set initial volume to 75%
        videoPlayer.volume = 0.75;
        updateVolumeSlider(75);
    });

    // Fullscreen handling
    fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            videoPlayer.parentElement.requestFullscreen();
            fullscreenIcon.style.display = 'none';
            fullscreenIconExit.style.display = 'block';
        } else {
            document.exitFullscreen();
            fullscreenIcon.style.display = 'block';
            fullscreenIconExit.style.display = 'none';
        }
    });

    // Update fullscreen icon when fullscreen changes
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            fullscreenIcon.style.display = 'block';
            fullscreenIconExit.style.display = 'none';
        }
    });

    volumeContainer.addEventListener('mouseenter', () => {
        clearTimeout(hideTimeout);
        volumeSliderContainer.style.display = 'block';
        setTimeout(() => {
            volumeSliderContainer.style.opacity = '1';
        }, 0);
    });

    volumeContainer.addEventListener('mouseleave', (e) => {
        // Проверяем, не навели ли мы на слайдер
        if (!e.relatedTarget?.closest('.volume-slider-container')) {
            hideTimeout = setTimeout(() => {
                volumeSliderContainer.style.opacity = '0';
                setTimeout(() => {
                    volumeSliderContainer.style.display = 'none';
                }, 300);
            }, 2000);
        }
    });

    volumeSliderContainer.addEventListener('mouseleave', (e) => {
        // Проверяем, не навели ли мы обратно на кнопку
        if (!e.relatedTarget?.closest('.volume-container')) {
            hideTimeout = setTimeout(() => {
                volumeSliderContainer.style.opacity = '0';
                setTimeout(() => {
                    volumeSliderContainer.style.display = 'none';
                }, 300);
            }, 2000);
        }
    });

    // Update volume slider fill and value
    const updateVolumeSlider = (value) => {
        const volumeSlider = volumeSliderContainer.querySelector('.volume-slider');
        const volumeSliderWrapper = volumeSliderContainer.querySelector('.volume-slider-wrapper');
        volumeSlider.value = value;
        volumeSliderWrapper.style.setProperty('--volume', `${value}%`);
        updateVolumeIcon(value);
    };

    volumeSliderContainer.querySelector('.volume-slider').addEventListener('input', (e) => {
        e.stopPropagation();
        const value = e.target.value;
        videoPlayer.volume = value / 100;
        lastVolume = videoPlayer.volume;
        updateVolumeSlider(value);
    });

    // Initialize volume slider
    updateVolumeSlider(videoPlayer.volume * 100);

    // Update volume slider when using arrow keys or wheel
    document.addEventListener('keydown', (e) => {
        switch(e.code) {
            case 'ArrowUp':
                videoPlayer.volume = Math.min(videoPlayer.volume + 0.1, 1);
                updateVolumeSlider(videoPlayer.volume * 100);
                break;
            case 'ArrowDown':
                videoPlayer.volume = Math.max(videoPlayer.volume - 0.1, 0);
                updateVolumeSlider(videoPlayer.volume * 100);
                break;
        }
    });

    // Update loaded progress
    videoPlayer.addEventListener('progress', () => {
        if (videoPlayer.buffered.length > 0) {
            const bufferedEnd = videoPlayer.buffered.end(videoPlayer.buffered.length - 1);
            const duration = videoPlayer.duration;
            progressLoaded.style.width = `${(bufferedEnd / duration) * 100}%`;
        }
    });

    // Update loaded progress every 500ms
    setInterval(() => {
        if (videoPlayer.buffered.length > 0) {
            const bufferedEnd = videoPlayer.buffered.end(videoPlayer.buffered.length - 1);
            const duration = videoPlayer.duration;
            progressLoaded.style.width = `${(bufferedEnd / duration) * 100}%`;
        }
    }, 500);

    const showControls = () => {
        controlsTop.style.opacity = '1';
        controlsBottom.style.opacity = '1';
        videoContainer.style.cursor = 'default';
    };

    const hideControls = () => {
        // Проверяем, не находится ли курсор над controls
        if (!controlsTop.matches(':hover') && !controlsBottom.matches(':hover')) {
            controlsTop.style.opacity = '0';
            controlsBottom.style.opacity = '0';
            videoContainer.style.cursor = 'none';
        }
    };

    const resetTimer = () => {
        clearTimeout(mouseTimer);
        showControls();
        // Запускаем таймер только если курсор не над controls
        if (!controlsTop.matches(':hover') && !controlsBottom.matches(':hover')) {
            mouseTimer = setTimeout(hideControls, 2000);
        }
    };

    // Основной обработчик движения мыши
    videoContainer.addEventListener('mousemove', resetTimer);

    // Обработка входа/выхода из плеера
    videoContainer.addEventListener('mouseleave', hideControls);
    videoContainer.addEventListener('mouseenter', resetTimer);

    // Предотвращаем скрытие при наведении на controls
    [controlsTop, controlsBottom].forEach(control => {
        control.addEventListener('mouseenter', () => {
            clearTimeout(mouseTimer);
            showControls();
        });
        
        control.addEventListener('mouseleave', (e) => {
            // Проверяем, что мышь не перешла на другой элемент controls
            if (!e.relatedTarget?.closest('.controls-top') && 
                !e.relatedTarget?.closest('.controls-bottom')) {
                mouseTimer = setTimeout(hideControls, 2000);
            }
        });
    });

    // Add video URL loading functionality
    const videoUrlInput = document.getElementById('video-url');
    const loadVideoButton = document.getElementById('load-video');

    loadVideoButton.addEventListener('click', () => {
        const url = videoUrlInput.value.trim();
        if (url) {
            // Show loading
            videoLoading.style.display = 'flex';
            
            // Load video
            videoPlayer.src = url;
            videoPlayer.load();

            // Reset player state
            progressBar.value = 0;
            progressBarContainer.style.setProperty('--progress', '0%');
            currentTime.textContent = '00:00';
            duration.textContent = '00:00';
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        }
    });

    // Generate video preview
    videoPlayer.addEventListener('loadeddata', () => {
        // Hide loading
        videoLoading.style.display = 'none';
        videoPlayer.style.opacity = '1';
        
        // Create preview
        const canvas = document.createElement('canvas');
        canvas.width = videoPlayer.videoWidth;
        canvas.height = videoPlayer.videoHeight;
        canvas.getContext('2d').drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);
        
        // Set preview image
        previewImage.src = canvas.toDataURL();
    });


    // Show preview when video ends
    videoPlayer.addEventListener('ended', () => {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    });

    // Allow loading video on Enter key press
    videoUrlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            loadVideoButton.click();
        }
    });

    // Add CSS styles
    const style = document.createElement('style');
    document.head.appendChild(style);

    // Double click handler for fullscreen toggle
    const doubleClickThreshold = 300; // milliseconds

    function createClicker(clickFn, dblClickFn) {
        let timer;

        return function (event) {
            const context = this;

            if (timer) {
                clearTimeout(timer);
                dblClickFn.call(context, event);
                timer = null;
                return;
            }

            timer = setTimeout(function () {
                timer = null;
                clickFn.call(context, event);
            }, doubleClickThreshold);
        }
    }

    const handleSingleClick = () => {
        togglePlay();
    };

    const handleDoubleClick = () => {
        if (!document.fullscreenElement) {
            videoContainer.requestFullscreen();
            fullscreenIcon.style.display = 'none';
            fullscreenIconExit.style.display = 'block';
        } else {
            document.exitFullscreen();
            fullscreenIcon.style.display = 'block';
            fullscreenIconExit.style.display = 'none';
        }
    };

    // Add click handler only to video player
    videoPlayer.addEventListener('click', createClicker(handleSingleClick, handleDoubleClick));

    // Показ времени при наведении на прогресс-бар
    progressBar.addEventListener('mousemove', (e) => {
        const percent = (e.offsetX / progressBar.offsetWidth) * 100;
        const time = (videoPlayer.duration * percent) / 100;
        videoInfoBlock.style.display = 'block';
        videoInfoTime.style.display = 'inline';
        videoInfoTime.textContent = formatTime(time);
    });

    progressBar.addEventListener('mouseout', () => {
        videoInfoBlock.style.display = 'none';
        videoInfoTime.style.display = 'none';
    });

    // Показ громкости при наведении на слайдер громкости
    const volumeSlider = volumeSliderContainer.querySelector('.volume-slider');
    volumeSlider.addEventListener('mousemove', (e) => {
        const rect = volumeSlider.getBoundingClientRect();
        const percent = ((rect.bottom - e.clientY) / rect.height) * 100;
        videoInfoBlock.style.display = 'block';
        videoInfoVolume.style.display = 'inline';
        videoInfoVolume.textContent = `${Math.round(percent)}%`;
    });

    volumeSlider.addEventListener('mouseout', () => {
        videoInfoBlock.style.display = 'none';
        videoInfoVolume.style.display = 'none';
    });
});