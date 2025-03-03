import { authenticator } from '~/services/auth.server';

import { LoaderFunction } from '@remix-run/node';

// Handle the Google callback after the user has logged in
export let loader: LoaderFunction = async ({ request }) => {
  return authenticator.authenticate("google", request, {
    successRedirect: "/login", 
    failureRedirect: "/login", 
  });
};