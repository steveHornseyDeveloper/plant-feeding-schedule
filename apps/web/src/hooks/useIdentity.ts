import { useEffect, useState } from 'react';
import type { UserSlug } from '@longstone/shared';
import { detectUser } from '../lib/detectUser';

export function useIdentity(): UserSlug {
  const [user, setUser] = useState<UserSlug>(() => detectUser());
  useEffect(() => {
    setUser(detectUser());
  }, []);
  return user;
}
