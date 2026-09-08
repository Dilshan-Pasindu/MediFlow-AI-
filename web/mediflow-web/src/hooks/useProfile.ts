import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGetProfile, apiUpdateProfile } from '../services/api';
import type { ProfileForm } from '../types/profile';

export function useProfile() {
  return useQuery<ProfileForm>({
    queryKey: ['profile'],
    queryFn: apiGetProfile,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProfileForm) => apiUpdateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}
