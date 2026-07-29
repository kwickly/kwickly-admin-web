import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuth';

export function useProfile() {
  const updateProfile = useMutation({
    mutationFn: async (data: { name?: string; phone?: string; jobTitle?: string; timezone?: string; bio?: string; avatarUrl?: string }) => {
      const response = await api.patch('/auth/profile', data);
      return response.data.user;
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
            jobTitle: updatedUser.jobTitle || currentUser.jobTitle,
            timezone: updatedUser.timezone || currentUser.timezone,
            bio: updatedUser.bio || currentUser.bio,
            avatarUrl: updatedUser.avatarUrl || currentUser.avatarUrl,
          }
        });
      }
    }
  });

  return { updateProfile };
}
