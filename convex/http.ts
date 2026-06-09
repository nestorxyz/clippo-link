import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { processWebhook } from './lemon';
import { Id } from './_generated/dataModel';

const http = httpRouter();

http.route({
  path: '/lemon',
  method: 'POST',
  handler: processWebhook,
});

http.route({
  path: '/images',
  method: 'GET',
  handler: httpAction(async (ctx, request) => {
    const { searchParams } = new URL(request.url);
    const storageId = searchParams.get('id');
    if (!storageId) {
      return new Response(null, { status: 400, statusText: 'Missing id' });
    }
    try {
      const blob = await ctx.storage.get(storageId as Id<'_storage'>);
      if (!blob) {
        return new Response(null, { status: 404, statusText: 'Image not found' });
      }
      return new Response(blob, {
        headers: {
          'Content-Type': blob.type,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    } catch (error) {
      console.warn('Invalid storage ID:', storageId);
      return new Response(null, { status: 404, statusText: 'Invalid image ID' });
    }
  }),
});

export default http;
