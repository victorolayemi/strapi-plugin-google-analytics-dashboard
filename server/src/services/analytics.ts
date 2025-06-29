import { BetaAnalyticsDataClient } from '@google-analytics/data';

interface ChartRequest {
  propertyId: string;
  credentials: Record<string, any>;
}

function getDateRange(range: string) {
  const today = new Date();
  const start = new Date(today);
  const days = parseInt(range.replace('d', ''), 10) || 7;
  start.setDate(today.getDate() - days + 1);

  return {
    startDate: start.toISOString().split('T')[0],
    endDate: today.toISOString().split('T')[0],
  };
}

const getChartData = async (chartType: string, range: string) => {
  const pluginStore = strapi.store({ type: 'plugin', name: 'strapi-google-analytics-dashboard' });
  const settings = (await pluginStore.get({ key: 'settings' })) as ChartRequest | null;

  if (!settings || !settings.propertyId || !settings.credentials) {
    return {
      error: true,
      message:
        'Google Analytics plugin is not configured. Please provide propertyId and credentials in settings.',
    };
  }

  const { propertyId, credentials } = settings;
  const client = new BetaAnalyticsDataClient({ credentials });
  const { startDate, endDate } = getDateRange(range);

  let request: any;

  switch (chartType) {
    case 'overview':
      request = {
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'date' }],
        metrics: [{ name: 'activeUsers' }, { name: 'sessions' }, { name: 'bounceRate' }, { name: 'screenPageViews' }, { name: 'engagementRate' }, { name: 'newUsers' }],
      };
      break;

    case 'users-over-time':
      request = {
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'date' }],
        metrics: [{ name: 'activeUsers' }],
      };
      break;

    case 'users-by-country':
      request = {
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'country' }],
        metrics: [{ name: 'activeUsers' }],
        //orderBys: [{ fieldName: 'activeUsers', sortOrder: 'DESCENDING' }],
        limit: 10,
      };
      break;

    case 'users-by-device':
      request = {
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'deviceCategory' }],
        metrics: [{ name: 'activeUsers' }],
      };
      break;

    case 'sessions-by-source':
      request = {
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'sessionSource' }],
        metrics: [{ name: 'sessions' }],
        //orderBys: [{ fieldName: 'sessions', sortOrder: 'DESCENDING' }],
        limit: 10,
      };
      break;

    case 'pageviews-by-path':
      request = {
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }],
        //orderBys: [{ fieldName: 'screenPageViews', sortOrder: 'DESCENDING' }],
        limit: 10,
      };
      break;

    default:
      return { error: 'Unknown chart type' };
  }

  try {
    const [response] = await client.runReport(request);
    return response;
  } catch (err) {
    return {
      error: true,
      message: 'Invalid Google Analytics credentials or property ID.',
    };
  }
};

export default { getChartData };
