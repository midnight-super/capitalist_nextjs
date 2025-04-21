import React, { useEffect, useState } from 'react'
import { getColumns } from '@/views/users/column'
import { Box } from '@mui/material'
import UserTable from '@/views/users'
import CustomPagination from '@/components/customPagination'
import CustomTable from '@/components/CustomTable'
import { getSortParams } from '@/utils'
import { getAllClients } from '@/services/client.service'
import toast from 'react-hot-toast'
import CustomLoading from '@/views/componenets/customLoading'

const ClientUser = ({ globalSearchedTxt }) => {
  const [pageSize, setPageSize] = useState(25)
  const [pageNo, setPageNo] = useState(0)
  const [clientUsers, setClientUsers] = useState([])
  const [colSorting, setColSorting] = useState({
    nameTitle: '',
    email: '',
    status: '',
  })
  const [loading, setLoading] = useState(true)
  const [userFilter, setUserFilter] = useState({})
  const [isSearch, setIsSearch] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // Transform the filters
  const transformedFilters = Object.entries(userFilter || {})
    .filter(([key, filter]) => filter?.value)
    .map(([key, filter]) => ({
      attribute: key,
      operator: filter?.mode || 'Contains',
      value: [filter.value],
    }))

  // Check if it's the initial load and no filters are present
  // if (isInitialLoad && transformedFilters.length === 0) {
  //   transformedFilters.push({
  //     attribute: 'status',
  //     operator: 'EQUAL',
  //     value: ['ACTIVE'],
  //   });
  //}

  // After handling the first load, update the flag
  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false)
    }
  }, [isInitialLoad])

  const [pageCount, setPageCount] = useState(0)

  const fetchClientUsers = async () => {
    setLoading(true) // Ensure loading state is updated
    try {
      const sortResult = getSortParams(colSorting)
      const params = {
        page: pageNo,
        pageSize: pageSize,
        sortBy: sortResult ? sortResult.sortBy : 'createdAt',
        isDesc: sortResult ? sortResult.isDesc : true,
        isSearch: isSearch,
      }

      const res = await getAllClients(params, transformedFilters)
      if (res?.success) {
        setClientUsers(
          res.data?.map((item) => ({
            ...item,
            id: item?.userId,
          }))
        )
        setPageNo(res?.currPage)
        setPageCount(res?.pageCount)
      } else {
        toast.error(res || 'Server Error: Failed to fetch')
      }
    } catch (err) {
      toast.error(err.message || 'Unexpected Error')
    } finally {
      setLoading(false)
    }
  }

  // Fetch data whenever pageNo, pageSize, or colSorting changes
  useEffect(() => {
    fetchClientUsers()
  }, [userFilter, pageNo, pageSize, colSorting])

  const handlePageChange = (event, value) => {
    setPageNo(value - 1)
    setClientUsers([])
  }

  const columns = getColumns({
    colSorting,
    setColSorting,
    fetchClientUsers,
    clientUsers,
    pageNo,
    pageSize,
  })

  return (
    <>
      {loading && <CustomLoading />}
      <Box sx={{ mb: '12px' }}>
        <UserTable
          globalSearchedTxt={globalSearchedTxt}
          data={clientUsers}
          setIsSearch={setIsSearch}
          userFilter={setUserFilter}
          fetchClientUsers={fetchClientUsers}
        />
      </Box>
      <CustomTable
        rows={clientUsers || []}
        columns={columns}
        pageSize={pageSize}
        // loading={loading}
      />
      {/* {clientUsers?.length > 0 && ( */}
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
      {/* )} */}
    </>
  )
}

ClientUser.permissions = ['client.read']

export default ClientUser
