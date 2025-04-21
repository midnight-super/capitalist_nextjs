"use client"

import { useState, useEffect } from "react"
import {
  Box,
  InputAdornment,
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography
} from "@mui/material"
import SearchIcon from '@mui/icons-material/Search'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import MoreVertIcon from '@mui/icons-material/MoreVert'

const modules = [
  {
    name: "Company Set-up",
    description: "Module Description",
    key: "company-Set-up"
  },
  {
    name: "User Management",
    description: "Module Description",
    key: "user-Management"
  },
  {
    name: "Order Management",
    description: "Module Description",
    key: "order-Management"
  },
  {
    name: "Production",
    description: "Module Description",
    key: "production"
  }
]

export default function Sidebar({
  selectedRole,
  setSelectedRole,
  roleName,
  setRoleName,
  isTouched,
  setIsTouched
}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [touchedFields, setTouchedFields] = useState({
    roleName: false
  })

  useEffect(() => {
    setSelectedRole(modules[0].key);
  }, []);

  const handleModuleClick = (index, moduleKey) => {
    setSelectedIndex(index);
    setSelectedRole(moduleKey);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <Box sx={{ flex: 1 }}>
          <TextField
            required
            fullWidth
            label="Role Name"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            onBlur={() => setTouchedFields(prev => ({ ...prev, roleName: true }))}
            error={touchedFields.roleName && !roleName.trim()}
            helperText={touchedFields.roleName && !roleName.trim() ? 'Role name is required' : ''}
          />
        </Box>
      </Box>

      <List sx={{ pt: 0 }}>
        {modules.map((module, index) => (
          <ListItem
            key={module.name}
            onClick={() => handleModuleClick(index, module.key)}
            sx={{
              mb: 1.5,
              p: 2,
              borderRadius: 1,
              backgroundColor: 'white',
              border: '1px solid rgba(0, 0, 0, 0.12)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: index === selectedIndex ? '#f0f7ff' : '#f5f5f5',
              },
              ...(index === selectedIndex && {
                backgroundColor: '#f0f7ff',
                borderColor: '#1976d2',
              }),
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <BookmarkBorderIcon
                sx={{
                  fontSize: '20px',
                  color: index === selectedIndex ? '#1976d2' : 'rgba(0, 0, 0, 0.54)',
                }}
              />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 500,
                    fontSize: '14px',
                    color: index === selectedIndex ? '#1976d2' : 'rgba(0, 0, 0, 0.87)',
                  }}
                >
                  {module.name}
                </Typography>
              }
              secondary={
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '12px',
                    color: 'rgba(0, 0, 0, 0.6)',
                    mt: 0.5
                  }}
                >
                  {module.description}
                </Typography>
              }
            />
            <IconButton
              size="small"
              sx={{
                ml: 1,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                }
              }}
            >
              <MoreVertIcon sx={{ fontSize: '20px', color: 'rgba(0, 0, 0, 0.54)' }} />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

