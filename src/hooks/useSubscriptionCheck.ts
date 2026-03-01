import { useEffect, useState } from 'react';
import { useGetUsersQuery } from '@/redux/feature/userSlice';
import { useRouter } from 'next/navigation';

export const useSubscriptionCheck = (redirectOnFail = false) => {
  const { data, isLoading } = useGetUsersQuery(undefined);
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (!isLoading && data?.data) {
      const isSeller = data.data.role === 'SELLER';
      const hasSubscription = data.data.subscription === true;
      
      const access = !isSeller || (isSeller && hasSubscription);
      setHasAccess(access);

      if (redirectOnFail && isSeller && !hasSubscription) {
        router.push('/dashboard');
      }
    }
  }, [data, isLoading, redirectOnFail, router]);

  return {
    hasAccess,
    isLoading,
    isSeller: data?.data?.role === 'SELLER',
    hasSubscription: data?.data?.subscription,
    userData: data?.data
  };
};
