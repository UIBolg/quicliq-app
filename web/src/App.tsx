import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { LocaleProvider } from '@/i18n';
import { PhoneFrame } from '@/components/PhoneFrame';
import { Onboarding, Splash } from '@/screens/Start';
import { Login } from '@/screens/Login';
import { Home } from '@/screens/Home';
import { History } from '@/screens/transfers';
import { Account } from '@/screens/Account';
import { Soon } from '@/screens/Soon';

// HashRouter: GitHub Pages has no SPA fallback under /web/, so deep links use #/path.
export default function App() {
  return (
    <LocaleProvider>
      <HashRouter>
        <PhoneFrame>
          <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/history" element={<History />} />
            <Route path="/account" element={<Account />} />
            <Route path="/soon/:id" element={<Soon />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PhoneFrame>
      </HashRouter>
    </LocaleProvider>
  );
}
