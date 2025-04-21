"use client"

import React, { useEffect, useState, useCallback, useMemo } from "react"
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Chip,
  OutlinedInput,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"
import { useForm, Controller } from "react-hook-form"
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import CloseIcon from '@mui/icons-material/Close'
import { getAllDesignation } from '@/services/designation.service'
import { getAllRoles } from '@/services/role.service'
import { getAllPermission, getPermissionById } from '@/services/permission.service'
import { updateStaff, getStaffByID } from '@/services/staff.service'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast';


// Constants
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 36 * 4.5 + 8,
      width: 250
    }
  },
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'left',
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'left',
  },
  disableScrollLock: true,
  keepMounted: true
};

const permissions = ["View", "Edit", "Create", "Delete", "All"];

// Module groups definition matching the role management structure
const MODULE_GROUPS = {
  "COMPANY_SETUP": {
    name: "Company Setup",
    description: "Company configuration settings",
    pages: [
      { name: "Task Types", permissionKey: "p_taskType" },
      { name: "Services", permissionKey: "p_service" },
      { name: "Workflows", permissionKey: "p_workflow" },
      { name: "Staff Designations", permissionKey: "p_designation" },
    ]
  },
  "USER_MANAGEMENT": {
    name: "User Management",
    description: "User and access control",
    pages: [
      { name: "Staff", permissionKey: "p_staff" },
      { name: "Clients", permissionKey: "p_client" },
      { name: "Resellers", permissionKey: "p_reseller" },
    ]
  },
  "ORDER_MANAGEMENT": {
    name: "Order Management",
    description: "Order processing and files",
    pages: [
      { name: "Orders", permissionKey: "p_order" },
      { name: "Clients", permissionKey: "p_client" },
      { name: "Files", permissionKey: "p_file" },
    ]
  },
  "PRODUCTION": {
    name: "Production",
    description: "Production management",
    pages: [
      { name: "Orders", permissionKey: "p_order" },
      { name: "Tasks", permissionKey: "p_task" },
      { name: "Files", permissionKey: "p_file" },
    ]
  }
};

// Add a new function to filter modules based on client user status
const getFilteredModuleGroups = (isClientUser) => {
  if (!isClientUser) return MODULE_GROUPS;

  // Create a filtered copy of MODULE_GROUPS
  const filteredGroups = { ...MODULE_GROUPS };

  // Remove company setup module entirely
  delete filteredGroups['COMPANY_SETUP'];

  // Filter out specific permissions from other modules
  Object.keys(filteredGroups).forEach(moduleKey => {
    filteredGroups[moduleKey] = {
      ...filteredGroups[moduleKey],
      pages: filteredGroups[moduleKey].pages.filter(page => {
        const restrictedPermissions = [
          'p_service', 'p_task', 'p_taskType',
          'p_workflow', 'p_designation', 'p_reseller'
        ];
        return !restrictedPermissions.includes(page.permissionKey);
      })
    };
  });

  return filteredGroups;
};

// Common styles for Select components
const selectStyles = {
  '& .MuiOutlinedInput-root': {
    height: '40px',
  },
  '& .MuiSelect-select': {
    padding: '8px 14px',
    minHeight: '40px !important',
  },
  '& .MuiChip-root': {
    height: '24px',
    '& .MuiChip-label': {
      fontSize: '12px',
    }
  }
};

// Common styles for Chips
const chipStyles = {
  backgroundColor: '#f0f7ff',
  borderColor: '#1976d2',
  '& .MuiChip-label': {
    color: '#1976d2',
  },
  '& .MuiChip-deleteIcon': {
    color: '#1976d2',
    '&:hover': {
      color: '#1565c0',
    },
  },
};

// Update the dialog styles constant
const dialogStyles = {
  '& .MuiDialog-root': {
    position: 'fixed',
    zIndex: 1300,
    inset: 0,
  },
  '& .MuiDialog-container': {
    height: '100%',
    outline: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  '& .MuiDialog-paper': {
    margin: 32,
    position: 'relative',
    overflowY: 'auto',
    maxHeight: 'calc(100% - 64px)',
  },
  '& .MuiBackdrop-root': {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    WebkitTapHighlightColor: 'transparent',
  }
};

// Update the loadingOverlayStyles constant
const loadingOverlayStyles = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 2,  // Increased z-index
  borderRadius: 'inherit' // Match parent's border radius if any
};

