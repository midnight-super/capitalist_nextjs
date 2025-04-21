import adminRoutes from './admin.routes';
import clientRoutes from './client.routes';
import companyRoutes from './company.routes';
import userManagementRoutes from './userManagement.routes';

const getRoutes = (role = '', pathName) => {
  switch (role) {
    case 'ENTERPRISEADMIN':
      if (pathName === 'companyPath') {
        return companyRoutes;
      } else if (pathName === 'userManagementPath') {
        return userManagementRoutes;
      }
      return adminRoutes;
    case 'ENTERPRISESTAFF':
      return adminRoutes;
    case 'CLIENTSTAFF':
      return clientRoutes;
    default:
      return [];
  }
};

export default getRoutes;
