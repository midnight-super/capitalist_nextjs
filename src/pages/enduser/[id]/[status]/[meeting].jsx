import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getCurrentTimestampInSeconds } from '@/utils'
import Content from '@/views/editor/content'

const EndUser = ({ setEditorBgClr, play, setCurrentTime, currentTime }) => {
  const router = useRouter()
  const { id } = router.query
  const accessToken = window.localStorage.getItem('accessToken')
  const [socket, setSocket] = useState(null)
  const [sessionId, setSessionId] = useState(null)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [styleList, setStyleList] = useState(null)
  const [eventInfo, setEventInfo] = useState({
    name: null,
  })

  useEffect(() => {
    if (id && accessToken) {
      const ws = new WebSocket(`ws://34.172.210.169:8180/editor/${id}?token=${accessToken}`)
      // WebSocket connection open handler (optional)
      ws.onopen = () => {
        console.log('WebSocket connected')
        setError(false)
      }

      // WebSocket message handler (this is where you process incoming messages)
      ws.onmessage = (event) => {
        const message = JSON.parse(event.data)
        if (message?.name) {
          setEventInfo({ name: message?.name || '' })
        }
        if (message?.captionSettings) {
          setStyleList(message?.captionSettings)
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
            const sortedData = Object.keys(updatedData)
              .sort((a, b) => {
                // Remove the 's' and convert to numbers for comparison
                const aStartTime = parseFloat(updatedData[a].startTime.replace('s', ''))
                const bStartTime = parseFloat(updatedData[b].startTime.replace('s', ''))

                return aStartTime - bStartTime
              })
              .reduce((acc, key) => {
                acc[key] = updatedData[key]
                return acc
              }, {})

            // Return the sorted state object
            return sortedData
          })
        }
        // If sessionId is part of the message, store it
        if (message?.sessionId) {
          setSessionId(message.sessionId)
          setLoading(false)
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
  }, [id, accessToken])

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
          const data = {
            action: 'update',
            data: {
              sessionId: sessionId,
              changes: payload,
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
              ts: getCurrentTimestampInSeconds(new Date().toISOString()),
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
              ts: getCurrentTimestampInSeconds(new Date().toISOString()),
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
      eventInfo={eventInfo}
      styleList={styleList}
      id={id}
      error={error}
      loading={loading}
      handleSocketMessage={handleSocketMessage}
      data={data}
      setEditorBgClr={setEditorBgClr}
      play={play}
      setCurrentTime={setCurrentTime}
      currentTime={currentTime}
    />
  )
}

EndUser.permissions = ['task.read']
export default EndUser
