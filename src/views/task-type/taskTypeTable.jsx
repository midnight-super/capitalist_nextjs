import React, { useState } from 'react'
import TableHeader from './tableHeader'
import AddTaskTypeModal from './modal/addTaskTypeModal'

const TaskTypeTable = ({ data, filter, fetchAddOns, searchQuery, setSearchQuery }) => {
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
            {addOpen && <AddTaskTypeModal open={addOpen} close={handleAddClose} fetchAddOns={fetchAddOns} />}
        </>
    )
}

export default TaskTypeTable