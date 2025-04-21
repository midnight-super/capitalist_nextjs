export const allTasksHaveSameAssignee = (tasks) => {
  const getSortedAssigneeIds = (task) =>
    (task.assignees || [])
      .map((assignee) => assignee.assigneeId)
      .sort()
      .join(',')
  const reference = getSortedAssigneeIds(tasks[0])
  return tasks.every((task) => getSortedAssigneeIds(task) === reference)
}
