import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { PaginatedResponse } from './usePlatform';

export interface MenuItem {
  id: string;
  name: string;
  price: string;
  description: string | null;
  status: 'AVAILABLE' | 'OUT_OF_STOCK' | 'HIDDEN' | null;
  categoryId: string;
  categoryName?: string;
  
  // Dietary
  isVeg: boolean | null;
  isJain: boolean | null;
  isGlutenFree: boolean | null;
  spiceLevel: number | null;

  // Badges
  isBestseller: boolean | null;
  isChefSpecial: boolean | null;
  isRestaurantSpecial: boolean | null;
  isNew: boolean | null;
  isPopular: boolean | null;
  isLimitedEdition: boolean | null;
  isHealthyChoice: boolean | null;

  // Nutrition
  calories: number | null;
  servingSize: string | null;
  ingredients: string[] | null;
  allergens: string[] | null;
  protein: string | null;
  carbs: string | null;
  fat: string | null;
}

export interface MenuCategory {
  id: string;
  name: string;
  description: string | null;
  sortOrder: number;
  status: 'AVAILABLE' | 'OUT_OF_STOCK' | 'HIDDEN' | null;
  items?: MenuItem[];
}

export interface MenuItemVariant {
  id: string;
  menuItemId: string;
  name: string;
  priceDelta: string;
  isDefault: boolean;
}

export interface MenuAddon {
  id: string;
  name: string;
  price: string;
  status: 'AVAILABLE' | 'OUT_OF_STOCK' | 'HIDDEN';
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



// POST /v1/menus/items/:id/variants
export function useCreateVariant() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ itemId, branchId, payload }: { itemId: string; branchId?: string; payload: { name: string; priceDelta: string; isDefault?: boolean } }) => {
      const { data } = await api.post(`/menus/items/${itemId}/variants`, payload, {
        headers: { 'x-branch-id': branchId || 'default' }
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menus'] });
    },
  });
}

// PATCH /v1/menus/variants/:id
export function useUpdateVariant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, branchId, payload }: { id: string; branchId?: string; payload: Partial<MenuItemVariant> }) => {
      const { data } = await api.patch(`/menus/variants/${id}`, payload, {
        headers: { 'x-branch-id': branchId || 'default' }
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menus'] });
    },
  });
}

// DELETE /v1/menus/variants/:id
export function useDeleteVariant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, branchId }: { id: string; branchId?: string }) => {
      const { data } = await api.delete(`/menus/variants/${id}`, {
        headers: { 'x-branch-id': branchId || 'default' }
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menus'] });
    },
  });
}

// POST /v1/menus/sync/:branchId
export function useSyncMenu() {
  return useMutation({
    mutationFn: async (branchId: string) => {
      const { data } = await api.post(`/menus/sync/${branchId}`);
      return data;
    },
  });
}
