import React from 'react';
import TableHeader from './tableHeader';

const WorkflowsTable = ({ data, handleAddOpen, workflowFilter, searchQuery, setSearchQuery }) => {
  return (
    <TableHeader
      data={data}
      handleAddOpen={handleAddOpen}
      workflowFilter={workflowFilter}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
    />
  )
};

export default WorkflowsTable;
