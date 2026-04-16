import { useAuthStore } from '@/store/authStore';
import MerchantLogin from '@/components/MerchantLogin';
import StaffLogin from '@/components/StaffLogin';
import POSDashboard from '@/components/POSDashboard';

const Index = () => {
  const { step } = useAuthStore();

  switch (step) {
    case 'merchant':
      return <MerchantLogin />;
    case 'clockin':
    case 'stafflogin':
      return <StaffLogin />;
    case 'dashboard':
      return <POSDashboard />;
    default:
      return <MerchantLogin />;
  }
};

export default Index;
