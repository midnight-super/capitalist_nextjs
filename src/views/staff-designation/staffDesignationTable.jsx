import React, { useState } from 'react'
import TableHeader from './tableHeader'
import AddStaffDesignationModal from './modal/addStaffDesignationModal'

const StaffDesignationTable = ({ data, designationFilter, fetchStaffDesignation, searchQuery, setSearchQuery }) => {
    const [addOpen, setAddOpen] = useState(false)
    const handleAddOpen = () => {
        setAddOpen(true)
    }
    const handleAddClose = () => {
        setAddOpen(false)
    }
    return (
        <>
            <TableHeader
                data={data}
                designationFilter={designationFilter}
                handleAddOpen={handleAddOpen}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />
            {addOpen && <AddStaffDesignationModal open={addOpen} close={handleAddClose} fetchStaffDesignation={fetchStaffDesignation} />}
        </>
    )
}

export default StaffDesignationTable