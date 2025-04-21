import React, { useEffect, useState } from 'react'
import RulePageHeader from './PageHeader'
import RuleAddModal from './modal/addModal'
import { SuccessModal } from '../componenets/successModal'

const RuleTable = ({ globalSearchedTxt, fetchAllRules, isSearch, setIsSearch, ruleFilter, setRuleFilter, data }) => {
  const [addOpen, setAddOpen] = useState(false)
  const [success, setSuccess] = useState(false)
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [success])
  const handleAddOpen = () => {
    setAddOpen(true)
  }
  const handleAddClose = () => {
    setAddOpen(false)
  }

  return (
    <>
      <RulePageHeader
        data={data}
        isSearch={isSearch}
        setIsSearch={setIsSearch}
        globalSearchedTxt={globalSearchedTxt}
        ruleFilter={ruleFilter}
        setRuleFilter={setRuleFilter}
        handleAddOpen={handleAddOpen}
      />
      {addOpen && <RuleAddModal fetchAllRules={fetchAllRules} open={addOpen} close={handleAddClose} />}
      {success && <SuccessModal open={success} close={() => setSuccess(false)} />}
    </>
  )
}

export default RuleTable
