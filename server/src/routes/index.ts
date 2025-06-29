import contentAPIRoutes from './content-api';

const routes = {
  'content-api': {
    type: 'content-api',
    routes: contentAPIRoutes,
  },
};

export default routes;


/*
const routes = [
  {
    method: 'GET',
    path: '/charts/:chartType',
    handler: 'controller.index',
    config: {
      policies: [],
    },
  },
];

export default routes;*/
