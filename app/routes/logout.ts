import { authenticator } from '~/services/auth.server';

import {
  LoaderFunction,
  redirect,
} from '@remix-run/node';

export let loader: LoaderFunction = async ({ request }) => {
  await authenticator.logout(request, { redirectTo: "/login" });
  return redirect("/login");
};
