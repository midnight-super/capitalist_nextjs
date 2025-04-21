// Define the status options without directly referencing theme
export const statusOptions = [
  { value: 'ASSIGNED', label: 'Complete' },
  { value: 'Production', label: 'In Production' },
  { value: '-', label: 'Active' },
  { value: 'string', label: 'Ready to Assign' },
  { value: 'CREATED', label: 'Ready to Assign' },
  { value: null, label: 'Ready to Assign' },
]

// Create a function to get the color map that uses the theme
export const getColorMap = (theme) => ({
  ASSIGNED: theme.palette.success.main,
  Production: theme.palette.info.main,
  '-': theme.palette.success.main,
  string: theme.palette.warning.main,
  CREATED: theme.palette.warning.main,
  null: theme.palette.warning.main,
})
