import { describe, it, expect, beforeEach } from 'vitest';
import { useBranchStore } from '../store/useBranch';

describe('useBranchStore', () => {
  beforeEach(() => {
    useBranchStore.setState({ selectedBranchId: null });
  });

  it('starts with no selected branch', () => {
    expect(useBranchStore.getState().selectedBranchId).toBeNull();
  });

  it('sets a selected branch id', () => {
    useBranchStore.getState().setSelectedBranchId('branch-42');
    expect(useBranchStore.getState().selectedBranchId).toBe('branch-42');
  });

  it('can clear the selected branch by setting null', () => {
    useBranchStore.getState().setSelectedBranchId('branch-42');
    useBranchStore.getState().setSelectedBranchId(null);
    expect(useBranchStore.getState().selectedBranchId).toBeNull();
  });

  it('switches between branches correctly', () => {
    useBranchStore.getState().setSelectedBranchId('branch-1');
    expect(useBranchStore.getState().selectedBranchId).toBe('branch-1');

    useBranchStore.getState().setSelectedBranchId('branch-2');
    expect(useBranchStore.getState().selectedBranchId).toBe('branch-2');
  });
});
