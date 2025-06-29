export default [
  /*{
    method: 'GET',
    path: '/',
    // name of the controller file & the method.
    handler: 'controller.index',
    config: {
      policies: [],
    },
  },*/
  {
    method: 'GET',
    path: '/charts/:chartType',
    handler: 'controller.index',
    config: {
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/settings',
    handler: 'controller.getSettings',
    config: {
      auth: false,
    },
  },
  {
    method: 'PUT',
    path: '/settings',
    handler: 'controller.updateSettings',
    config: {
      auth: false,
    },
  },
];
