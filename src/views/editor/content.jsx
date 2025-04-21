import { Box, Button, Divider, Typography, TextField, CircularProgress, Alert } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import AdminSettingModal from './settingModal'
import CustomTooltip from '../componenets/customTooltip'
import { getCurrentTimestampInSeconds, routeName } from '@/utils'
import { useRouter } from 'next/router'
import { useAuth } from '@/hooks/useAuth'

// eslint-disable-next-line react/display-name
const WordSpan = React.memo(
  ({
    globalIndex,
    wordRef,
    isActive,
    accessibilitySetting,
    wordWidths,
    boldWidth,
    item,
    selectedWord,
    selectedWordIndex,
    editedWord,
    handleInputChange,
    handleSaveWord,
    handleCurrentTime,
    handleWordClick,
    setEditedWordTs,
    status,
    route,
    suggestClick,
    anchorEl,
  }) => {
    return (
      <span
        key={globalIndex}
        id={`word-${globalIndex}`}
        ref={(el) => (wordRef.current[globalIndex] = el)}
        style={{
          cursor: 'pointer',
          fontWeight: isActive ? 500 : 300,
          display: 'inline-flex',
          fontSize: '13px',
          padding: '0 2px',
          color: isActive ? accessibilitySetting?.restClr || '#4489FE' : '#000000',
          lineHeight: accessibilitySetting?.lineSpacing || '20px',
          minHeight: '22px',
          fontFamily: accessibilitySetting?.fontStyle || 'Roboto',
          width: `${wordWidths[globalIndex]}px`,
          minWidth: `${boldWidth}px`,
        }}
        onClick={() => {
          handleCurrentTime(item.startTime)
          if (
            (status === 'LIVE_CAPTION' || status === 'IN_EDITING') &&
            route === 'admin' &&
            !selectedWord &&
            !selectedWordIndex &&
            !suggestClick &&
            anchorEl !== wordRef.current[globalIndex]
          ) {
            setEditedWordTs(item.ts)
            handleWordClick(globalIndex, item.word)
          }
        }}
      >
        {item.word === selectedWord && selectedWordIndex === globalIndex ? (
          <TextField
            spellCheck
            value={editedWord}
            onChange={handleInputChange}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleSaveWord()
              }
            }}
            onBlur={handleSaveWord}
            variant="standard"
            InputProps={{ disableUnderline: true }}
            sx={{
              fontSize: '13px',
              width: `${editedWord?.length * 7}px`,
            }}
          />
        ) : (
          <span>{item.word}</span>
        )}
        &nbsp;
      </span>
    )
  }
)

function truncateText(text, maxLength) {
  if (text?.length > maxLength) {
    return text?.substring(0, maxLength) + '...'
  }
  return text
}

// eslint-disable-next-line react/display-name
const SpeakerHeader = React.memo(({ adminSetting, speakerTag, accessibilitySetting }) => (
  <Box
    sx={{
      mb: adminSetting?.orientation === 'vertical' ? '20px' : '0',
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
    }}
  >
    <PersonIcon fontSize="large" color={accessibilitySetting?.restClrs || '#4489FE'} />
    <CustomTooltip arrow title={`${speakerTag}`} placement="top">
      <Typography
        sx={{
          width: '75px',
          ml: '7px',
          color: accessibilitySetting?.restClrs || '#4489FE',
          fontWeight: 500,
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: adminSetting?.orientation === 'vertical' ? 'column' : 'row',
        }}
      >
        {truncateText(`${speakerTag}`, 30)}
      </Typography>
    </CustomTooltip>
  </Box>
))

