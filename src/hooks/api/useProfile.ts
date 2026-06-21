import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/useAuth';

export function useProfile() {
  const updateProfile = useMutation({
    mutationFn: async (data: { name?: string; phone?: string }) => {
      const response = await api.patch('/auth/profile', data);
      return response.user;
    },
    onSuccess: (updatedUser) => {
      // Update the user details in the auth store
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        useAuthStore.setState({
          user: {
            ...currentUser,
            name: updatedUser.name || currentUser.name,
            phone: updatedUser.phone || currentUser.phone,
          }
        });
      }
    }
  });

  return { updateProfile };
}