export default function Permission({
  permissions: initialPermissions,
  onChange,
  userRoles = [],
  staffId
}) {
  const { control } = useForm()
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [moduleGroups, setModuleGroups] = useState({});
  const [localPermissions, setLocalPermissions] = useState({});
  const [roles, setRoles] = useState([])
  const [selectedRoles, setSelectedRoles] = useState([])
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userPermissions, setUserPermissions] = useState(null);
  const [warningDialog, setWarningDialog] = useState({
    open: false,
    permissionDetails: null,
    onConfirm: null,
    onCancel: null
  });
  const [rolePermissions, setRolePermissions] = useState({});
  const [unsavedChanges, setUnsavedChanges] = useState({
    permissions: null,
    roles: null
  });
  const [tempPermissions, setTempPermissions] = useState(null);
  const router = useRouter();
  const isClientUser = router.query.clientUser === 'true';
  const [moduleTemplates, setModuleTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedTemplatesPerModule, setSelectedTemplatesPerModule] = useState({});

  // Update the useEffect for initial module setup
  useEffect(() => {
    const filtered = getFilteredModuleGroups(isClientUser);
    setModuleGroups(filtered);

    // Set initial module for client users to "USER_MANAGEMENT"
    if (isClientUser && !selectedModule) {
      setSelectedModule("USER_MANAGEMENT");
    } else if (!selectedModule) {
      setSelectedModule("COMPANY_SETUP"); // Default for non-client users
    }
  }, [isClientUser]); // Only depend on isClientUser

  // Update the user data fetching useEffect
  useEffect(() => {
    const fetchUserData = async () => {
      if (!staffId || !Object.keys(moduleGroups).length) return;

      try {
        setLoadingPermissions(true);
        const data = await getStaffByID(staffId);
        setUserData(data);
        setUserPermissions(data.permissions || {});

        // Fetch role permissions in parallel if roles exist
        const rolePermissionsMap = {};
        if (data.roles && data.roles.length > 0) {
          setSelectedRoles(data.roles);
          setSelectedTemplates(data.roles);

          await Promise.all(
            data.roles.map(async role => {
              if (role.permissionIds && role.permissionIds.length > 0) {
                // Fetch all permission templates for this role
                const permissionPromises = role.permissionIds.map(permId =>
                  getPermissionById(permId)
                );

                const permissionResults = await Promise.all(permissionPromises);

                // Combine all permission templates for this role using OR gate
                rolePermissionsMap[role.roleId] = permissionResults.reduce((combined, permData) => {
                  if (!combined) return permData;

                  const combinedPerms = {};
                  // Combine all permission keys
                  Object.keys({ ...combined, ...permData }).forEach(permKey => {
                    combinedPerms[permKey] = {
                      permissionRead: (combined[permKey]?.permissionRead || false) || (permData[permKey]?.permissionRead || false),
                      permissionWrite: (combined[permKey]?.permissionWrite || false) || (permData[permKey]?.permissionWrite || false),
                      permissionCreate: (combined[permKey]?.permissionCreate || false) || (permData[permKey]?.permissionCreate || false),
                      permissionDelete: (combined[permKey]?.permissionDelete || false) || (permData[permKey]?.permissionDelete || false)
                    };
                  });
                  return combinedPerms;
                }, null);
              }
            })
          );
        }
        setRolePermissions(rolePermissionsMap);

        // Initialize permissions structure by module
        const initialPermissionsByModule = {};
        Object.keys(moduleGroups).forEach(moduleKey => {
          initialPermissionsByModule[moduleKey] = moduleGroups[moduleKey].pages.map(page => {
            const userPerm = data.permissions?.[page.permissionKey];
            const rolePerms = Object.values(rolePermissionsMap).map(rp => rp[page.permissionKey]);

            const view = userPerm?.permissionRead || rolePerms.some(rp => rp?.permissionRead);
            const edit = userPerm?.permissionWrite || rolePerms.some(rp => rp?.permissionWrite);
            const create = userPerm?.permissionCreate || rolePerms.some(rp => rp?.permissionCreate);
            const delete_ = userPerm?.permissionDelete || rolePerms.some(rp => rp?.permissionDelete);

            return {
              pageName: page.name,
              permissionKey: page.permissionKey,
              view,
              edit,
              create,
              delete: delete_,
              all: view && edit && create && delete_
            };
          });
        });

        // Log the initialized permissions for debugging
        console.log('Initialized permissions:', initialPermissionsByModule);

        setLocalPermissions(initialPermissionsByModule);
        onChange(initialPermissionsByModule);

      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch user data");
      } finally {
        setLoadingPermissions(false);
      }
    };

    fetchUserData();
  }, [staffId, moduleGroups, onChange]); // Add moduleGroups as dependency

  // Update generateModules function to use filtered moduleGroups
  const generateModules = useCallback(() => {
    return Object.entries(moduleGroups).map(([key, value]) => ({
      name: value.name,
      description: value.description,
      key: key,
      pages: value.pages.map(page => page.name)
    }));
  }, [moduleGroups]);

  // Update modules variable to use the new generateModules
  const modules = useMemo(() => generateModules(), [generateModules]);

  // Update getFilteredPermissions to handle initial loading state
  const getFilteredPermissions = () => {
    if (!selectedModule || !moduleGroups[selectedModule]) {
      console.log('No selected module or module not found:', selectedModule);
      return [];
    }
    const permissions = localPermissions[selectedModule] || [];
    console.log('Filtered permissions for module:', selectedModule, permissions);
    return permissions;
  };

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesRes = await getAllRoles();
        // Filter only active roles
        const activeRoles = rolesRes.filter(role => role.status === 'ACTIVE');
        setRoles(activeRoles || []);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);

  // Update handleModuleClick to ensure state updates
  const handleModuleClick = (index, moduleKey) => {
    console.log('Switching to module:', moduleKey);
    setSelectedIndex(index);
    setSelectedModule(moduleKey);
  };

  // Update handleRoleSelect function
  const handleRoleSelect = async (event) => {
    const selectedValues = event.target.value;
    setSelectedRoles(selectedValues);
    setSelectedTemplates(selectedValues);

    try {
      setIsUpdating(true);

      // Fetch permissions for selected roles
      const rolePermissionsMap = {};
      await Promise.all(
        selectedValues.map(async role => {
          if (role.permissionIds && role.permissionIds.length > 0) {
            // Fetch all permission templates for this role
            const permissionPromises = role.permissionIds.map(permId =>
              getPermissionById(permId)
            );

            const permissionResults = await Promise.all(permissionPromises);

            // Combine all permission templates for this role using OR gate
            rolePermissionsMap[role.roleId] = permissionResults.reduce((combined, permData) => {
              if (!combined) return permData;

              const combinedPerms = {};
              // Combine all permission keys
              Object.keys({ ...combined, ...permData }).forEach(permKey => {
                combinedPerms[permKey] = {
                  permissionRead: (combined[permKey]?.permissionRead || false) || (permData[permKey]?.permissionRead || false),
                  permissionWrite: (combined[permKey]?.permissionWrite || false) || (permData[permKey]?.permissionWrite || false),
                  permissionCreate: (combined[permKey]?.permissionCreate || false) || (permData[permKey]?.permissionCreate || false),
                  permissionDelete: (combined[permKey]?.permissionDelete || false) || (permData[permKey]?.permissionDelete || false)
                };
              });
              return combinedPerms;
            }, null);
          }
        })
      );

      setRolePermissions(rolePermissionsMap);

      // Update permissions by combining user and role permissions
      const newPermissions = { ...localPermissions };
      Object.keys(moduleGroups).forEach(moduleKey => {
        newPermissions[moduleKey] = moduleGroups[moduleKey].pages.map(page => {
          const userPerm = userPermissions?.[page.permissionKey];
          const rolePerms = Object.values(rolePermissionsMap).map(rp => rp[page.permissionKey]);

          // Combine permissions using OR gate
          const view = userPerm?.permissionRead || rolePerms.some(rp => rp?.permissionRead);
          const edit = userPerm?.permissionWrite || rolePerms.some(rp => rp?.permissionWrite);
          const create = userPerm?.permissionCreate || rolePerms.some(rp => rp?.permissionCreate);
          const delete_ = userPerm?.permissionDelete || rolePerms.some(rp => rp?.permissionDelete);

          return {
            pageName: page.name,
            permissionKey: page.permissionKey,
            view,
            edit,
            create,
            delete: delete_,
            all: view && edit && create && delete_
          };
        });
      });

      // Add debug logging
      console.log('Role permissions map:', rolePermissionsMap);
      console.log('Updated permissions:', newPermissions);

      setLocalPermissions(newPermissions);
      onChange(newPermissions);

      // Store in unsaved changes
      setUnsavedChanges(prev => ({
        ...prev,
        roles: selectedValues
      }));

    } catch (error) {
      console.error('Error updating roles:', error);
      toast.error('Failed to update roles');
    } finally {
      setIsUpdating(false);
    }
  };

  // Update handlePermissionChange to handle role-based permissions
  const handlePermissionChange = (index, field) => {
    const currentPermission = localPermissions[selectedModule][index];

    // Check if this permission comes from a role
    const hasRolePermission = selectedRoles.some(role => {
      const rolePerm = rolePermissions[role.roleId]?.[currentPermission.permissionKey];
      return rolePerm && (
        (field === 'view' && rolePerm.permissionRead) ||
        (field === 'edit' && rolePerm.permissionWrite) ||
        (field === 'create' && rolePerm.permissionCreate) ||
        (field === 'delete' && rolePerm.permissionDelete)
      );
    });

    // If trying to remove a role permission, show warning
    if (hasRolePermission && currentPermission[field]) {
      setWarningDialog({
        open: true,
        permissionDetails: {
          pageName: currentPermission.pageName,
          permission: field,
          roles: selectedRoles.map(role => role.roleName).join(', ')
        },
        onConfirm: () => handleRemoveRolePermission(index, field)
      });
      return;
    }

    // Create a copy of all permissions
    const newPermissions = { ...localPermissions };

    // Get the new value for the permission
    const newValue = !currentPermission[field];

    // Update the permission in all modules where it appears
    const permissionKey = currentPermission.permissionKey;

    Object.keys(moduleGroups).forEach(moduleKey => {
      const modulePermissions = newPermissions[moduleKey];
      // Find all instances of this permission in the current module
      const permissionIndices = modulePermissions
        .map((p, idx) => p.permissionKey === permissionKey ? idx : -1)
        .filter(idx => idx !== -1);

      // Update each instance of the permission
      permissionIndices.forEach(permIndex => {
        const updatedPermission = { ...modulePermissions[permIndex] };

        if (field === "all") {
          updatedPermission.view = newValue;
          updatedPermission.edit = newValue;
          updatedPermission.create = newValue;
          updatedPermission.delete = newValue;
          updatedPermission.all = newValue;
        } else {
          updatedPermission[field] = newValue;
          updatedPermission.all = (
            updatedPermission.view &&
            updatedPermission.edit &&
            updatedPermission.create &&
            updatedPermission.delete
          );
        }

        modulePermissions[permIndex] = updatedPermission;
      });

      newPermissions[moduleKey] = modulePermissions;
    });

    // Update the state
    setLocalPermissions(newPermissions);
    setUnsavedChanges(prev => ({
      ...prev,
      permissions: newPermissions
    }));
  };

  // Add new function to handle role permission removal
  const handleRemoveRolePermission = (index, field) => {
    try {
      // Create a temporary copy of permissions
      const tempPerms = { ...localPermissions };

      // Get all permissions from roles that are being removed
      const rolePermsToRemove = selectedRoles.reduce((acc, role) => {
        const rolePerm = rolePermissions[role.roleId];
        if (rolePerm) {
          Object.keys(rolePerm).forEach(permKey => {
            if (!acc[permKey]) {
              acc[permKey] = {
                permissionRead: false,
                permissionWrite: false,
                permissionCreate: false,
                permissionDelete: false
              };
            }
            // Collect all permissions from this role
            const rolePermForKey = rolePerm[permKey];
            if (rolePermForKey) {
              acc[permKey].permissionRead = acc[permKey].permissionRead || rolePermForKey.permissionRead;
              acc[permKey].permissionWrite = acc[permKey].permissionWrite || rolePermForKey.permissionWrite;
              acc[permKey].permissionCreate = acc[permKey].permissionCreate || rolePermForKey.permissionCreate;
              acc[permKey].permissionDelete = acc[permKey].permissionDelete || rolePermForKey.permissionDelete;
            }
          });
        }
        return acc;
      }, {});

      // Update permissions by removing role-based permissions
      Object.keys(moduleGroups).forEach(moduleKey => {
        tempPerms[moduleKey] = tempPerms[moduleKey].map(permission => {
          const permKey = permission.permissionKey;
          const rolePerms = rolePermsToRemove[permKey];
          const userPerm = userPermissions?.[permKey];

          return {
            ...permission,
            view: userPerm?.permissionRead || (permission.view && !rolePerms?.permissionRead),
            edit: userPerm?.permissionWrite || (permission.edit && !rolePerms?.permissionWrite),
            create: userPerm?.permissionCreate || (permission.create && !rolePerms?.permissionCreate),
            delete: userPerm?.permissionDelete || (permission.delete && !rolePerms?.permissionDelete),
            all: false // Recalculate all flag
          };
        });
      });

      // Update states
      setLocalPermissions(tempPerms);
      setSelectedRoles([]);
      setSelectedTemplates([]);
      setWarningDialog({ open: false, permissionDetails: null, onConfirm: null, onCancel: null });

      // Store changes
      setUnsavedChanges(prev => ({
        ...prev,
        roles: [],
        permissions: tempPerms
      }));

    } catch (error) {
      console.error('Error removing role permissions:', error);
      toast.error('Failed to remove role permissions');
    }
  };

  // Update handleDeleteRole function
  const handleDeleteRole = async (roleToDelete, event) => {
    event.stopPropagation();
    try {
      setIsUpdating(true);

      // Remove the role from selections
      const newRoles = selectedRoles.filter(role => role.roleId !== roleToDelete.roleId);
      setSelectedRoles(newRoles);
      setSelectedTemplates(newRoles);

      // Update permissions display with remaining roles
      await handleRoleSelect({ target: { value: newRoles } });

    } catch (error) {
      setUpdateError(error.message);
      console.error('Error updating staff roles:', error);
      // Revert selection on error
      setSelectedRoles(selectedRoles);
      setSelectedTemplates(selectedTemplates);
    } finally {
      setIsUpdating(false);
    }
  };

  // Update fetchTemplatesByModule function
  const fetchTemplatesByModule = async (moduleKey) => {
    try {
      const allTemplates = await getAllPermission();
      // Filter templates for current module
      const filteredTemplates = allTemplates.filter(template =>
        template.moduleName === moduleKey
      );
      console.log('Templates for module:', moduleKey, filteredTemplates);
      setModuleTemplates(filteredTemplates);
    } catch (error) {
      console.error('Error fetching module templates:', error);
      toast.error('Failed to fetch templates');
    }
  };

  // Update useEffect for module selection to fetch templates
  useEffect(() => {
    if (selectedModule) {
      fetchTemplatesByModule(selectedModule);
    }
  }, [selectedModule]);

  // Update handleTemplateSelect function
  const handleTemplateSelect = async (event) => {
    try {
      setIsUpdating(true);
      const templateId = event.target.value;

      // Store the template object temporarily
      const selectedTemplateObj = moduleTemplates.find(t => t.permissionTemplateId === templateId);
      if (!selectedTemplateObj) return;

      // Fetch template permissions
      const templateData = await getPermissionById(templateId);
      console.log('Template data:', templateData);

      // Create new permissions object copying template permissions to user level
      const newPermissions = { ...localPermissions };

      // Create a map of all permission updates
      const permissionUpdates = {};

      // First, collect all permission updates from the template
      moduleGroups[selectedModule].pages.forEach(page => {
        const permKey = page.permissionKey;
        const templatePerm = templateData[permKey];
        if (templatePerm) {
          permissionUpdates[permKey] = {
            view: templatePerm.permissionRead || false,
            edit: templatePerm.permissionWrite || false,
            create: templatePerm.permissionCreate || false,
            delete: templatePerm.permissionDelete || false,
            all: templatePerm.permissionRead &&
              templatePerm.permissionWrite &&
              templatePerm.permissionCreate &&
              templatePerm.permissionDelete
          };
        }
      });

      // Then, apply these updates across all modules
      Object.keys(moduleGroups).forEach(moduleKey => {
        newPermissions[moduleKey] = moduleGroups[moduleKey].pages.map(page => {
          const permKey = page.permissionKey;
          const updatedPerm = permissionUpdates[permKey];

          // If this permission was updated in the current module, apply the update
          if (updatedPerm) {
            return {
              pageName: page.name,
              permissionKey: permKey,
              ...updatedPerm
            };
          }

          // Otherwise, keep existing permissions
          const existingPerm = newPermissions[moduleKey].find(p => p.permissionKey === permKey);
          return existingPerm || {
            pageName: page.name,
            permissionKey: permKey,
            view: false,
            edit: false,
            create: false,
            delete: false,
            all: false
          };
        });
      });

      // Check for role conflicts
      const hasRolePermissionsForModule = selectedRoles.some(role => {
        const rolePerm = rolePermissions[role.roleId];
        return rolePerm && Object.keys(permissionUpdates).some(permKey =>
          rolePerm[permKey] && (
            rolePerm[permKey].permissionRead ||
            rolePerm[permKey].permissionWrite ||
            rolePerm[permKey].permissionCreate ||
            rolePerm[permKey].permissionDelete
          )
        );
      });

      if (hasRolePermissionsForModule) {
        setWarningDialog({
          open: true,
          permissionDetails: {
            title: "Apply Template Permissions",
            message: "This will remove role-based permissions for these permissions and replace them with the template permissions. The following roles will be affected:",
            roles: selectedRoles.map(role => role.roleName).join(', ')
          },
          onConfirm: () => {
            // Apply template permissions and remove role permissions
            setLocalPermissions(newPermissions);
            setUnsavedChanges(prev => ({
              ...prev,
              permissions: newPermissions
            }));

            // Update selected template for this module
            setSelectedTemplatesPerModule(prev => ({
              ...prev,
              [selectedModule]: selectedTemplateObj
            }));

            // Remove affected roles
            const updatedRoles = selectedRoles.filter(role => {
              const rolePerm = rolePermissions[role.roleId];
              return !rolePerm || !Object.keys(permissionUpdates).some(permKey =>
                rolePerm[permKey] && (
                  rolePerm[permKey].permissionRead ||
                  rolePerm[permKey].permissionWrite ||
                  rolePerm[permKey].permissionCreate ||
                  rolePerm[permKey].permissionDelete
                )
              );
            });

            setSelectedRoles(updatedRoles);
            setSelectedTemplates(updatedRoles);
          },
          onCancel: () => {
            setSelectedTemplatesPerModule(prev => {
              const updated = { ...prev };
              delete updated[selectedModule];
              return updated;
            });
          }
        });
      } else {
        // Apply template permissions directly if no role permissions exist
        setLocalPermissions(newPermissions);
        setUnsavedChanges(prev => ({
          ...prev,
          permissions: newPermissions
        }));

        // Update selected template for this module
        setSelectedTemplatesPerModule(prev => ({
          ...prev,
          [selectedModule]: selectedTemplateObj
        }));
      }

    } catch (error) {
      console.error('Error applying template:', error);
      toast.error('Failed to apply template');
    } finally {
      setIsUpdating(false);
    }
  };

  // Update handleDeleteTemplate function
  const handleDeleteTemplate = (moduleKey) => {
    try {
      // Remove template from selected templates
      setSelectedTemplatesPerModule(prev => {
        const updated = { ...prev };
        delete updated[moduleKey];
        return updated;
      });

      // Reset permissions for this module to original state
      const newPermissions = { ...localPermissions };

      // Reset only the current module's permissions
      newPermissions[moduleKey] = moduleGroups[moduleKey].pages.map(page => {
        const permKey = page.permissionKey;
        const userPerm = userPermissions?.[permKey];
        const rolePerms = selectedRoles.map(role =>
          rolePermissions[role.roleId]?.[permKey]
        ).filter(Boolean);

        // Combine user and role permissions using OR gate
        const view = userPerm?.permissionRead || rolePerms.some(rp => rp.permissionRead);
        const edit = userPerm?.permissionWrite || rolePerms.some(rp => rp.permissionWrite);
        const create = userPerm?.permissionCreate || rolePerms.some(rp => rp.permissionCreate);
        const delete_ = userPerm?.permissionDelete || rolePerms.some(rp => rp.permissionDelete);

        return {
          pageName: page.name,
          permissionKey: permKey,
          view,
          edit,
          create,
          delete: delete_,
          all: view && edit && create && delete_
        };
      });

      setLocalPermissions(newPermissions);

      // If there are no other changes, reset unsaved changes
      const hasOtherModuleTemplates = Object.keys(selectedTemplatesPerModule)
        .filter(key => key !== moduleKey)
        .length > 0;

      const hasRoleChanges = unsavedChanges.roles !== null;

      if (!hasOtherModuleTemplates && !hasRoleChanges) {
        setUnsavedChanges(prev => ({
          ...prev,
          permissions: null
        }));
      } else {
        setUnsavedChanges(prev => ({
          ...prev,
          permissions: newPermissions
        }));
      }

    } catch (error) {
      console.error('Error removing template:', error);
      toast.error('Failed to remove template');
    }
  };

  // Update handleSaveChanges function
  const handleSaveChanges = async () => {
    try {
      setIsUpdating(true);

      if (staffId && userData) {
        const { password, ...userDataWithoutPassword } = userData;
        const updatedUserPermissions = { ...userPermissions };

        if (unsavedChanges.permissions) {
          // Get all permission keys based on whether it's a client user
          const allPermissionKeys = isClientUser ?
            ['p_staff', 'p_client', 'p_order', 'p_file'] :
            [
              'p_taskType', 'p_service', 'p_workflow', 'p_designation',
              'p_staff', 'p_client', 'p_reseller', 'p_order', 'p_file',
              'p_directory', 'p_util', 'p_task'
            ];

          // Initialize permissions with false values
          allPermissionKeys.forEach(key => {
            if (!updatedUserPermissions[key]) {
              updatedUserPermissions[key] = {
                permissionRead: false,
                permissionWrite: false,
                permissionCreate: false,
                permissionDelete: false
              };
            }
          });

          // Get role-based permissions
          const roleBasedPermissions = {};
          if (selectedRoles.length > 0) {
            selectedRoles.forEach(role => {
              const rolePerm = rolePermissions[role.roleId];
              if (rolePerm) {
                Object.keys(rolePerm).forEach(permKey => {
                  if (!roleBasedPermissions[permKey]) {
                    roleBasedPermissions[permKey] = {
                      permissionRead: false,
                      permissionWrite: false,
                      permissionCreate: false,
                      permissionDelete: false
                    };
                  }
                  const rp = rolePerm[permKey];
                  if (rp) {
                    roleBasedPermissions[permKey].permissionRead ||= rp.permissionRead;
                    roleBasedPermissions[permKey].permissionWrite ||= rp.permissionWrite;
                    roleBasedPermissions[permKey].permissionCreate ||= rp.permissionCreate;
                    roleBasedPermissions[permKey].permissionDelete ||= rp.permissionDelete;
                  }
                });
              }
            });
          }

          // For client users, handle p_client permission specially
          if (isClientUser) {
            let clientPermissions = {
              permissionRead: false,
              permissionWrite: false,
              permissionCreate: false,
              permissionDelete: false
            };

            let foundClientPerm = false;
            // Collect p_client permissions from both modules
            Object.keys(moduleGroups).forEach(moduleKey => {
              const modulePermissions = unsavedChanges.permissions[moduleKey];
              if (modulePermissions) {
                const clientPerm = modulePermissions.find(p => p.permissionKey === 'p_client');
                if (clientPerm) {
                  foundClientPerm = true;
                  // Use direct assignment instead of OR for the first found permission
                  if (!clientPermissions.permissionRead && !clientPermissions.permissionWrite &&
                    !clientPermissions.permissionCreate && !clientPermissions.permissionDelete) {
                    clientPermissions = {
                      permissionRead: clientPerm.view,
                      permissionWrite: clientPerm.edit,
                      permissionCreate: clientPerm.create,
                      permissionDelete: clientPerm.delete
                    };
                  } else {
                    // For subsequent modules, use OR to combine permissions
                    clientPermissions.permissionRead = clientPermissions.permissionRead || clientPerm.view;
                    clientPermissions.permissionWrite = clientPermissions.permissionWrite || clientPerm.edit;
                    clientPermissions.permissionCreate = clientPermissions.permissionCreate || clientPerm.create;
                    clientPermissions.permissionDelete = clientPermissions.permissionDelete || clientPerm.delete;
                  }
                }
              }
            });

            // If we found client permissions in any module, update them
            if (foundClientPerm) {
              // Remove role-based permissions
              const roleClientPerm = roleBasedPermissions['p_client'];
              if (roleClientPerm) {
                clientPermissions.permissionRead = clientPermissions.permissionRead && !roleClientPerm.permissionRead;
                clientPermissions.permissionWrite = clientPermissions.permissionWrite && !roleClientPerm.permissionWrite;
                clientPermissions.permissionCreate = clientPermissions.permissionCreate && !roleClientPerm.permissionCreate;
                clientPermissions.permissionDelete = clientPermissions.permissionDelete && !roleClientPerm.permissionDelete;
              }

              // Set the combined p_client permissions
              updatedUserPermissions['p_client'] = clientPermissions;
            } else {
              // If no client permissions were found in any module, set all to false
              updatedUserPermissions['p_client'] = {
                permissionRead: false,
                permissionWrite: false,
                permissionCreate: false,
                permissionDelete: false
              };
            }

            // Add debug logging
            console.log('Client permissions after update:', clientPermissions);
            console.log('Role-based client permissions:', roleBasedPermissions['p_client']);
          }

          // Handle other permissions
          Object.keys(moduleGroups).forEach(moduleKey => {
            unsavedChanges.permissions[moduleKey]?.forEach(permission => {
              const permKey = permission.permissionKey;
              if (permKey && (!isClientUser || (permKey !== 'p_client' && allPermissionKeys.includes(permKey)))) {
                const rolePerm = roleBasedPermissions[permKey];
                updatedUserPermissions[permKey] = {
                  permissionRead: permission.view && !(rolePerm?.permissionRead),
                  permissionWrite: permission.edit && !(rolePerm?.permissionWrite),
                  permissionCreate: permission.create && !(rolePerm?.permissionCreate),
                  permissionDelete: permission.delete && !(rolePerm?.permissionDelete)
                };
              }
            });
          });
        }

        console.log('Updating permissions:', updatedUserPermissions);

        const response = await updateStaff({
          ...userDataWithoutPassword,
          permissions: updatedUserPermissions,
          roles: unsavedChanges.roles || selectedRoles
        });

        if (response === 'OPERATION_SUCCESS') {
          toast.success('Permissions updated successfully');
          router.back();

          setUserPermissions(updatedUserPermissions);
          setTempPermissions(null);
          setUnsavedChanges({ permissions: null, roles: null });
        } else {
          throw new Error('Failed to update staff');
        }
      }
    } catch (error) {
      setUpdateError(error.message);
      console.error('Error updating staff:', error);
      toast.error('Failed to update permissions');
    } finally {
      setIsUpdating(false);
    }
  };

  // Update renderPermissionCell to handle OR-gated permissions
  const renderPermissionCell = (row, permission, rowIndex) => {
    const permissionKey = permission.toLowerCase();

    return (
      <TableCell key={permission} align="center" padding="checkbox">
        <Checkbox
          checked={row[permissionKey] || row.all}
          onChange={() => handlePermissionChange(rowIndex, permissionKey)}
          sx={{
            padding: '9px',
            '& .MuiSvgIcon-root': { fontSize: '20px' }
          }}
        />
      </TableCell>
    );
  };

  // Update handleCancel function
  const handleCancel = async () => {
    try {
      setLoadingPermissions(true);

      // Fetch fresh data from the server to restore original state
      const data = await getStaffByID(staffId);

      // Restore original roles
      setSelectedRoles(data.roles || []);
      setSelectedTemplates(data.roles || []);

      // Fetch and restore original role permissions
      const rolePermissionsMap = {};
      if (data.roles && data.roles.length > 0) {
        await Promise.all(
          data.roles.map(async role => {
            if (role.permissionIds && role.permissionIds.length > 0) {
              // Fetch all permission templates for this role
              const permissionPromises = role.permissionIds.map(permId =>
                getPermissionById(permId)
              );

              const permissionResults = await Promise.all(permissionPromises);

              // Combine all permission templates for this role using OR gate
              rolePermissionsMap[role.roleId] = permissionResults.reduce((combined, permData) => {
                if (!combined) return permData;

                const combinedPerms = {};
                // Combine all permission keys
                Object.keys({ ...combined, ...permData }).forEach(permKey => {
                  combinedPerms[permKey] = {
                    permissionRead: (combined[permKey]?.permissionRead || false) || (permData[permKey]?.permissionRead || false),
                    permissionWrite: (combined[permKey]?.permissionWrite || false) || (permData[permKey]?.permissionWrite || false),
                    permissionCreate: (combined[permKey]?.permissionCreate || false) || (permData[permKey]?.permissionCreate || false),
                    permissionDelete: (combined[permKey]?.permissionDelete || false) || (permData[permKey]?.permissionDelete || false)
                  };
                });
                return combinedPerms;
              }, null);
            }
          })
        );
      }
      setRolePermissions(rolePermissionsMap);

      // Restore original permissions
      const originalPermissionsByModule = {};
      Object.keys(moduleGroups).forEach(moduleKey => {
        originalPermissionsByModule[moduleKey] = moduleGroups[moduleKey].pages.map(page => {
          const userPerm = data.permissions?.[page.permissionKey];
          const rolePerms = Object.values(rolePermissionsMap).map(rp => rp[page.permissionKey]);

          // Combine user and role permissions using OR gate
          const view = userPerm?.permissionRead || rolePerms.some(rp => rp?.permissionRead);
          const edit = userPerm?.permissionWrite || rolePerms.some(rp => rp?.permissionWrite);
          const create = userPerm?.permissionCreate || rolePerms.some(rp => rp?.permissionCreate);
          const delete_ = userPerm?.permissionDelete || rolePerms.some(rp => rp?.permissionDelete);

          return {
            pageName: page.name,
            permissionKey: page.permissionKey,
            view,
            edit,
            create,
            delete: delete_,
            all: view && edit && create && delete_
          };
        });
      });

      // Update states
      setUserData(data);
      setUserPermissions(data.permissions || {});
      setLocalPermissions(originalPermissionsByModule);
      setTempPermissions(null);
      onChange(originalPermissionsByModule);

      // Clear unsaved changes
      setUnsavedChanges({
        permissions: null,
        roles: null
      });

      // Close any open dialogs
      setWarningDialog({
        open: false,
        permissionDetails: null,
        onConfirm: null,
        onCancel: null
      });

      // Also reset selected templates
      setSelectedTemplatesPerModule({});

    } catch (error) {
      console.error('Error reverting changes:', error);
      toast.error('Failed to revert changes');
    } finally {
      setLoadingPermissions(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 3 }}>
      {/* Sidebar with roles */}
      <Box sx={{ width: '300px', flexShrink: 0 }}>
        <Box sx={{ mb: 4 }}>
          <FormControl fullWidth>
            <InputLabel>Select Roles</InputLabel>
            <Select
              multiple
              value={selectedRoles}
              onChange={handleRoleSelect}
              input={<OutlinedInput label="Select Roles" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((role) => (
                    <Chip
                      key={role.roleId}
                      label={role.roleName}
                      size="small"
                      onDelete={(event) => handleDeleteRole(role, event)}
                      deleteIcon={
                        <CloseIcon
                          onMouseDown={(event) => {
                            event.stopPropagation();
                          }}
                        />
                      }
                      sx={chipStyles}
                    />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
              sx={{
                ...selectStyles,
                '& .MuiSelect-select': {
                  minHeight: '40px !important',
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 0.5,
                  padding: '8px 14px'
                }
              }}
            >
              {roles.length > 0 ? (
                roles.map((role) => (
                  <MenuItem
                    key={role.roleId}
                    value={role}
                    sx={{
                      height: 48,
                      '&.Mui-selected': {
                        backgroundColor: '#f0f7ff',
                      },
                    }}
                  >
                    <Checkbox
                      checked={selectedRoles.some(r => r.roleId === role.roleId)}
                    />
                    <ListItemText
                      primary={role.roleName}
                    />
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No roles available</MenuItem>
              )}
            </Select>
          </FormControl>
        </Box>

        <List sx={{ pt: 0 }}>
          {modules.map((module, index) => (
            <ListItem
              key={module.key}
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
              <IconButton size="small">
                <MoreVertIcon sx={{ fontSize: '20px', color: 'rgba(0, 0, 0, 0.54)' }} />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Main content */}
      <Box sx={{ flex: 1 }}>
        <Paper variant="outlined" sx={{ p: 4, boxShadow: 'none' }}>
          {/* Filter template dropdown */}
          <Box sx={{ mb: 4 }}>
            <FormControl fullWidth>
              <InputLabel>Filter Template</InputLabel>
              <Select
                value={selectedTemplatesPerModule[selectedModule]?.permissionTemplateId || ''}
                onChange={handleTemplateSelect}
                input={<OutlinedInput label="Filter Template" />}
                renderValue={(selected) => {
                  const currentTemplate = selectedTemplatesPerModule[selectedModule];
                  return (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {currentTemplate && (
                        <Chip
                          key={currentTemplate.permissionTemplateId}
                          label={currentTemplate.templateName}
                          size="small"
                          onDelete={() => handleDeleteTemplate(selectedModule)}
                          deleteIcon={
                            <CloseIcon
                              onMouseDown={(event) => {
                                event.stopPropagation();
                              }}
                            />
                          }
                          sx={{
                            ...chipStyles,
                            margin: '2px'
                          }}
                        />
                      )}
                    </Box>
                  );
                }}
                MenuProps={MenuProps}
                sx={{
                  ...selectStyles,
                  '& .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 14px',
                    minHeight: '40px !important'
                  }
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {moduleTemplates.map((template) => (
                  <MenuItem
                    key={template.permissionTemplateId}
                    value={template.permissionTemplateId}
                    sx={{
                      height: 48,
                      '&:hover': {
                        backgroundColor: '#f5f5f5'
                      },
                      '&.Mui-selected': {
                        backgroundColor: '#f0f7ff'
                      }
                    }}
                  >
                    <ListItemText primary={template.templateName} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              {modules.find(m => m.key === selectedModule)?.name} Permissions
            </Typography>
          </Box>

          <TableContainer
            sx={{
              position: 'relative',
              minHeight: '200px',
              '& .MuiTable-root': {
                position: 'relative',
                zIndex: 1
              }
            }}
          >
            {(isUpdating || loadingPermissions) && (
              <Box sx={{
                ...loadingOverlayStyles,
                position: 'absolute',
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
              }}>
                <CircularProgress size={24} />
              </Box>
            )}
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{
                    fontWeight: 500,
                    fontSize: '12px',
                    color: '#000000',
                    borderBottom: '1px solid #e0e0e0',
                    width: '200px'
                  }}>
                    Page Name
                  </TableCell>
                  {permissions.map(permission => (
                    <TableCell
                      key={permission}
                      align="center"
                      sx={{
                        fontWeight: 500,
                        fontSize: '12px',
                        color: '#000000',
                        borderBottom: '1px solid #e0e0e0',
                        minWidth: '100px'
                      }}
                    >
                      {permission}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(getFilteredPermissions()) && getFilteredPermissions().map((row, index) => (
                  <TableRow key={row.pageName} sx={{ '&:hover': { backgroundColor: '#fafafa' } }}>
                    <TableCell sx={{ fontSize: '14px', fontWeight: 400 }}>
                      {row.pageName}
                    </TableCell>
                    {permissions.map(permission => renderPermissionCell(row, permission, index))}
                  </TableRow>
                ))}
                {!Array.isArray(getFilteredPermissions()) || getFilteredPermissions().length === 0 && (
                  <TableRow>
                    <TableCell colSpan={permissions.length + 1} align="center">
                      No permissions available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleCancel}
            disabled={!unsavedChanges.permissions && !unsavedChanges.roles}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: '4px',
              textTransform: 'none',
              fontSize: '14px',
              fontWeight: 500,
              fontFamily: 'Roboto, sans-serif'
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSaveChanges}
            disabled={!unsavedChanges.permissions && !unsavedChanges.roles}
            sx={{
              px: 4,
              py: 1.5,
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0',
              },
              borderRadius: '4px',
              textTransform: 'none',
              fontSize: '14px',
              fontWeight: 500,
              fontFamily: 'Roboto, sans-serif'
            }}
          >
            Save Changes
          </Button>
        </Box>
      </Box>

      {/* Warning Dialog */}
      <Dialog
        open={warningDialog.open}
        onClose={() => setWarningDialog({ open: false, permissionDetails: null, onConfirm: null, onCancel: null })}
        PaperProps={{
          sx: {
            width: '400px',
            p: 1,
            borderRadius: '4px'
          }
        }}
        sx={dialogStyles}
        disablePortal
        disableEnforceFocus
        disableAutoFocus
        disableScrollLock
        keepMounted={false}
      >
        <DialogTitle sx={{
          p: 2,
          fontSize: '18px',
          fontWeight: 500,
          color: 'rgba(0, 0, 0, 0.87)',
          fontFamily: 'Roboto, sans-serif'
        }}>
          {warningDialog.permissionDetails?.title}
        </DialogTitle>
        <DialogContent sx={{ p: 2 }}>
          <Typography sx={{
            fontSize: '14px',
            color: 'rgba(0, 0, 0, 0.67)',
            fontFamily: 'Roboto, sans-serif',
            mb: 1
          }}>
            {warningDialog.permissionDetails?.message}
          </Typography>
          {warningDialog.permissionDetails?.roles && (
            <Typography sx={{
              fontSize: '14px',
              color: 'rgba(0, 0, 0, 0.87)',
              fontWeight: 500,
              fontFamily: 'Roboto, sans-serif'
            }}>
              {warningDialog.permissionDetails.roles}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button
            onClick={() => {
              warningDialog.onCancel?.();
              setWarningDialog({ open: false, permissionDetails: null, onConfirm: null, onCancel: null });
            }}
            sx={{
              textTransform: 'none',
              color: 'rgba(0, 0, 0, 0.67)',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              warningDialog.onConfirm?.();
              setWarningDialog({ open: false, permissionDetails: null, onConfirm: null, onCancel: null });
            }}
            variant="contained"
            sx={{
              textTransform: 'none',
              backgroundColor: '#1976d2',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: '#1565c0'
              }
            }}
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

