import React, { useState } from 'react'
import TableHeader from './tableHeader'
import AddAddOnsModal from './modal/addAddOnsModal'

const AddOnsTable = ({ data, filter, fetchAddOns, searchQuery, setSearchQuery }) => {
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
                filter={filter}
                handleAddOpen={handleAddOpen}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />
            {addOpen && <AddAddOnsModal open={addOpen} close={handleAddClose} fetchAddOns={fetchAddOns} />}
        </>
    )
}

export default AddOnsTable