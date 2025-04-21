import moment from 'moment'
export const calculateTotalPages = (totalRecords, pageSize) => {
  return Math.ceil(totalRecords / pageSize)
}

export const dataSorting = (data, colSorting) => {
  if (!data?.length) {
    return data
  }

  return [...data].sort((a, b) => {
    // A variable to keep track of the sort result
    let result = 0

    // Iterate over each key in colSorting
    for (const key in colSorting) {
      const sortOrder = colSorting[key]

      // Check if the value is an object or an array
      if (typeof a[key] === 'object' && a[key] !== null) {
        // Sort by 'id' key if the key is an object or array
        return a.id - b.id
      }

      if (sortOrder === 'asc') {
        // Ascending sort
        if (typeof a[key] === 'number' && typeof b[key] === 'number') {
          result = a[key] - b[key] // Numeric comparison
        } else {
          result = a[key]?.localeCompare(b[key]) // String comparison
        }
      } else if (sortOrder === 'desc') {
        // Descending sort
        if (typeof a[key] === 'number' && typeof b[key] === 'number') {
          result = b[key] - a[key] // Numeric comparison
        } else {
          result = b[key]?.localeCompare(a[key]) // String comparison
        }
      } else if (sortOrder === '') {
        return a.id - b.id
      }

      // If there's a result, break out of the loop
      if (result !== 0) {
        return result // Return the sorting result for the current key
      }
    }

    // If all keys resulted in equal comparison, sort by "id" in ascending order
    return a.id - b.id
  })
}

export const getSortParams = (obj) => {
  // Extract the first key-value pair from the object
  const [sortBy, order] = Object.entries(obj)[0]

  // If the value is empty, return null or undefined to indicate no parameters
  if (!order) {
    return null // or `undefined`
  }

  // Determine if the sort order is descending
  const isDesc = order === 'desc'

  return { sortBy, isDesc }
}

export const routeName = (pathname) => {
  if (pathname === '/admin-editor/[id]/[status]/[meeting]' || pathname === '/admin/client-users') {
    return 'admin'
  } else if (pathname === '/editor') {
    return 'editor'
  } else if (pathname === '/enduser/[id]/[status]/[meeting]' || pathname === '/client/manage-events') {
    return 'user'
  } else return 'user'
}

export const generateRandomString = () => {
  const characters = 'abcdefghijklmnopqrstuvwxyz'
  let result = ''
  for (let i = 0; i < 9; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters[randomIndex]
  }
  return result
}

export const generateRandomNumber = () => {
  const characters = '0123456789'
  let result = ''
  for (let i = 0; i < 9; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters[randomIndex]
  }
  return result
}
export const getCurrentTimestampInSeconds = (timestampInISOString) => {
  const timestampInMilliseconds = Date.parse(timestampInISOString)
  const timestampInSeconds = timestampInMilliseconds / 1000
  return timestampInSeconds.toFixed(6) + 's'
}

export function isoDateToReadable(isoString) {
  /*
   * Convert an ISO date string to a human-readable format, e.g.
   * '2023-08-15T12:34:56.789Z' -> 'August 15, 2023 at 12:34 AM'
   *
   * @param {string} isoString - The ISO date string to convert.
   *
   * @returns {string} The human-readable date string.
   */

  if (!isoString) {
    return 'n/a'
  }

  const date = new Date(isoString)

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

export function stringToColor(input) {
  const string = `${input}`
  let hash = 0
  let i = 0
  const brightness = 0.7
  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = '#'
  for (i = 0; i < 3; i += 1) {
    const value = Math.floor(((hash >> (i * 8)) & 0xff) * brightness)
    color += `00${value.toString(16)}`.slice(-2)
  }
  /* eslint-enable no-bitwise */

  return color
}

export function getFlagFromTag(tag) {
  const flagColors = ['red', 'yellow', 'green', 'blue']
  const tagParts = tag ? tag.split('_') : []
  const type = tagParts.shift()
  const color = tagParts.shift()
  const note = tagParts.join(' ')

  const isValidFlag = type === 'flag' && flagColors.includes(color)

  return isValidFlag ? { color, note } : null
}

export function getTagFromFlag(flag) {
  return flag.note ? `flag_${flag.color}_${flag.note.replace(/\s+/g, '_')}` : `flag_${flag.color}`
}
export const formatDate = (date) => {
  if (!date) return '-'
  try {
    return moment(date).format('DD MMM YYYY, h:mm A') // e.g., 17 Mar 2024, 2:00 PM
  } catch {
    return date
  }
}
