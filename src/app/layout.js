import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../theme';
import './globals.css';
import { AuthProvider } from '@/src/fe/store/AuthContext';

export const metadata = {
  title: 'MForm — Smart Form Builder with WhatsApp & Email Invites',
  description: 'MForm helps businesses create smart forms, send personalised invite links via WhatsApp & email, and collect responses — all integrated with your CRM. Start free today.',
  keywords: 'form builder, feedback forms, WhatsApp forms, CRM integration, SaaS, invite links',
  openGraph: {
    title: 'MForm — Smart Form Builder',
    description: 'Create forms, send personalised invite links via WhatsApp & email, collect responses — integrated with your CRM.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
              {children}
            </AuthProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
