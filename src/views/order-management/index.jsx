import React, { useState } from 'react'
import TableHeader from './tableHeader'

const OrderTable = ({ data, selectedIds, userFilter, setSearchText, searchText }) => {
  return (
    <>
      <TableHeader
        data={data}
        userFilter={userFilter}
        selectedIds={selectedIds}
        setSearchText={setSearchText}
        searchText={searchText}
      />
    </>
  )
}

export default OrderTable
