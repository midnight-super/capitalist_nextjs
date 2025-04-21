import React, { useState } from 'react'
import TableHeader from './tableHeader'
import AddServiceCategoryModal from './modal/addServiceCategoryModal'

const ServiceCategoriesTable = ({ data, categoryFilter, fetchServiceCategories, searchQuery, setSearchQuery }) => {
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
                categoryFilter={categoryFilter}
                handleAddOpen={handleAddOpen}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />
            {addOpen && <AddServiceCategoryModal open={addOpen} close={handleAddClose} fetchServiceCategories={fetchServiceCategories} serviceCategories={data} />}
        </>
    )
}

export default ServiceCategoriesTable