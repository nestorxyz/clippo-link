import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from '@convex-dev/auth/nextjs/server';

const isSignInPage = createRouteMatcher(['/login']);
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

console.log('isSignInPage', isSignInPage);
console.log('isProtectedRoute', isProtectedRoute);

export default convexAuthNextjsMiddleware(
  async (request, { convexAuth }) => {
    const isAuthenticated = await convexAuth.isAuthenticated();

    console.log('isAuthenticated', isAuthenticated);
    console.log('isSignInPage', isSignInPage(request));
    console.log('isProtectedRoute', isProtectedRoute(request));

    if (isSignInPage(request) && isAuthenticated) {
      return nextjsMiddlewareRedirect(request, '/dashboard');
    }
    if (isProtectedRoute(request) && !isAuthenticated) {
      return nextjsMiddlewareRedirect(request, '/login');
    }
  },
  { cookieConfig: { maxAge: 60 * 60 * 24 * 30 }, verbose: true }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!.*\\..*|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
};
