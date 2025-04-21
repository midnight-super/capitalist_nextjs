import React, { useState } from 'react'
import TableHeader from './tableHeader'
import AddServiceModal from './modal/addServiceModal'

const ServicesTable = ({ data, serviceFilter, fetchServices, searchQuery, setSearchQuery }) => {
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
                serviceFilter={serviceFilter}
                handleAddOpen={handleAddOpen}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />
            {addOpen && <AddServiceModal open={addOpen} close={handleAddClose} fetchServices={fetchServices} />}
        </>
    )
}

export default ServicesTable