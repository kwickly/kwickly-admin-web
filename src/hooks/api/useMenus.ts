import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

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
export function useMenuItems(branchId: string) {
  return useQuery({
    queryKey: ['menus', branchId],
    queryFn: async (): Promise<MenuItem[]> => {
      const { data } = await api.get(`/menus/${branchId}`);
      
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
      return flatItems; 
    },
    enabled: !!branchId,
  });
}

// GET /v1/menus/:branchId (Raw Categories)
export function useMenuCategories(branchId: string) {
  return useQuery({
    queryKey: ['menus', 'categories', branchId],
    queryFn: async (): Promise<MenuCategory[]> => {
      const { data } = await api.get(`/menus/${branchId}`);
      return data.data; 
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
export function useAddons() {
  return useQuery({
    queryKey: ['menus', 'addons'],
    queryFn: async (): Promise<MenuAddon[]> => {
      const { data } = await api.get('/menus/addons');
      return data.data;
    },
  });
}
