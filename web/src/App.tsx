import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { LocaleProvider } from '@/i18n';
import { PhoneFrame } from '@/components/PhoneFrame';
import { Onboarding, Splash } from '@/screens/Start';
import { Login } from '@/screens/Login';
import { Home } from '@/screens/Home';
import { History } from '@/screens/transfers';
import { TransferDetails } from '@/screens/TransferDetails';
import { Account } from '@/screens/Account';
import { Soon } from '@/screens/Soon';
import {
  ContactSupport, DeviceCode, DeviceLocked, DeviceMethod, DeviceVerified, IdExpired, Maintenance, NewDevice, Offline, TryAnotherWay,
  UpdateRequired, VerifyDetails, VerifyLogin, WelcomeBack,
} from '@/screens/LoginFlows';
import { AboutYou, AccountCreated, AccountDetails, BiometricSetup, VerifyNumber } from '@/screens/Registration';
import { ChangePassword, Help, Language, Legal, LegalDoc, Notifications, PersonalDetails, SavedCards, Security } from '@/screens/AccountPages';
import { Address, BeforeYouStart, CameraAccess, ChooseId, Hub, ManualDetails, ReviewDetails, Scan, ScanFailed } from '@/screens/Verify';

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
            <Route path="/login/verify/:method" element={<VerifyLogin />} />
            <Route path="/login/method" element={<TryAnotherWay />} />
            <Route path="/offline" element={<Offline />} />
            <Route path="/id-expired" element={<IdExpired />} />
            <Route path="/welcome-back" element={<WelcomeBack />} />
            <Route path="/device" element={<NewDevice />} />
            <Route path="/device/details" element={<VerifyDetails />} />
            <Route path="/device/locked" element={<DeviceLocked />} />
            <Route path="/device/method" element={<DeviceMethod />} />
            <Route path="/device/code/:method" element={<DeviceCode />} />
            <Route path="/device/verified" element={<DeviceVerified />} />
            <Route path="/support" element={<ContactSupport />} />
            <Route path="/update" element={<UpdateRequired />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/home" element={<Home />} />
            <Route path="/history" element={<History />} />
            <Route path="/history/:id" element={<TransferDetails />} />
            <Route path="/account" element={<Account />} />
            <Route path="/register" element={<VerifyNumber />} />
            <Route path="/register/about" element={<AboutYou />} />
            <Route path="/register/account" element={<AccountDetails />} />
            <Route path="/register/verify" element={<Navigate to="/register" replace />} />
            <Route path="/register/created" element={<AccountCreated />} />
            <Route path="/register/biometric" element={<BiometricSetup />} />
            <Route path="/verify/start" element={<BeforeYouStart />} />
            <Route path="/verify/hub" element={<Hub />} />
            <Route path="/verify/choose-id" element={<ChooseId />} />
            <Route path="/verify/camera" element={<CameraAccess />} />
            <Route path="/verify/scan" element={<Scan />} />
            <Route path="/verify/scan-failed" element={<ScanFailed />} />
            <Route path="/verify/review" element={<ReviewDetails />} />
            <Route path="/verify/manual" element={<ManualDetails />} />
            <Route path="/verify/address" element={<Address />} />
            <Route path="/account/personal" element={<PersonalDetails />} />
            <Route path="/account/password" element={<ChangePassword />} />
            <Route path="/account/cards" element={<SavedCards />} />
            <Route path="/account/security" element={<Security />} />
            <Route path="/account/language" element={<Language />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="/legal/:doc" element={<LegalDoc />} />
            <Route path="/help" element={<Help />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/soon/:id" element={<Soon />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PhoneFrame>
      </HashRouter>
    </LocaleProvider>
  );
}
