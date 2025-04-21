import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Box } from '@mui/material'
import CustomPagination from '@/components/customPagination'
import CustomTable from '@/components/CustomTable'
import { dataSorting } from '@/utils'
import toast from 'react-hot-toast'
import CustomLoading from '@/views/componenets/customLoading'
import RuleTable from '@/views/rules'
import { getAllRules } from '@/services/rule.service'
import { getSortParams } from '@/utils'
import { getColumns } from '@/views/rules/column'
import { debounce } from 'lodash'

const ManageRules = ({ globalSearchedTxt }) => {
  const [pageSize, setPageSize] = useState(10)
  const [pageNo, setPageNo] = useState(0)
  const [loading, setLoading] = useState(false)
  const [rules, setRules] = useState([])
  const [pageCount, setPageCount] = useState(0)
  const [selectedRuleIds, setSelectedRuleIds] = useState([])
  const [colSorting, setColSorting] = useState({ createdAt: '' })
  const [ruleFilter, setRuleFilter] = useState({})
  const [isSearch, setIsSearch] = useState(false)

  const abortControllerRef = useRef(null)

  const transformedFilters = useCallback(() => {
    return Object.entries(ruleFilter || {})
      .filter(([_, filter]) => filter?.value && filter.value.toString().trim() !== '')
      .map(([key, filter]) => ({
        attribute: key,
        operator: filter?.mode || 'CONTAINS',
        value: [filter.value],
      }))
  }, [ruleFilter])

  const fetchRules = useCallback(
    debounce(async (page = 0) => {
      setLoading(true)

      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      abortControllerRef.current = new AbortController()

      try {
        const sortResult = getSortParams(colSorting)
        const params = {
          page,
          pageSize,
          sortBy: sortResult?.sortBy || 'createdAt',
          isDesc: sortResult?.isDesc || true,
          isSearch, // This controls OR/AND gating
        }

        const res = await getAllRules(params, transformedFilters(), { signal: abortControllerRef.current.signal })

        if (res?.success) {
          setPageNo(res?.currPage)
          setPageCount(res?.pageCount)
          setRules(res.data?.map((item) => ({ ...item, id: item?.ruleId })))
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Fetch error:', err)
          toast.error(err.message || 'Request failed')
        }
      } finally {
        setLoading(false)
      }
    }, 300),
    [pageSize, colSorting, isSearch, transformedFilters]
  )

  // Handle initial load and filter changes
  useEffect(() => {
    if (pageNo !== 0) {
      setPageNo(0)
    } else {
      fetchRules(0)
    }
  }, [ruleFilter, fetchRules])

  // Handle page/sort changes
  useEffect(() => {
    fetchRules(pageNo)
  }, [pageNo, pageSize, colSorting, fetchRules])

  // Handle global search text
  useEffect(() => {
    if (globalSearchedTxt) {
      setIsSearch(true)
      setRuleFilter({
        ruleName: { value: globalSearchedTxt, mode: 'CONTAINS' },
      })
    } else {
      setIsSearch(false)
      setRuleFilter({})
    }
  }, [globalSearchedTxt])

  const handlePageChange = (_, value) => {
    setPageNo(value - 1)
  }

  const columns = getColumns({
    colSorting,
    setColSorting,
    fetchAllRules: () => fetchRules(pageNo),
  })

  return (
    <>
      {loading && <CustomLoading />}
      <Box sx={{ mb: '12px' }}>
        <RuleTable
          globalSearchedTxt={globalSearchedTxt}
          data={rules}
          setIsSearch={setIsSearch}
          isSearch={isSearch}
          ruleFilter={ruleFilter}
          setRuleFilter={setRuleFilter}
          fetchAllRules={fetchRules}
        />
      </Box>

      <Box sx={{ mb: '12px' }}>
        <CustomTable
          rows={rules || []}
          columns={columns}
          pageSize={pageSize}
          onSelectionChange={({ ids }) => setSelectedRuleIds(Array.from(ids || []))}
          getRowId={(row) => row.ruleId}
        />
      </Box>

      {rules?.length > 0 && (
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
      )}
    </>
  )
}

ManageRules.permissions = ['rule.read']
export default ManageRules
