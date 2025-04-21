import axiosWithAuth from './index'

// GET all rules
const getAllRules = async (query, filter) => {
  try {
    const endpoint = '/rules/rule/all'
    const params = {
      ...query,
      page: query?.page || 0,
      pageSize: query?.pageSize || 25,
    }

    const headers = {
      'Content-Type': 'application/json',
    }

    const response = await axiosWithAuth.post(endpoint, filter, {
      params,
      headers,
    })

    return response.data
  } catch (e) {
    console.error('getAllRules exception', e)
    return `Server Error: ${e?.message}`
  }
}

// GET single rule by ID
const getRuleById = async (ruleId) => {
  try {
    const endpoint = `/rules/rule/${ruleId}`
    const response = await axiosWithAuth.get(endpoint)
    return response.data
  } catch (e) {
    console.error('getRuleById exception', e)
    return `Server Error: ${e.message}`
  }
}

// GET all objects for rule
const getAvailableRuleObjects = async () => {
  try {
    const endpoint = `/rules/object/all`
    const response = await axiosWithAuth.get(endpoint)
    return response.data.map(({ objectId, objectName }) => ({ objectId, objectName }))
  } catch (e) {
    console.error('getAvailableRuleObjects exception', e)
    return `Server Error: ${e?.message}`
  }
}

// GET ruleEvents by objectId
const getRuleEventsByObjectId = async (objectId) => {
  try {
    const endpoint = `/rules/eventByObject/${objectId}`
    const response = await axiosWithAuth.get(endpoint)
    return response.data.map(({ eventId, eventName }) => ({
      value: eventId,
      label: eventName,
      eventId,
      eventName,
    }))
  } catch (e) {
    console.error('getRuleEventsByObjectId exception', e)
    return `Server Error: ${e?.message}`
  }
}

// GET all mutation events for rule
const getRuleMutationActions = async (objectId) => {
  try {
    const endpoint = `/rules/action/all`
    const response = await axiosWithAuth.get(endpoint)

    return response.data
      .filter((r) => r.actionType === 'MUTATION' && r.objectId === objectId)
      .map(({ actionId, actionName, mutationData }) => ({
        value: actionId,
        label: actionName,
        actionId,
        actionName,
        mutationData,
      }))
  } catch (e) {
    console.error('getRuleMutationActions exception', e)
    return `Server Error: ${e?.message}`
  }
}

// GET all query events for rule
const getRuleQueryActions = async (objectId) => {
  try {
    const endpoint = `/rules/action/all`
    const response = await axiosWithAuth.get(endpoint)

    return response.data
      .filter((r) => r.actionType === 'QUERY' && r.objectId === objectId)
      .map(({ actionId, actionName }) => ({
        value: actionId,
        label: actionName,
        actionId,
        actionName,
      }))
  } catch (e) {
    console.error('getRuleQueryActions exception', e)
    return `Server Error: ${e?.message}`
  }
}

// GET conditions by RuleId
const getRuleConditionsByRuleId = async (RuleId) => {
  try {
    const endpoint = `/rules/condition/byRule/${RuleId}`
    const response = await axiosWithAuth.get(endpoint)
    return response.data
  } catch (e) {
    console.error('getRuleConditionsByRuleId exception', e)
    return `Server Error: ${e?.message}`
  }
}

// CREATE condition
const createCondition = async (conditionData) => {
  try {
    const endpoint = '/rules/condition/create'
    const response = await axiosWithAuth.post(endpoint, conditionData, {
      headers: { 'Content-Type': 'application/json' },
    })
    return response.data
  } catch (e) {
    console.error('createCondition exception', e)
    return `Server Error: ${e?.message}`
  }
}

// UPDATE condition
const updateCondition = async (conditionData) => {
  try {
    const endpoint = '/rules/condition/update'
    const response = await axiosWithAuth.post(endpoint, conditionData, {
      headers: { 'Content-Type': 'application/json' },
    })
    return response.data
  } catch (e) {
    console.error('updateCondition exception', e)
    return `Server Error: ${e?.message}`
  }
}

// DELETE condition
const deleteCondition = async (conditionId) => {
  try {
    const endpoint = '/rules/condition/delete'
    const response = await axiosWithAuth.post(
      endpoint,
      {},
      {
        headers: { 'Content-Type': 'application/json' },
        params: { conditionId },
      }
    )
    return response.data
  } catch (e) {
    console.error('deleteCondition exception', e)
    return `Server Error: ${e?.message}`
  }
}

// CREATE rule
const createRule = async (ruleData) => {
  try {
    const endpoint = '/rules/rule/create'
    const response = await axiosWithAuth.post(endpoint, ruleData, {
      headers: { 'Content-Type': 'application/json' },
    })
    return response.data
  } catch (e) {
    console.error('createRule exception', e)
    return `Server Error: ${e?.message}`
  }
}

// UPDATE rule
const updateRule = async (ruleData) => {
  try {
    const endpoint = '/rules/rule/update'
    const response = await axiosWithAuth.post(endpoint, ruleData, {
      headers: { 'Content-Type': 'application/json' },
    })
    return response.data
  } catch (e) {
    console.error('updateRule exception', e)
    return `Server Error: ${e?.message}`
  }
}

// DELETE rule
const deleteRule = async (ruleId) => {
  try {
    const endpoint = '/rules/rule/delete'
    const response = await axiosWithAuth.post(
      endpoint,
      {},
      {
        headers: { 'Content-Type': 'application/json' },
        params: { ruleId },
      }
    )
    return response.data
  } catch (e) {
    console.error('deleteRule exception', e)
    return `Server Error: ${e?.message}`
  }
}

// Export all functions in a single block
export {
  getAllRules,
  getRuleById,
  getAvailableRuleObjects,
  getRuleEventsByObjectId,
  getRuleMutationActions,
  getRuleQueryActions,
  getRuleConditionsByRuleId,
  createCondition,
  updateCondition,
  deleteCondition,
  createRule,
  updateRule,
  deleteRule,
}
