"use client"

import { useState, useEffect } from "react"
import { useRouter } from 'next/router'
import {
    Box,
    FormControl,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    Button,
    Typography,
    TextField,
    Paper,
    InputLabel,
    OutlinedInput,
    ListItemText,
    Chip
} from "@mui/material"
import { createPermission, getPermissionById, updatePermission, getAllPermission } from '@/services/permission.service'
import { createRole, updateRole } from '@/services/role.service'
import toast from 'react-hot-toast'
import CloseIcon from '@mui/icons-material/Close'

const permissions = ["View", "Edit", "Create", "Delete", "All"]

// Define page names and their permission keys
const roleData = {
    "company-Set-up": {
        title: "Company Set-up",
        rows: [
            { name: "Task Types", permissionKey: "p_taskType" },
            { name: "Services", permissionKey: "p_service" },
            { name: "Workflows", permissionKey: "p_workflow" },
            { name: "Staff Designations", permissionKey: "p_designation" },
        ],
    },
    "user-Management": {
        title: "User Management",
        rows: [
            { name: "Staff", permissionKey: "p_staff" },
            { name: "Clients", permissionKey: "p_client" },
            { name: "Resellers", permissionKey: "p_reseller" },
        ],
    },
    "order-Management": {
        title: "Order Management",
        rows: [
            { name: "Orders", permissionKey: "p_order" },
            { name: "Clients", permissionKey: "p_client" },
            { name: "Files", permissionKey: "p_file" },
        ],
    },
    "production": {
        title: "Production",
        rows: [
            { name: "Orders", permissionKey: "p_order" },
            { name: "Tasks", permissionKey: "p_task" },
            { name: "Files", permissionKey: "p_file" },
        ],
    },
}

// Add this MenuProps configuration at the top of the file
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: 48 * 4.5 + 8,
            width: 250
        }
    },
    // Prevent layout shifts
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

// Add MODULE_NAMES constant at the top
const MODULE_NAMES = {
    "company-Set-up": "COMPANY_SETUP",
    "user-Management": "USER_MANAGEMENT",
    "order-Management": "ORDER_MANAGEMENT",
    "production": "PRODUCTION"
};

