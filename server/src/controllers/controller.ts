import type { Core } from '@strapi/strapi';
import { Context } from 'koa';
import analyticsService from './../services/analytics';

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  /*index(ctx) {
    ctx.body = strapi
      .plugin('strapi-google-analytics-dashboard')
      // the name of the service file & the method.
      .service('service')
      .getWelcomeMessage();
  },*/
  async index(ctx) {
    const { chartType } = ctx.params;
    const range = ctx.query.range || '7d';
    const data = await analyticsService.getChartData(chartType, range);
    ctx.send(data);
  },

  async getSettings(ctx: Context) {
    const pluginStore = strapi.store({ type: 'plugin', name: 'strapi-google-analytics-dashboard' });
    const settings = (await pluginStore.get({ key: 'settings' })) || {};
    ctx.send(settings);
  },

  async updateSettings(ctx: Context) {
    const pluginStore = strapi.store({ type: 'plugin', name: 'strapi-google-analytics-dashboard' });
    await pluginStore.set({ key: 'settings', value: ctx.request.body });
    ctx.send({ success: true });
  },
});

export default controller;
