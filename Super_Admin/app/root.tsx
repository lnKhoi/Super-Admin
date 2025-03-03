import './tailwind.css';

import { ThemeProvider } from 'remix-themes';
import DefaultErrorBoundary from '~/components/ui/error-boundary';
import iconsHref from '~/components/ui/icons/sprite.svg?url';

import {
  type LinksFunction,
  LoaderFunctionArgs,
} from '@remix-run/node';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';

import { AuthContextProvider } from './contexts/auth.context';
import { themeSessionResolver } from './services/sessions.server';

export const links: LinksFunction = () => [
  { rel: 'prefetch', href: iconsHref, as: 'image' },
]

export async function loader({ request }: LoaderFunctionArgs) {
  const { getTheme } = await themeSessionResolver(request);
  return { 
    theme: getTheme(), 
    ENV:process.env.API_URL
  };
}

export default function AppWithProviders() {
  const data = useLoaderData<typeof loader>();

  return (
    <ThemeProvider specifiedTheme={data.theme} themeAction="/action/set-theme">
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </ThemeProvider>
  );
}

function App() {


  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body suppressHydrationWarning>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export function ErrorBoundary() {
  return <DefaultErrorBoundary />
}

export function HydrateFallback() {
  return <h1>Loading...</h1>
}
