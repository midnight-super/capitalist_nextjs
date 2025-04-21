import Content from '@/views/editor/content'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { getCurrentTimestampInSeconds } from '@/utils'

const AdminEditor = ({
  setEditors,
  selectedEvent,
  confidenceClrs,
  setConfidenceClrs,
  play,
  setCurrentTime,
  currentTime,
}) => {
  const router = useRouter()
  const { id, status } = router.query
  const accessToken = window.localStorage.getItem('accessToken')
  const [socket, setSocket] = useState(null)
  const [sessionId, setSessionId] = useState(null)
  const [data, setData] = useState(null)
  const [lockedWord, setLockedWord] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [styleList, setStyleList] = useState(null)
  const [eventInfo, setEventInfo] = useState({
    name: null,
  })

  useEffect(() => {
    selectedEvent?.key && setData([])
    setLoading(true)
  }, [selectedEvent?.key])

  useEffect(() => {
    return () => {
      localStorage.removeItem('adminBasicSetting')
    }
  }, [])

  useEffect(() => {
    if ((id || selectedEvent?.key) && accessToken) {
      const ws = new WebSocket(`ws://34.172.210.169:8180/editor/${selectedEvent?.key || id}?token=${accessToken}`)
      // WebSocket connection open handler (optional)
      ws.onopen = () => {
        setError(false)
      }

      // WebSocket message handler (this is where you process incoming messages)
      ws.onmessage = (event) => {
        const message = JSON.parse(event.data)
        // If sessionId is part of the message, store it
        if (message?.sessionId) {
          setSessionId(message.sessionId)
          setLoading(false)
        }

        if (message?.captionSettings) {
          setStyleList(message?.captionSettings)
        }
        if (message?.name) {
          setEventInfo({ name: message?.name || '' })
        }
        if (message?.action === 'sync' && message?.data) {
          setData(message?.data)
          setLoading(false)
        }

        if (message?.action === 'update' && message?.data?.length > 0) {
          setData((prevData) => {
            // Create a copy of the existing data to avoid direct mutation
            const updatedData = { ...prevData }

            // Loop through each item in the new data
            message.data.forEach((newItem) => {
              // Check if there is an existing item in prevData with the same startTime
              const matchingItemKey = Object.keys(updatedData).find(
                (key) => updatedData[key].startTime === newItem.startTime
              )

              if (matchingItemKey) {
                // If a match is found, replace the object in updatedData
                updatedData[matchingItemKey] = newItem
              } else {
                // If no match, add the new item with its startTime as the key
                updatedData[newItem.startTime] = newItem
              }
            })

            // Sort updatedData by startTime in ascending order (convert startTime to numbers)
            // const sortedData = Object.keys(updatedData)
            //   .sort((a, b) => {
            //     // Remove the 's' and convert to numbers for comparison
            //     const aStartTime = parseFloat(
            //       updatedData[a].startTime.replace('s', '')
            //     );
            //     const bStartTime = parseFloat(
            //       updatedData[b].startTime.replace('s', '')
            //     );

            //     return aStartTime - bStartTime;
            //   })
            //   .reduce((acc, key) => {
            //     acc[key] = updatedData[key];
            //     return acc;
            //   }, {});

            // return sortedData
            return updatedData
          })
        }
        if (message?.action === 'connectedAgents' && message?.data?.length > 0) {
          setEditors(message?.data)
        }
        if (message?.action === 'agentConnected' && message?.data?.length > 0) {
          setEditors((prevEditors) => [...prevEditors, ...(message?.data || [])])
        }
        if (message?.action === 'agentDisconnected' && message?.data?.length > 0) {
          setEditors((prevEditors) => prevEditors.filter((editor) => !message?.data?.includes(editor)))
        }
        if (message?.action === 'lock-acquired' && message?.data && sessionId && message?.data?.editor !== sessionId) {
          setLockedWord(message?.data?.ts)
        }
        if (message?.action === 'lock-released' && message?.data && message?.data?.editor !== sessionId) {
          setLockedWord(null)
        }
      }

      // Handle WebSocket errors
      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        setError(true)
      }

      // Store the socket instance in state
      setSocket(ws)

      // Cleanup WebSocket connection when component unmounts or dependencies change
      return () => {
        ws.close()
      }
    }
  }, [id, accessToken, selectedEvent?.key])

  const handleSocketMessage = (action, payload) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not open.')
      return
    }
    switch (action) {
      case 'sync':
        if (sessionId) {
          const syncPayload = {
            action: 'sync',
            data: {
              ts: getCurrentTimestampInSeconds(new Date().toISOString()),
              sessionId: sessionId,
            },
          }
          socket.send(JSON.stringify(syncPayload))
        }
        break

      case 'update':
        if (sessionId) {
          const { id, ts, ...rest } = payload
          const data = {
            action: 'update',
            data: {
              sessionId: sessionId,
              changes: [rest[0]],
            },
          }
          socket.send(JSON.stringify(data))
        }
        break
      case 'lock':
        if (sessionId) {
          const data = {
            action: 'lock',
            data: {
              ts: payload,
              sessionId: sessionId,
            },
          }
          socket.send(JSON.stringify(data))
        }
        break
      case 'unlock':
        if (sessionId) {
          const data = {
            action: 'unlock',
            data: {
              ts: payload,
              sessionId: sessionId,
            },
          }
          socket.send(JSON.stringify(data))
        }
        break
      default:
        console.error('Unknown action', action)
    }
  }

  useEffect(() => {
    if (sessionId) {
      setLoading(true)
      handleSocketMessage('sync', null)
    }
  }, [sessionId])

  return (
    <Content
      lockedWord={lockedWord}
      eventInfo={eventInfo}
      confidenceClrs={confidenceClrs}
      setConfidenceClrs={setConfidenceClrs}
      styleList={styleList}
      status={selectedEvent?.status || status}
      id={id}
      error={error}
      loading={loading}
      handleSocketMessage={handleSocketMessage}
      data={data}
      play={play}
      setCurrentTime={setCurrentTime}
      currentTime={currentTime}
    />
  )
}

AdminEditor.permissions = ['event.read']
export default AdminEditor
