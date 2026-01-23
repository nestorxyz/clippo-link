import { httpRouter } from 'convex/server';
import { processWebhook } from './lemon';

const http = httpRouter();

http.route({
  path: '/lemon',
  method: 'POST',
  handler: processWebhook,
});

export default http;
