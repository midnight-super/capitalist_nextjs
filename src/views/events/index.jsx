import React, { useState } from 'react'
import TableHeader from './tableHeader'
import AddModal from './modals/addModal'
import AddBasicModal from './modals/addBasicModal'

const EventTable = ({ globalSearchedTxt, setIsSearch, data, selectedIds, fetchData, userFilter }) => {
  const [addOpen, setAddOpen] = useState(false)
  const [advanceOpen, setAdvanceOpen] = useState(false)
  const [basicData, setBasicData] = useState(null)
  const [advanceData, setAdvanceData] = useState(null)
  const handleAddOpen = () => {
    setAddOpen(true)
  }
  const handleAddClose = () => {
    setAddOpen(false)
    setBasicData(null)
    setAdvanceData(null)
  }

  const handleAdvanceAddOpen = () => {
    setAdvanceOpen(true)
    setAddOpen(false)
  }

  const handleAdvanceAddClose = () => {
    setAdvanceOpen(false)
    setBasicData(null)
    setAdvanceData(null)
  }

  const handleBack = () => {
    setAdvanceOpen(false)
    setAddOpen(true)
  }
  return (
    <>
      <TableHeader
        globalSearchedTxt={globalSearchedTxt}
        data={data}
        userFilter={userFilter}
        setIsSearch={setIsSearch}
        selectedIds={selectedIds}
        handleAddOpen={handleAddOpen}
      />
      {addOpen && (
        <AddBasicModal
          handleAdvanceAddOpen={handleAdvanceAddOpen}
          fetchData={fetchData}
          open={addOpen}
          close={handleAddClose}
          savedData={setBasicData}
          basicData={basicData}
          advanceData={advanceData}
        />
      )}
      {advanceOpen && (
        <AddModal
          fetchData={fetchData}
          open={advanceOpen}
          close={handleAdvanceAddClose}
          handleBack={handleBack}
          basicData={basicData}
          savedData={setAdvanceData}
          advanceData={advanceData}
        />
      )}
    </>
  )
}

export default EventTable
