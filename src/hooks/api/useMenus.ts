import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { PaginatedResponse } from './usePlatform';

export interface MenuItem {
  id: string;
  name: string;
  price: string;
  description: string | null;
  isVeg: boolean | null;
  isActive: boolean | null;
  categoryId: string;
  categoryName?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean | null;
  items?: MenuItem[];
}

export interface MenuAddon {
  id: string;
  name: string;
  price: string;
  isActive: boolean;
  menuItemId?: string;
}

// GET /v1/menus/:branchId (Flattened Items)
export function useMenuItems(branchId: string, page: number = 1, limit: number = 20, search: string = '') {
  return useQuery({
    queryKey: ['menus', branchId, page, limit, search],
    queryFn: async (): Promise<{ items: MenuItem[], meta: any }> => {
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
      const { data } = await api.get(`/menus/${branchId}?page=${page}&limit=${limit}${searchParam}`);
      
      // The API returns an array of Categories, each with an 'items' array.
      // We'll flatten it for the MenuGrid.
      const flatItems: MenuItem[] = [];
      if (Array.isArray(data.data)) {
        data.data.forEach((category: any) => {
          if (Array.isArray(category.items)) {
            category.items.forEach((item: any) => {
              flatItems.push({
                ...item,
                categoryName: category.name // Inject category name for display
              });
            });
          }
        });
      }
      return { items: flatItems, meta: data.meta }; 
    },
    enabled: !!branchId,
  });
}

// GET /v1/menus/:branchId (Raw Categories)
export function useMenuCategories(branchId: string, page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ['menus', 'categories', branchId, page, limit],
    queryFn: async (): Promise<PaginatedResponse<MenuCategory>> => {
      const { data } = await api.get(`/menus/${branchId}?page=${page}&limit=${limit}`);
      return data; 
    },
    enabled: !!branchId,
  });
}

// POST /v1/menus/items
export function useCreateMenuItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payload: {
      categoryId: string;
      name: string;
      price: string;
      isVeg?: boolean;
      description?: string;
    }) => {
      const { data } = await api.post('/menus/items', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menus'] });
    },
  });
}

// POST /v1/menus/categories
export function useCreateCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payload: {
      name: string;
      sortOrder?: number;
    }) => {
      const { data } = await api.post('/menus/categories', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menus'] });
    },
  });
}

// POST /v1/menus/addons
export function useCreateAddon() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payload: {
      name: string;
      price: string;
      menuItemId?: string;
    }) => {
      const { data } = await api.post('/menus/addons', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menus'] });
    },
  });
}

// GET /v1/menus/addons
export function useAddons(page: number = 1, limit: number = 20, search: string = '') {
  return useQuery({
    queryKey: ['menus', 'addons', page, limit, search],
    queryFn: async (): Promise<PaginatedResponse<MenuAddon>> => {
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
      const { data } = await api.get(`/menus/addons?page=${page}&limit=${limit}${searchParam}`);
      return data;
    },
  });
}

// PATCH /v1/menus/items/:id
export function useUpdateMenuItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload, branchId }: { id: string; payload: Partial<MenuItem>; branchId?: string }) => {
      const { data } = await api.patch(`/menus/items/${id}`, payload, {
        headers: {
          'x-branch-id': branchId || 'default'
        }
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menus'] });
    },
  });
}

// DELETE /v1/menus/items/:id
export function useDeleteMenuItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, branchId }: { id: string; branchId?: string }) => {
      const { data } = await api.delete(`/menus/items/${id}`, {
        headers: {
          'x-branch-id': branchId || 'default'
        }
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menus'] });
    },
  });
}

// PATCH /v1/menus/categories/:id
export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<MenuCategory> }) => {
      const { data } = await api.patch(`/menus/categories/${id}`, payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menus'] });
    },
  });
}

// DELETE /v1/menus/categories/:id
export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/menus/categories/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menus'] });
    },
  });
}

