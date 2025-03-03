import { authenticator } from '~/services/auth.server';

import { LoaderFunction } from '@remix-run/node';

// Redirect to Google for authentication
export let loader: LoaderFunction = async ({ request }) => {
  return authenticator.authenticate("google", request);
};
