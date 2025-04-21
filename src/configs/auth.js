export default {
  meEndpoint: '/api/authenticate/validate',
  loginEndpoint: '/api/authenticate/signin',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken', // logout | refreshToken
  ENTERPRISEADMIN: {
    meEndpoint: '/api/authenticate/validate',
    loginEndpoint: '/api/authenticate/signin',
    homeRoute: '/admin/manage-events',
    registerEndpoint: '/jwt/register',
    storageTokenKeyName: 'accessToken',
    onTokenExpiration: 'refreshToken', // logout | refreshToken
  },
  ENTERPRISESTAFF: {
    meEndpoint: '/api/authenticate/validate',
    loginEndpoint: '/api/authenticate/signin',
    homeRoute: '/admin/manage-events',
    registerEndpoint: '/jwt/register',
    storageTokenKeyName: 'accessToken',
    onTokenExpiration: 'refreshToken', // logout | refreshToken
  },
  CLIENTSTAFF: {
    meEndpoint: '/api/authenticate/validate',
    loginEndpoint: '/api/authenticate/signin',
    homeRoute: '/client/manage-events',
    registerEndpoint: '/jwt/register',
    storageTokenKeyName: 'accessToken',
    onTokenExpiration: 'refreshToken', // logout | refreshToken
  },
  roles: [
    { role: 'SuperAdmin', displayName: 'SuperAdmin' },
    {
      role: 'Teacher',
      displayName: 'Teacher',
    },
  ],
}
