import AvatarWithName from '@/components/avatarWithName'
import { Box, Typography, AvatarGroup } from '@mui/material'

const AssigneesDisplay = ({ assignees, staffList, onClick }) => {
  const enhanced = assignees.map((assignee) => {
    const matched = staffList.find((s) => s.staffId === assignee.assigneeId)
    return {
      ...assignee,
      fullName: matched?.fullName || 'NA',
      profileUrl: matched?.profileUrl || '',
    }
  })

  if (enhanced.length === 0) {
    return (
      <Typography
        color="primary.main"
        sx={{
          textDecoration: 'underline',
          cursor: 'pointer',
        }}
        onClick={onClick}
      >
        Assign Staff to task
      </Typography>
    )
  }

  if (enhanced.length === 1) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <AvatarWithName name={enhanced[0].fullName} profileUrl={enhanced[0].profileUrl} />
      </Box>
    )
  }
  return (
    <AvatarGroup max={3} spacing={16}>
      {enhanced.map((user) => (
        <AvatarWithName key={user.assigneeId} name={user.fullName} profileUrl={user.profileUrl} compact />
      ))}
    </AvatarGroup>
  )
}

export default AssigneesDisplay
