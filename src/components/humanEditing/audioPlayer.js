import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  LinearProgress,
  Slider,
  Typography,
  Tooltip,
  useTheme,
  styled,
  tooltipClasses,
} from '@mui/material';
import FolderSvg from '@/menu-icons/folder';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ListIcon from '@mui/icons-material/List';
import VolumeMuteIcon from '@mui/icons-material/VolumeMute';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import PauseIcon from '@mui/icons-material/Pause';
import Hls from 'hls.js';
import { getByStreamKey } from '@/services/event.service';
const AudioPlayer = ({
  stream,
  setPlay,
  setTotalTime,
  audioPlayerTime,
  setAudioPlayerTime,
}) => {
  const router = useRouter();
  const [fileName, setFileName] = useState('');
  const theme = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0); // Current time in seconds
  const [duration, setDuration] = useState(0); // Total duration in seconds
  const [volume, setVolume] = useState(50); // Default volume 50%
  const [isMuted, setIsMuted] = useState(false); // Mute state
  const [playbackRate, setPlaybackRate] = useState(1);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipValue, setTooltipValue] = useState(currentTime);
  const [hoverTime, setHoverTime] = useState(null); // State to store hovered time
  const [hoverPosition, setHoverPosition] = useState(null); // State to store hover position
  const [count, setCount] = useState(0);
  const [matchingEvent, setMatchingEvent] = useState(null);

  const audioRef = useRef(null);
  const hlsRef = useRef(null); // Hls instance reference
  useEffect(() => {
    if (!router.isReady) return; // Ensures router is ready before accessing pathname

    const pathnameComponents = router.asPath.split('/');
    setFileName(pathnameComponents[2]); // Update fileName when route changes
  }, [router.asPath, router.isReady]); // Triggers re-run when URL changes

  useEffect(() => {
    const fetchEvent = async () => {
      const event = await getByStreamKey(fileName);
      setMatchingEvent(event);
    };
    if (fileName) {
      fetchEvent();
    }
  }, [fileName]);

  useEffect(() => {
    setProgress(0); // Reset progress when stream changes
    setCurrentTime(0); // Reset current time when stream changes
    setAudioPlayerTime(0); // Reset audio

    const streamUrl = `http://deskvantage.com:8083/rt/event/stream/${matchingEvent?.streamFileId}`;

    if (stream && matchingEvent) {
      if (Hls.isSupported()) {
        hlsRef.current = new Hls({
          manifestLoadingMaxRetry: 5,
          manifestLoadingTimeOut: 30000,
          fragLoadingTimeOut: 30000,
          fragLoadingMaxRetry: 3,
          levelLoadingMaxRetry: 3,
          enableWorker: true,
          startPosition: 0,
          xhrSetup: function (xhr, url) {
            const fileName = url.split('/').pop();
            const newUrl = `http://deskvantage.com:8083/rt/event/stream/${fileName}`;
            xhr.open('GET', newUrl, true);
            xhr.setRequestHeader(
              'Authorization',
              `Bearer ${localStorage.getItem('accessToken')}`
            );
          },
        });

        hlsRef.current.loadSource(streamUrl);
        hlsRef.current.attachMedia(audioRef.current);

        hlsRef.current.on(Hls.Events.MANIFEST_PARSED, () => {
          hlsRef.current.startLevel = 0;
          audioRef.current.currentTime = 0;
          setDuration(audioRef.current.duration || 0);
        });

        hlsRef.current.on(Hls.Events.LEVEL_LOADED, (event, data) => {
          setDuration(data.details.totalduration);
          setTotalTime(data.details.totalduration);
        });

        const updateProgress = () => {
          if (audioRef.current.duration) {
            setProgress(
              (audioRef.current.currentTime / audioRef.current.duration) * 100
            );
            setCurrentTime(audioRef.current.currentTime);
            setAudioPlayerTime(audioRef.current.currentTime);
          }
        };

        const audio = audioRef.current;
        audio.addEventListener('timeupdate', updateProgress);

        return () => {
          if (hlsRef.current) {
            hlsRef.current.destroy();
            hlsRef.current = null;
          }
          audio.removeEventListener('timeupdate', updateProgress);
        };
      } else if (
        audioRef.current.canPlayType('application/vnd.apple.mpegurl')
      ) {
        audioRef.current.src = stream;
      }
    }
  }, [stream, fileName, matchingEvent]); // Added allEvents as a dependency
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  }, [fileName]); // Ensure it resets when the stream changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const freezeAudio = () => {
      if (count === 0) {
        audio.currentTime = 0; // Force the audio to stay at 0
      }
    };

    if (count === 0) {
      audio.currentTime = 0;
      audio.pause(); // Make sure it stays paused
      audio.addEventListener('timeupdate', freezeAudio);
    } else {
      audio.removeEventListener('timeupdate', freezeAudio);
    }

    return () => {
      audio.removeEventListener('timeupdate', freezeAudio);
    };
  }, [count]); // Runs when count changes

  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      setPlay(false);
    } else {
      if (count === 0) {
        setAudioPlayerTime(0);
      }
      audio.play();
      setPlay(true);
      setCount((prevCount) => prevCount + 1);
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = isMuted ? 0 : volume / 100;
  }, [volume, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    audio.playbackRate = playbackRate; // Adjust playback rate whenever it changes
  }, [playbackRate]);

  useEffect(() => {
    if (
      audioRef.current &&
      Math.abs(audioPlayerTime - audioRef.current.currentTime) > 1
    ) {
      audioRef.current.currentTime = audioPlayerTime;
      // setCurrentTime(audioPlayerTime);
    }
  }, [audioPlayerTime]);
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
    if (newValue > 0) {
      setIsMuted(false); // Unmute if volume is increased
    }
  };

  const increaseSpeed = () => {
    if (playbackRate < 2) {
      setPlaybackRate(playbackRate + 0.5);
    }
  };

  const decreaseSpeed = () => {
    if (playbackRate > 0.5) {
      setPlaybackRate(playbackRate - 0.5);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const handleProgressChange = (event, newValue) => {
    setProgress(newValue);
    const audio = audioRef.current;
    audio.currentTime = (newValue / 100) * audio.duration;
  };

  const handleMouseMove = (event) => {
    const sliderRect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - sliderRect.left;
    const newHoverPosition = (offsetX / sliderRect.width) * 100;
    const newHoverTime = (offsetX / sliderRect.width) * duration;
    setHoverPosition(newHoverPosition);
    setHoverTime(newHoverTime);
  };

  const handleMouseLeave = () => {
    setHoverTime(null);
  };

  const skipForward = () => {
    const audio = audioRef.current;
    if (audio) {
      const newTime = Math.min(audio.currentTime + 10, audio.duration); // Ensure it doesn't exceed the total duration
      audio.currentTime = newTime;
      setCurrentTime(newTime); // Update the current time state
    }
  };

  const rewind = () => {
    const audio = audioRef.current;
    if (audio) {
      const newTime = Math.max(audio.currentTime - 10, 0); // Ensure it doesn't go below 0
      audio.currentTime = newTime;
      setCurrentTime(newTime); // Update the current time state
    }
  };

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Slider
          // valueLabelDisplay="auto"
          getAriaValueText={(value) => formatTime((value / 100) * duration)}
          valueLabelFormat={(value) => formatTime((value / 100) * duration)}
          sx={{
            color: '#4489FE',
            height: 8,
            marginBottom: '0px',
            marginTop: '-18px',
            '& .MuiSlider-thumb': {
              width: 10,
              height: 10,
              backgroundColor: '#4489FE',
              border: '2px solid #4489FE',
              '&:hover': {
                boxShadow: '0 0 0 8px rgba(68, 137, 254, 0.16)',
              },
            },
            '& .MuiSlider-valueLabel': {
              backgroundColor: 'white',
              color: 'black',
              border: '1px solid gray',
            },
            '& .MuiSlider-track': {
              height: 4,
              borderRadius: 4,
            },
            '& .MuiSlider-rail': {
              height: 4,
              borderRadius: 4,
              backgroundColor: '#ECE9E9',
            },
          }}
          value={progress}
          onChange={(event, newValue) => {
            handleProgressChange(event, newValue);
          }}
          onMouseMove={handleMouseMove} // Add hover detection
          onMouseLeave={handleMouseLeave} // Hide tooltip on mouse leave
          aria-label="Audio Progress"
        />
        {hoverTime !== null && (
          <Tooltip
            open={true}
            title={formatTime(hoverTime)}
            placement="top"
            arrow
            PopperProps={{
              disablePortal: true,
            }}
            style={{
              position: 'absolute',
              left: `${hoverPosition}%`,
              transform: 'translateX(-50%)',
            }}
            componentsProps={{
              tooltip: {
                sx: {
                  backgroundColor: 'white',
                  color: 'black',
                  fontSize: 13,
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.4)',
                  padding: '10px',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-8px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    borderWidth: '8px',
                    borderStyle: 'solid',
                    borderColor: 'white transparent transparent transparent',
                  },
                },
              },
              arrow: {
                sx: {
                  color: 'white',
                },
              },
            }}
          />
        )}
      </Box>
      <Box
        sx={{
          height: '94px',
          bgcolor: '#FFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 40px',
          marginTop: '-10px',
        }}
      >
        <Box
          sx={{
            flex: 2, // 15% of the width
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          <ListIcon
            sx={{
              fontSize: '50px', // Bigger size
              color: '#4489FE', // Blue color
              backgroundColor: '#CCE4FF', // Light blue background
              padding: '8px', // Padding to create spacing between icon and background
              borderRadius: '15%', // Circular background
              marginRight: '15px', // Adjust gap with FolderSvg
              fontWeight: 900,
            }}
          />
          <Typography sx={{ pr: '13px' }}>
            <FolderSvg />
          </Typography>
          <Typography
            sx={{
              color: '#212121',
              fontWeight: 500,
              fontSize: '14px',
            }}
          >
            Audio_File_1.mp3
          </Typography>
        </Box>

        <Box
          sx={{
            flex: 6, // 70% of the width
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '40px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              marginRight: '40px',
              marginLeft: '-10px',
            }}
          >
            {/* Left Slider */}
            <VolumeMuteIcon
              onClick={toggleMute}
              sx={{
                fontSize: '20px',
                color: 'gray',
                // marginRight: "20px",
              }}
            />
            <Slider
              sx={{
                width: 150,
                marginRight: '10px',
                color: 'gray',
                '& .MuiSlider-thumb': {
                  backgroundColor: '#4489FE',
                  width: 8, // Smaller thumb for thin slider
                  height: 8,
                },
                '& .MuiSlider-track': {
                  backgroundColor: '#4489FE',
                  height: 4, // Thinner track
                },
                '& .MuiSlider-rail': {
                  backgroundColor: '#ECE9E9',
                  height: 4, // Thinner rail
                },
              }}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              aria-label="Audio Progress"
            />
            <VolumeUpIcon
              onClick={toggleMute}
              sx={{
                fontSize: '20px',
                color: 'gray',
                // marginRight: "20px",
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FastRewindIcon
              sx={{
                fontSize: '25px',
                color: 'gray',
                marginRight: '20px',
                cursor: 'pointer',
              }}
              onClick={rewind}
            />
            <Button
              sx={{
                width: '50px',
                minWidth: '40px',
                height: '50px',
                borderRadius: '50%',
                margin: '0 10px',
                backgroundColor: '#4489FE',
                color: '#FFF',
                '&:hover': {
                  backgroundColor: '#3367C1',
                },
              }}
              variant="contained"
              onClick={togglePlay}
            >
              {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </Button>

            <FastForwardIcon
              sx={{
                fontSize: '25px',
                color: 'gray',
                marginLeft: '20px',
                cursor: 'pointer',
              }}
              onClick={skipForward}
            />
          </Box>
          {/* <ReactHlsPlayer
            src="https://cdn.bitmovin.com/content/assets/art-of-motion-dash-hls-progressive/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa-audio-only.m3u8"
            autoPlay={false}
            controls={true}
            width="100%"
          /> */}
          <Typography
            sx={{
              color: '#212121',
              fontWeight: 500,
              fontSize: '14px',
              marginLeft: '40px', // Match gap with slider
            }}
          >
            {formatTime(currentTime)} / {formatTime(duration)}
          </Typography>
        </Box>

        <Box
          sx={{
            flex: 2, // 15% of the width
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '30px',
          }}
        >
          <Typography
            sx={{
              color: '#212121',
              fontWeight: 500,
              fontSize: '14px', // Default size for larger screens
              '@media (max-width: 960px)': {
                fontSize: '10px', // Font size for smaller and medium screens
              },
            }}
          >
            Frames Speed
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '6   0%',
              border: '1px solid #D1D1D1',
              borderRadius: '5px',
            }}
          >
            <Button
              onClick={decreaseSpeed}
              sx={{
                width: '20px', // Set width for -
                backgroundColor: '#F0F0F0',
                color: '#212121',
                fontWeight: 500,
                borderRight: '1px solid #D1D1D1', // Border on the right
                borderRadius: '0px',
                '&:hover': {
                  backgroundColor: '#E0E0E0',
                },
              }}
            >
              -
            </Button>

            <Typography
              sx={{
                width: '50px', // Set width for 0
                textAlign: 'center',
                fontWeight: 500,
                fontSize: '14px',
                color: '#212121',
              }}
            >
              {playbackRate}
            </Typography>

            <Button
              onClick={increaseSpeed}
              sx={{
                width: '20px', // Set width for +
                backgroundColor: '#F0F0F0',
                color: '#212121',
                fontWeight: 500,
                borderRadius: '0px',
                borderLeft: '1px solid #D1D1D1', // Border on the left
                '&:hover': {
                  backgroundColor: '#E0E0E0',
                },
              }}
            >
              +
            </Button>
          </Box>
        </Box>
      </Box>
      <audio ref={audioRef} />
    </>
  );
};

export default AudioPlayer;