const Content = ({
  lockedWord,
  eventInfo,
  styleList,
  error,
  id,
  confidenceClrs,
  setConfidenceClrs,
  handleSocketMessage,
  data,
  loading,
  status,
  setEditorBgClr,
  play,
  currentTime,
  setCurrentTime,
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(-1)
  const highlightTimerRef = useRef(null)
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const router = useRouter()
  const route = routeName(router?.pathname)
  const [wordsArray, setWordsArray] = useState([])
  const [selectedWordIndex, setSelectedWordIndex] = useState(null)
  const [editorBg, setEditorBg] = useState('#FFFFFF')
  const [selectedWord, setSelectedWord] = useState(null)
  const [highlightedWordIndex, setHighlightedWordIndex] = useState(-1)
  const [editedWord, setEditedWord] = useState('')
  const [editedWordTs, setEditedWordTs] = useState('')
  const [startTime, setStartTime] = useState('')
  const [wordHistory, setWordHistory] = useState([])
  const scrollContainerRef = useRef(null)

  // const wordRef = useRef({});
  const wordRef = useRef([])

  ////////////////////////////////////////////////////////////////
  const [accessibilitySetting, setAccessibilitySetting] = useState({})
  const [adminSetting, setAdminSetting] = useState({ orientation: 'vertical' })
  const parseTime = (timeString) => parseFloat(timeString.replace('s', ''))
  const auth = useAuth()
  const canvasRef = useMemo(() => {
    const canvas = document.createElement('canvas')
    return canvas
  }, [])

  // Helper function to measure text width using the shared canvas
  const measureText = useCallback(
    (text, fontWeight = 300) => {
      const context = canvasRef.getContext('2d')
      const fontSize = 13
      context.font = `${fontWeight} ${fontSize}px Roboto`
      return context.measureText(text).width
    },
    [canvasRef]
  )

  const getWordsArray = useCallback(
    (data) => {
      if (!data) {
        return []
      }
      const currentTimestamp = getCurrentTimestampInSeconds(new Date().toISOString())

      if (typeof data === 'object' && !Array.isArray(data)) {
        return Object.keys(data).flatMap((key) => {
          const item = data[key]
          return [
            {
              ts: item.startTime || currentTimestamp,
              word: item.word,
              startTime: item.startTime || currentTimestamp,
              endTime: item.endTime || currentTimestamp,
              confidence: item.confidence || 1,
              speakerTag: item.speakerTag || 1,
              id: key,
            },
          ]
        })
      }
      return []
    },
    [getCurrentTimestampInSeconds]
  )

  useEffect(() => {
    setWordsArray(getWordsArray(data))
  }, [data, getWordsArray])

  const [suggestClick, setSuggestClick] = useState(false)
  const handleWordClick = useCallback(
    (index, word) => {
      setSelectedWord(word)
      setEditedWord(word)
      setSelectedWordIndex(index)
      const startTime = getCurrentTimestampInSeconds(new Date().toISOString())
      setStartTime(startTime)
    },
    [getCurrentTimestampInSeconds]
  )

  const handleSuggestClick = (index, word) => {
    setSelectedWord(word)
    setEditedWord(word)
    setSelectedWordIndex(index)
    const startTime = getCurrentTimestampInSeconds(new Date().toISOString())
    setStartTime(startTime)
  }
  const handleInputChange = useCallback(
    (event) => {
      setEditedWord(event.target.value)
      handleSocketMessage('lock', editedWordTs)
    },
    [editedWordTs, handleSocketMessage]
  )

  const handleSaveWord = useCallback(() => {
    const createWordData = (newWord, index, baseIndex = 0, existingWordData = null) => ({
      word: newWord,
      ts: existingWordData ? existingWordData.ts : getCurrentTimestampInSeconds(new Date().toISOString()),
      startTime: existingWordData ? existingWordData.startTime : getCurrentTimestampInSeconds(new Date().toISOString()),
      endTime: existingWordData ? existingWordData.endTime : getCurrentTimestampInSeconds(new Date().toISOString()),
      confidence: existingWordData ? existingWordData.confidence : 1,
      speakerTag: existingWordData ? existingWordData.speakerTag : 1,
      id: baseIndex + index,
    })

    if ((editedWord && editedWord?.trim() === '') || editedWord?.trim() === null || editedWord?.trim() === ' ') {
      if (selectedWordIndex !== null) {
        let updatedWords = [...wordsArray]
        updatedWords[selectedWordIndex] = createWordData(
          null,
          selectedWordIndex,
          selectedWordIndex,
          wordsArray[selectedWordIndex]
        )
        setWordHistory((prevHistory) => {
          const existingHistory = prevHistory.filter(
            (historyWord) => historyWord.id !== updatedWords[selectedWordIndex]?.id
          )
          return [...existingHistory, updatedWords[selectedWordIndex]]
        })
        setSelectedWord(null)
        setEditedWord('')
        setSelectedWordIndex(null)
      }
      return
    }

    const editedWords = editedWord.split(/\s+/)
    let updatedWords = [...wordsArray]

    if (selectedWordIndex !== null) {
      const existingWordData = wordsArray[selectedWordIndex]
      updatedWords[selectedWordIndex] = createWordData(
        editedWords.join(' '),
        selectedWordIndex,
        selectedWordIndex,
        existingWordData
      )
    } else {
      updatedWords = editedWords.map((newWord, index) => createWordData(newWord, index))
    }
    setWordHistory((prevHistory) => {
      const existingHistory = prevHistory.filter(
        (historyWord) => historyWord.id !== updatedWords[selectedWordIndex]?.id
      )
      const newHistoryWord = updatedWords[selectedWordIndex]
        ? updatedWords[selectedWordIndex]
        : createWordData(editedWords.join(' '), updatedWords.length)
      return [...existingHistory, newHistoryWord]
    })
    setSelectedWord(null)
    setEditedWord('')
    setSelectedWordIndex(null)
  }, [editedWord, selectedWordIndex, wordsArray])

  useEffect(() => {
    if (wordHistory?.length > 0) {
      handleSocketMessage('update', wordHistory)
      handleSocketMessage('unlock', editedWordTs)
      // handleSocketMessage('sync', null);
      setWordHistory([])
      setEditedWordTs('')
    }
  }, [editedWordTs, handleSocketMessage, wordHistory])

  useEffect(() => {
    if (suggestClick && editedWord) {
      handleSaveWord()
      setSuggestClick(false)
    }
  }, [suggestClick, editedWord, handleSaveWord])

  const [anchorEl, setAnchorEl] = useState(null)
  const [popoverWidth, setPopoverWidth] = useState(100)

  const wordRefs = useRef([])

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget)
    const wordWidth = event.currentTarget.getBoundingClientRect().width
    setPopoverWidth(wordWidth)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }
  const handleAddTextChange = (event) => {
    setEditedWord(event.target.value)
  }
  const getColor = (confidence) => {
    if (Number(confidence) >= 0.9) return adminSetting?.highConfidence
    if (Number(confidence) >= 0.7) return adminSetting?.mediumConfidence
    return adminSetting?.lowConfidence
  }
  const handleCurrentTime = useCallback(
    (time) => {
      const startTime = parseTime(time)
      setCurrentTime(startTime)
    },
    [parseTime]
  )

  useEffect(() => {
    if (!wordsArray.length || currentTime == null) return // Only check currentTime existence

    // Always find active word regardless of play state
    let activeWordIndex = wordsArray.findIndex((word) => {
      const start = parseTime(word.startTime)
      const end = parseTime(word.endTime)
      return currentTime >= start && currentTime < end
    })

    // Find nearest word if no active
    let newHighlightedIndex = activeWordIndex
    if (activeWordIndex === -1) {
      let closestDistance = Infinity
      wordsArray.forEach((word, index) => {
        const start = parseTime(word.startTime)
        const distance = Math.abs(currentTime - start)
        if (distance < closestDistance) {
          closestDistance = distance
          newHighlightedIndex = index
        }
      })
    }

    setHighlightedWordIndex(newHighlightedIndex)

    // Scroll logic (optional - only if you want scrolling when not playing)
    if (wordRef.current[newHighlightedIndex]) {
      wordRef.current[newHighlightedIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      })
    }
  }, [currentTime, wordsArray]) // Removed play from dependencies
  // Helper function to calculate a fixed width based on the text

  const sortedWords = useMemo(() => [...wordsArray].sort((a, b) => new Date(a.ts) - new Date(b.ts)), [wordsArray])

  const speakerGroups = useMemo(() => {
    const groups = []
    let currentGroup = null

    sortedWords.forEach((word, index) => {
      if (!currentGroup || currentGroup.speakerTag !== word.speakerTag) {
        currentGroup = {
          speakerTag: word.speakerTag,
          words: [{ ...word, originalIndex: index }],
        }
        groups.push(currentGroup)
      } else {
        currentGroup.words.push({ ...word, originalIndex: index })
      }
    })
    return groups
  }, [sortedWords])

  const wordWidths = useMemo(() => {
    return wordsArray.map((item) => {
      const normalWidth = measureText(item.word, 300)
      const boldWidth = measureText(item.word, 600)
      return Math.max(normalWidth, boldWidth + 8)
    })
  }, [wordsArray, measureText])
  const RowRender = useCallback(() => {
    return speakerGroups.map((group, groupIndex) => (
      <div key={`${group.speakerTag}-${groupIndex}`} style={{ marginBottom: '20px' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: adminSetting?.orientation === 'vertical' ? 'column' : 'row',
            alignItems: adminSetting?.orientation === 'vertical' ? 'start' : 'center',
          }}
        >
          {/* Speaker Name */}
          <SpeakerHeader
            adminSetting={adminSetting}
            speakerTag={group.speakerTag}
            accessibilitySetting={accessibilitySetting}
          />

          {/* Speaker Words */}
          <div
            style={{
              display: 'inline',
              marginLeft: adminSetting?.orientation === 'horizontal' ? '10px' : '0',
            }}
          >
            {group.words.map((item, wordIndex) => {
              const start = parseTime(item.startTime)
              const end = parseTime(item.endTime)
              const globalIndex = item.originalIndex
              const isActive = globalIndex === highlightedWordIndex
              const shouldHighlight = play && globalIndex <= currentWordIndex
              const boldWidth = measureText(item.word, 500)
              return (
                <WordSpan
                  key={globalIndex}
                  globalIndex={globalIndex}
                  wordRef={wordRef}
                  isActive={isActive}
                  accessibilitySetting={accessibilitySetting}
                  wordWidths={wordWidths}
                  boldWidth={boldWidth}
                  item={item}
                  selectedWord={selectedWord}
                  selectedWordIndex={selectedWordIndex}
                  editedWord={editedWord}
                  handleInputChange={handleInputChange}
                  handleSaveWord={handleSaveWord}
                  handleCurrentTime={handleCurrentTime}
                  handleWordClick={handleWordClick}
                  setEditedWordTs={setEditedWordTs}
                  status={status}
                  route={route}
                  suggestClick={suggestClick}
                  anchorEl={anchorEl}
                />
              )
            })}
          </div>
        </div>
      </div>
    ))
  }, [
    speakerGroups,
    adminSetting,
    accessibilitySetting,
    highlightedWordIndex,
    play,
    currentWordIndex,
    measureText,
    wordWidths,
    selectedWord,
    selectedWordIndex,
    editedWord,
    handleInputChange,
    handleSaveWord,
    handleCurrentTime,
    handleWordClick,
    status,
    route,
    suggestClick,
    anchorEl,
  ])
  useEffect(() => {
    const settingConfig = localStorage.getItem('accessibilitySetting')
      ? JSON.parse(localStorage.getItem('accessibilitySetting'))
      : null

    if (settingConfig !== null && route === 'user') {
      setAccessibilitySetting(settingConfig)
      setEditorBgClr(settingConfig?.backgroundColor)
      setEditorBg(settingConfig?.backgroundColor)
    }
  }, [open, route])

  useEffect(() => {
    const adminBasicSetting = localStorage.getItem('adminBasicSetting')
      ? JSON.parse(localStorage.getItem('adminBasicSetting'))
      : null

    if (adminBasicSetting !== null && route === 'admin') {
      setAdminSetting(adminBasicSetting)
      setConfidenceClrs({
        lowConfidence: adminBasicSetting?.lowConfidence || '#FFFFFF',
        mediumConfidence: adminBasicSetting?.mediumConfidence || '#FFFFFF',
        highConfidence: adminBasicSetting?.highConfidence || '#FFFFFF',
      })
    }
  }, [open, route])

  useEffect(() => {
    return () => localStorage.removeItem('accessibilitySetting')
  }, [])

  return (
    <>
      <Typography
        sx={{
          fontSize: '14px',
          fontWeight: 500,
          color: accessibilitySetting?.titleClr || '#212121',
        }}
      >
        Title Info
      </Typography>

      <Box
        sx={{
          mt: '5px',
          mb: '27px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          sx={{
            color: accessibilitySetting?.restClrs || '#4489FE',
            fontWeight: 500,
            fontSize: '20px',
          }}
        >
          {eventInfo.name || ''}
        </Typography>
        <Button
          variant="outlined"
          onClick={handleOpen}
          sx={{
            height: '31px',
            color: accessibilitySetting?.restClrs || '#4489FE',
            borderColor: accessibilitySetting?.restClrs || '#4489FE',
            textTransform: 'capitalize',
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          Settings
        </Button>
      </Box>
      <Divider
        sx={{
          borderBottomWidth: '2px',
          backgroundColor: accessibilitySetting?.titleClr || '#ECE9E9',
        }}
      />
      <Box
        ref={scrollContainerRef}
        sx={{
          // height: 'calc(100vh - 360px)',
          // overflowY: 'auto',
          overflow: 'hidden',
          margin: '24px 0px',
          backgroundColor: editorBg,
        }}
      >
        <Box sx={{ mt: '24px' }}>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                width: '100%',
              }}
            >
              {loading && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 10,
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  }}
                >
                  <CircularProgress />
                </div>
              )}
              {!error && !loading && wordsArray?.length > 0 && (
                <Typography
                  sx={{
                    mt: '20px',
                    color: '#757575',
                    fontSize: '13px',
                    fontWeight: 400,
                    lineHeight: '20px',
                  }}
                >
                  {RowRender()}
                </Typography>
              )}
              {!loading && error && (
                <>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    <Alert variant="filled" severity="error">
                      {'Streaming Connection Error.'}
                    </Alert>
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
      {open && (
        <AdminSettingModal
          open={open}
          close={handleClose}
          confidenceClrs={confidenceClrs}
          setConfidenceClrs={setConfidenceClrs}
        />
      )}
    </>
  )
}

export default Content