export default function PermissionsTable({
    selectedRole = "company-Set-up",
    setSelectedRole,
    roleName,
    description,
    setDescription,
    isTouched,
    setIsTouched,
    isEdit,
    roleId,
    permissionId,
    permissionTemplate,
    templateName: initialTemplateName
}) {
    const router = useRouter()
    const { id } = router.query
    const [templateName, setTemplateName] = useState(initialTemplateName || "")
    const [touchedFields, setTouchedFields] = useState({
        templateName: false,
        roleName: false,
        description: false
    });
    const [permissionsState, setPermissionsState] = useState(() => {
        const initialState = JSON.parse(JSON.stringify(roleData));
        Object.keys(initialState).forEach(moduleKey => {
            initialState[moduleKey].rows.forEach(row => {
                row.permissions = [];
            });
        });
        return initialState;
    });
    const [preConfiguredTemplates, setPreConfiguredTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [tempSelectedRoles, setTempSelectedRoles] = useState([]);
    const [permissionsChanged, setPermissionsChanged] = useState(false);
    const [allPermissionTemplates, setAllPermissionTemplates] = useState({});

    useEffect(() => {
        if (permissionTemplate && Array.isArray(permissionTemplate)) {
            // Create a map of templates by module
            const templatesByModule = permissionTemplate.reduce((acc, template) => {
                acc[template.moduleName] = template;
                return acc;
            }, {});
            setAllPermissionTemplates(templatesByModule);

            // Initialize permissions state for all modules
            const newState = JSON.parse(JSON.stringify(roleData));
            Object.keys(newState).forEach(moduleKey => {
                const moduleName = MODULE_NAMES[moduleKey];
                const moduleTemplate = templatesByModule[moduleName];

                if (moduleTemplate) {
                    newState[moduleKey].rows.forEach(row => {
                        const permData = moduleTemplate[row.permissionKey];
                        row.permissions = [];

                        if (permData) {
                            if (permData.permissionRead) row.permissions.push('View');
                            if (permData.permissionWrite) row.permissions.push('Edit');
                            if (permData.permissionCreate) row.permissions.push('Create');
                            if (permData.permissionDelete) row.permissions.push('Delete');
                            if (row.permissions.length === 4) {
                                row.permissions.push('All');
                            }
                        }
                    });
                }
            });
            setPermissionsState(newState);
            setPermissionsChanged(false); // Reset changes flag after loading
        }
    }, [permissionTemplate]);

    useEffect(() => {
        if (initialTemplateName) {
            setTemplateName(initialTemplateName);
        }
    }, [initialTemplateName]);

    // Fetch pre-configured templates
    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const templates = await getAllPermission();
                // Filter templates based on isStandard flag
                const standardTemplates = templates.filter(template => template.isStandard === true);
                setPreConfiguredTemplates(standardTemplates || []);
            } catch (error) {
                console.error("Error fetching templates:", error);
                toast.error("Failed to fetch templates");
            }
        };
        fetchTemplates();
    }, []);

    // Handle template selection
    const handleTemplateSelect = (event) => {
        const selectedTemplateName = event.target.value;
        setSelectedTemplate(selectedTemplateName);
        setPermissionsChanged(true);

        if (!selectedTemplateName) {
            // Reset permissions if "None" is selected
            resetPermissions();
            return;
        }

        // Find the selected template from preConfiguredTemplates
        const template = preConfiguredTemplates.find(t => t.templateName === selectedTemplateName);
        if (template) {
            const newState = JSON.parse(JSON.stringify(roleData));
            Object.keys(newState).forEach(moduleKey => {
                newState[moduleKey].rows.forEach(row => {
                    const permKey = row.permissionKey;
                    if (template[permKey]) {
                        row.permissions = [];
                        if (template[permKey].permissionRead) row.permissions.push('View');
                        if (template[permKey].permissionWrite) row.permissions.push('Edit');
                        if (template[permKey].permissionCreate) row.permissions.push('Create');
                        if (template[permKey].permissionDelete) row.permissions.push('Delete');
                        if (row.permissions.length === 4) {
                            row.permissions.push('All');
                        }
                    }
                });
            });
            setPermissionsState(newState);
        }
    };

    const handlePermissionChange = (moduleKey, rowName, permission) => {
        setPermissionsChanged(true);
        setPermissionsState(prev => {
            const newState = JSON.parse(JSON.stringify(prev));
            const row = newState[moduleKey].rows.find(r => r.name === rowName);

            if (permission === "All") {
                if (!row.permissions.includes("All")) {
                    row.permissions = ["View", "Edit", "Create", "Delete", "All"];
                } else {
                    row.permissions = [];
                }
            } else {
                const hasPermission = row.permissions.includes(permission);

                if (hasPermission) {
                    // Remove the permission and "All"
                    row.permissions = row.permissions.filter(p => p !== permission && p !== "All");
                } else {
                    // Add the permission and its dependencies
                    switch (permission) {
                        case "Edit":
                            if (!row.permissions.includes("View")) row.permissions.push("View");
                            row.permissions.push("Edit");
                            break;
                        case "Create":
                            if (!row.permissions.includes("View")) row.permissions.push("View");
                            row.permissions.push("Create");
                            break;
                        case "Delete":
                            if (!row.permissions.includes("View")) row.permissions.push("View");
                            row.permissions.push("Delete");
                            break;
                        default:
                            row.permissions.push(permission);
                    }

                    // Check if all permissions are selected
                    const hasAllPermissions = ["View", "Edit", "Create", "Delete"].every(p =>
                        row.permissions.includes(p)
                    );

                    if (hasAllPermissions && !row.permissions.includes("All")) {
                        row.permissions.push("All");
                    }
                }
            }

            return newState;
        });
    };

    // Modify formatPayload to only include permissions for current module
    const formatPayload = () => {
        const payload = {
            ...(isEdit && { permissionTemplateId: permissionId }),
            moduleName: MODULE_NAMES[selectedRole],
            isStandard: false,
            templateName: `${roleName}_${MODULE_NAMES[selectedRole]}`  // Create unique template name per module
        };

        // Initialize consolidatedPermissions with default values for current module only
        const consolidatedPermissions = {};
        roleData[selectedRole].rows.forEach(row => {
            consolidatedPermissions[row.permissionKey] = {
                permissionRead: permissionsState[selectedRole].rows.find(r => r.name === row.name)?.permissions?.includes('View') || false,
                permissionWrite: permissionsState[selectedRole].rows.find(r => r.name === row.name)?.permissions?.includes('Edit') || false,
                permissionCreate: permissionsState[selectedRole].rows.find(r => r.name === row.name)?.permissions?.includes('Create') || false,
                permissionDelete: permissionsState[selectedRole].rows.find(r => r.name === row.name)?.permissions?.includes('Delete') || false
            };
        });

        return {
            ...payload,
            ...consolidatedPermissions
        };
    };

    // Modify handleSaveChanges to handle both creation and updating
    const handleSaveChanges = async () => {
        setIsSaving(true);
        try {
            setTouchedFields({
                roleName: true,
                description: true
            });

            if (!roleName.trim() || !description.trim()) {
                return;
            }

            const permissionIds = [];

            // Create/Update permission template for each module
            for (const moduleKey of Object.keys(roleData)) {
                const moduleName = MODULE_NAMES[moduleKey];

                // Get permissions for this module
                const modulePermissions = {};
                roleData[moduleKey].rows.forEach(row => {
                    modulePermissions[row.permissionKey] = {
                        permissionRead: permissionsState[moduleKey].rows.find(r => r.name === row.name)?.permissions?.includes('View') || false,
                        permissionWrite: permissionsState[moduleKey].rows.find(r => r.name === row.name)?.permissions?.includes('Edit') || false,
                        permissionCreate: permissionsState[moduleKey].rows.find(r => r.name === row.name)?.permissions?.includes('Create') || false,
                        permissionDelete: permissionsState[moduleKey].rows.find(r => r.name === row.name)?.permissions?.includes('Delete') || false
                    };
                });

                if (isEdit) {
                    // For edit: Update existing template or create new one for module
                    const existingTemplate = allPermissionTemplates[moduleName];
                    const permissionPayload = {
                        ...(existingTemplate?.permissionTemplateId && { permissionTemplateId: existingTemplate.permissionTemplateId }),
                        moduleName: moduleName,
                        isStandard: false,
                        templateName: `${roleName}_${moduleName}`,
                        ...modulePermissions
                    };

                    let templateId;
                    if (existingTemplate?.permissionTemplateId) {
                        await updatePermission(existingTemplate.permissionTemplateId, permissionPayload);
                        templateId = existingTemplate.permissionTemplateId;
                    } else {
                        templateId = await createPermission(permissionPayload);
                    }
                    permissionIds.push(templateId);
                } else {
                    // For create: Create new template for each module
                    const permissionPayload = {
                        moduleName: moduleName,
                        isStandard: false,
                        templateName: `${roleName}_${moduleName}`,
                        ...modulePermissions
                    };
                    const templateId = await createPermission(permissionPayload);
                    permissionIds.push(templateId);
                }
            }

            if (isEdit) {
                // Update existing role
                const rolePayload = {
                    roleId: roleId,
                    roleName: roleName,
                    description: description,
                    permissionIds: permissionIds,
                    status: 'ACTIVE'
                };
                await updateRole(rolePayload);
                toast.success('Role updated successfully');
            } else {
                // Create new role
                const rolePayload = {
                    roleName: roleName,
                    description: description,
                    permissionIds: permissionIds,
                    status: 'ACTIVE'
                };
                await createRole(rolePayload);
                toast.success('Role created successfully');
            }

            router.push('/user-management/role-management');

        } catch (error) {
            console.error('Error in save process:', error);
            toast.error('Failed to save changes');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <Box sx={{ flex: 1 }}>
                    <TextField
                        required
                        fullWidth
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        onBlur={() => setTouchedFields(prev => ({ ...prev, description: true }))}
                        error={touchedFields.description && !description.trim()}
                        helperText={touchedFields.description && !description.trim() ? 'Description is required' : ''}
                    />
                </Box>
            </Box>
            <Paper
                variant="outlined"
                sx={{
                    p: 4,
                    boxShadow: 'none'
                }}
            >
                <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>

                    {/* Right side - Pre-configured templates dropdown */}
                    <Box sx={{ flex: 1 }}>
                        <FormControl fullWidth>
                            <InputLabel>Pre-configured Templates</InputLabel>
                            <Select
                                value={selectedTemplate}
                                onChange={handleTemplateSelect}
                                input={<OutlinedInput label="Pre-configured Templates" />}
                                MenuProps={MenuProps}
                                sx={{
                                    height: '56px',
                                    '& .MuiSelect-select': {
                                        minHeight: 56,
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '8px 14px'
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'rgba(0, 0, 0, 0.23)'
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'rgba(0, 0, 0, 0.87)'
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#1976d2'
                                    }
                                }}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {preConfiguredTemplates.map((template) => (
                                    <MenuItem
                                        key={template.permissionTemplateId}
                                        value={template.templateName}
                                        sx={{
                                            height: 48,
                                            '&:hover': {
                                                backgroundColor: '#f5f5f5'
                                            },
                                            '&.Mui-selected': {
                                                backgroundColor: '#f0f7ff',
                                                '&:hover': {
                                                    backgroundColor: '#e3f2fd'
                                                }
                                            }
                                        }}
                                    >
                                        {template.templateName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Box>

                <Typography
                    sx={{
                        fontSize: '24px',
                        fontWeight: 400,
                        color: '#000000',
                        marginBottom: '10px',
                        fontFamily: 'Roboto, sans-serif'
                    }}
                >
                    {roleData[selectedRole]?.title} Permissions
                </Typography>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    sx={{
                                        fontWeight: 500,
                                        fontSize: '12px',
                                        color: '#000000',
                                        borderBottom: '1px solid #e0e0e0',
                                        borderTop: 'none',
                                        backgroundColor: '#fff',
                                        padding: '12px 16px',
                                        width: '200px',
                                        fontFamily: 'Roboto, sans-serif'
                                    }}
                                >
                                    Page Name
                                </TableCell>
                                {permissions.map((permission) => (
                                    <TableCell
                                        key={permission}
                                        align="center"
                                        sx={{
                                            fontWeight: 500,
                                            fontSize: '12px',
                                            color: '#000000',
                                            borderBottom: '1px solid #e0e0e0',
                                            borderTop: 'none',
                                            backgroundColor: '#fff',
                                            padding: '12px 16px',
                                            minWidth: '100px',
                                            fontFamily: 'Roboto, sans-serif'
                                        }}
                                    >
                                        {permission}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {permissionsState[selectedRole]?.rows.map((row, index) => (
                                <TableRow
                                    key={row.name}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: '#fafafa'
                                        }
                                    }}
                                >
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        sx={{
                                            padding: '12px 16px',
                                            borderBottom: '1px solid #e0e0e0',
                                            fontSize: '14px',
                                            fontWeight: 400,
                                            color: '#000000',
                                            fontFamily: 'Roboto, sans-serif'
                                        }}
                                    >
                                        {row.name}
                                    </TableCell>
                                    {permissions.map((permission) => (
                                        <TableCell
                                            key={permission}
                                            align="center"
                                            padding="checkbox"
                                            sx={{
                                                borderBottom: '1px solid #e0e0e0',
                                                padding: '8px 16px'
                                            }}
                                        >
                                            <Checkbox
                                                checked={row.permissions?.includes(permission)}
                                                onChange={() => handlePermissionChange(selectedRole, row.name, permission)}
                                                sx={{
                                                    '&.Mui-checked': {
                                                        color: '#1976d2',
                                                    },
                                                    padding: '9px',
                                                    '& .MuiSvgIcon-root': {
                                                        fontSize: '20px'
                                                    }
                                                }}
                                            />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>


            </Paper>
            <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>

                <Button
                    variant="outlined"
                    color="inherit"

                    sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: '4px',
                        textTransform: 'none',
                        fontSize: '14px',
                        fontWeight: 500,
                        fontFamily: 'Roboto, sans-serif'
                    }}
                    onClick={() => router.back()}
                >
                    Cancel
                </Button>



                <Button
                    variant="contained"
                    onClick={handleSaveChanges}
                    disabled={(!touchedFields.roleName && !touchedFields.description && !permissionsChanged) || isSaving}
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
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
            </Box>
        </Box>
    )
}

