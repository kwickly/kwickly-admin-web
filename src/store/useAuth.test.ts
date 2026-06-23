import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../store/useAuth';

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset the store to a clean state before each test
    useAuthStore.setState({ user: null, token: null });
  });

  it('starts with no user and no token', () => {
    const { user, token } = useAuthStore.getState();
    expect(user).toBeNull();
    expect(token).toBeNull();
  });

  it('logs in and stores user + token', () => {
    const mockUser = { id: '1', name: 'Alice', email: 'alice@test.com', role: 'ADMIN', tenantId: 'tenant-1' };
    const mockToken = 'eyJhbGciOiJIUzI1NiJ9.mock';

    useAuthStore.getState().login(mockUser, mockToken, 'mock-refresh-token');

    const { user, token } = useAuthStore.getState();
    expect(user).toEqual(mockUser);
    expect(token).toBe(mockToken);
  });

  it('logs out and clears user + token', () => {
    // First log in
    useAuthStore.getState().login(
      { id: '1', name: 'Alice', email: 'alice@test.com', role: 'ADMIN', tenantId: 'tenant-1' },
      'some-token',
      'some-refresh-token'
    );
    expect(useAuthStore.getState().token).not.toBeNull();

    // Then log out
    useAuthStore.getState().logout();

    const { user, token } = useAuthStore.getState();
    expect(user).toBeNull();
    expect(token).toBeNull();
  });
});
