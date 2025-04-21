import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { Box } from '@mui/material'

import { listDirectoryFiles } from '@/services/file.service'
import { getSortParams } from '@/utils'

import CustomPagination from '@/components/customPagination'
import CustomTable from '@/components/CustomTable'

import CustomLoading from '@/views/componenets/customLoading'
import { getColumns } from '@/views/files/columns'
import PageHeader from '@/views/files/PageHeader'

const baseURL = process.env.NEXT_PUBLIC_BASE_URL

export default function FileList({ globalSearchedTxt }) {
  const [files, setFiles] = useState([])
  const [selectedFileIds, setSelectedFileIds] = useState([])
  const selectedFiles = files.filter((file) => selectedFileIds.includes(file.id))
  const [pageSize, setPageSize] = useState(25)
  const [pageNo, setPageNo] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [colSorting, setColSorting] = useState({
    fileName: '',
    createdAt: '',
    status: '',
  })
  const [loading, setLoading] = useState(true)
  const [fileFilter, setFileFilter] = useState({})
  const [isSearch, setIsSearch] = useState(false)
  const transformedFilters = Object.entries(fileFilter || {})
    .filter(([key, filter]) => filter?.value)
    .map(([key, filter]) => ({
      attribute: key,
      operator: filter?.mode || 'Contains',
      value: [filter.value],
    }))
  const fetchFiles = async (page) => {
    setLoading(true)
    try {
      const sortResult = getSortParams(colSorting)
      const params = {
        directoryId: 0,
        page,
        pageSize: pageSize,
        sortBy: sortResult ? sortResult.sortBy : 'createdAt',
        isDesc: sortResult ? sortResult.isDesc : true,
        isSearch: isSearch,
      }

      const res = await listDirectoryFiles(params, transformedFilters)
      if (res?.success) {
        setPageNo(res?.currPage)
        setPageCount(res?.pageCount)
        setFiles(
          res.data?.map((item) => ({
            ...item,
            id: item?.fileId,
          }))
        )
      } else {
        console.error('fetchFiles error response', res)
        toast.error(`${res}` || 'Server Error: Failed to fetch file list')
      }
    } catch (err) {
      console.error('fetchFiles exception', err)
      toast.error(err.message || 'Unexpected Error')
    } finally {
      setLoading(false)
    }
  }

  function patchFile(filePatch) {
    // Accept a patch of file attributes and update the
    // file that matches the fileId in the patch.
    // Use this for local updates, e.g. setting a flag,
    // so the whole list does not need to be re-fetched.
    const { fileId, ...rest } = filePatch

    setFiles((prevFiles) =>
      prevFiles.map((f) => {
        if (f.id === fileId) {
          console.log('patching file', f, fileId, rest)
          return { ...f, ...rest }
        }
        return f
      })
    )
  }

  const handlePageChange = (_, value) => {
    setPageNo(value - 1)
    setFiles([])
  }
  const columns = getColumns({ colSorting, setColSorting, patchFile })

  useEffect(() => {
    // refetch data whenever sorting or pagination changes
    fetchFiles(pageNo)
  }, [pageNo, pageSize, colSorting])

  useEffect(() => {
    if (pageNo !== 0) {
      // Reset page when search or filters are changed,
      // which triggers a refetch on the page change.
      // See above useEffect.
      setPageNo(0)
    } else {
      // If we are already on first page, there would be
      // no page change, so refetch the data purposefully.
      fetchFiles(0)
    }
  }, [fileFilter])

  function downloadSelectedFiles() {
    const accessToken = localStorage.getItem('accessToken')
    const urls = selectedFiles.map((file) => `${baseURL}/restricted/downloads/${file.id}?token=${accessToken}`)
    const interval = setInterval(download, 1000, urls)

    function download(urls) {
      const url = urls.pop()
      if (url) {
        const a = document.createElement('a')

        a.setAttribute('href', url)
        //a.setAttribute('download', info.name)
        //a.setAttribute('target', '_blank')
        console.log('file', url, a)
        a.click()
      } else {
        clearInterval(interval)
      }
    }
  }

  return (
    <>
      {loading && <CustomLoading />}
      <Box sx={{ mb: '12px' }}>
        <PageHeader
          {...{
            globalSearchedTxt,
            setIsSearch,
            fileFilter,
            setFileFilter,
            fetchFiles,
            selectedFiles,
            downloadSelectedFiles,
          }}
        />
      </Box>
      <CustomTable
        rows={files || []}
        columns={columns}
        onSelectionChange={(ids) => {
          console.log('selected', ids)
          setSelectedFileIds(ids)
        }}
      />
      <Box sx={{ marginTop: '-30px' }}>
        <CustomPagination
          page={pageNo}
          setPageSize={setPageSize}
          pageSize={pageSize}
          setPageNo={setPageNo}
          onChange={handlePageChange}
          pageCount={pageCount}
        />
      </Box>
    </>
  )
}

FileList.permissions = ['file.read']
