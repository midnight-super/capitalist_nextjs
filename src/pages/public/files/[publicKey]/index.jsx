import React, { useState, useEffect, use } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Box, Button, IconButton, Link, Stack, Tooltip, Typography, useTheme } from '@mui/material'
import { CloudDownload, Visibility } from '@mui/icons-material'

import { listPublicSharedDirectoryFiles, listRestrictedSharedDirectoryFiles } from '@/services/file.service'
import CustomPagination from '@/components/customPagination'
import PublicPortalLayout from '@/components/layout/PublicPortalLayout'

const baseURL = process.env.NEXT_PUBLIC_BASE_URL

export default function PublicFileSharePortal() {
  const theme = useTheme()
  const router = useRouter()
  const params = useParams()
  const { publicKey } = params || {}
  const { query } = router
  const { token } = query || {}
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pageSize, setPageSize] = useState(25)
  const [page, setPage] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [files, setFiles] = useState([])
  const fileIds = files.map(({ fileId }) => fileId)

  async function fetchFiles() {
    try {
      if (!publicKey) {
        return
      }

      setLoading(true)
      setError('')

      // There are two types of share links: public and restricted.
      let response = {}
      if (token) {
        // Restricted share links require a JWT from an authenticated user.
        // The JWT, and thus the share link, expire after 24 hours.
        response = await listRestrictedSharedDirectoryFiles({
          publicKey,
          page,
          pageSize,
          jwt: token,
        })
      } else {
        // Public share links do not require a JWT and the files are shared
        // publicly without expiration.
        response = await listPublicSharedDirectoryFiles({
          publicKey,
          page,
          pageSize,
        })
      }

      if (response?.success) {
        const { currPage, pageCount, data: files } = response

        setPage(currPage)
        setPageCount(pageCount)
        setFiles(files)

        if (files.length === 0) {
          setError('No files found for this share link.')
        }
      } else {
        setError(res?.message || 'There was an error when accessing the shared files. Please try again later.')
      }
    } catch (err) {
      console.log('fetchFiles exception', err)
    } finally {
      setLoading(false)
    }
  }
  function onPageChange(_, value) {
    setPage(value - 1)
    setFiles([])
  }

  function previewURL(fileId) {
    if (token) {
      return `${baseURL}/public/preview/${fileId}?token=${token}`
    }
    return `${baseURL}/public/preview/${fileId}`
  }

  function downloadURL(fileIds) {
    const encodedFileIds = fileIds.map((fileId) => encodeURIComponent(fileId)).join(',')
    if (token) {
      return `${baseURL}/public/downloads?fileIds=${encodedFileIds}&token=${token}`
    }
    return `${baseURL}/public/downloads?fileIds=${encodedFileIds}`
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetchFiles()
    }
  }, [publicKey, page, pageSize])

  return (
    <Stack>
      <Typography variant="h1" sx={{ marginBottom: '2rem' }}>
        Shared Files
      </Typography>
      {loading && <Typography variant="body1">Loading...</Typography>}
      {error && (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      )}
      <Box>
        {files.map(({ fileId, fileName }) => (
          <Stack key={fileId} direction="row" alignItems="center">
            <Tooltip title="Download" placement="top" arrow>
              <IconButton href={downloadURL([fileId])} target="_blank">
                <CloudDownload color="primary" />
              </IconButton>
            </Tooltip>
            {/* <Tooltip title="Preview" placement="top" arrow>
              <IconButton href={previewURL(fileId)} target="_blank">
                <Visibility color="primary" />
              </IconButton>
            </Tooltip> */}
            <Tooltip title="Preview" placement="top" arrow>
              <Link href={previewURL(fileId)} target="_blank" underline="none" sx={{ marginRight: '4rem' }}>
                <Typography variant="body1">{fileName}</Typography>
              </Link>
            </Tooltip>
          </Stack>
        ))}
      </Box>

      {files.length > 1 && (
        <Button
          href={downloadURL(fileIds)}
          target="_blank"
          variant="outlined"
          color="primary"
          sx={{ marginTop: '2rem' }}
        >
          Download All {files.length} Files
        </Button>
      )}

      {!loading && !error && files.length > pageSize && (
        <CustomPagination
          page={page}
          setPageSize={setPageSize}
          pageSize={pageSize}
          setPageNo={setPage}
          onChange={onPageChange}
          pageCount={pageCount}
        />
      )}
    </Stack>
  )
}

// allow access without login
PublicFileSharePortal.requireAuth = false
PublicFileSharePortal.allowGuest = true

// use a minimal layout for public pages
PublicFileSharePortal.getLayout = (page) => {
  return <PublicPortalLayout>{page}</PublicPortalLayout>
}
