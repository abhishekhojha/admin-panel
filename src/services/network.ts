import axoios from "@/lib/axios"
import { ENDPOINTS } from "./endpoints";

//roles service
export const fetchRolesApi = async () => {
  const response = await axoios.get(ENDPOINTS.ROLES);
  return response.data;
}

export const fetchPermissionsApi = async () => {
  const response = await axoios.get(`${ENDPOINTS.ROLES}/permissions`);
  return response.data;
}

export const fetchRoleByIdApi = async (id: string) => {
  const response = await axoios.get(`${ENDPOINTS.ROLES}/${id}`);
  return response.data;
}

export const createRoleApi = async (roleData: { name: string; description: string; permissions: string[] }) => {
  const response = await axoios.post(ENDPOINTS.ROLES, roleData);
  return response.data;
}

export const updateRoleApi = async (id: string, roleData: { name?: string; description?: string; permissions?: string[] }) => {
  const response = await axoios.put(`${ENDPOINTS.ROLES}/${id}`, roleData);
  return response.data;
}

export const deleteRoleApi = async (id: string) => {
  const response = await axoios.delete(`${ENDPOINTS.ROLES}/${id}`);
  return response.data;
}

// category service
export const fetchCategoriesApi = async () => {
  const response = await axoios.get(ENDPOINTS.CATEGORIES);
  return response.data;
}

export const createCategoryApi = async (categoryData: any) => {
  const response = await axoios.post(ENDPOINTS.CATEGORIES, categoryData);
  return response.data;
}

export const updateCategoryApi = async (id: string, categoryData: any) => {
  const response = await axoios.put(`${ENDPOINTS.CATEGORIES}/${id}`, categoryData);
  return response.data;
}

export const deleteCategoryApi = async (id: string) => {
  const response = await axoios.delete(`${ENDPOINTS.CATEGORIES}/${id}`);
  return response.data;
}

// user service
export const fetchUsersApi = async (query:string) => {
  const response = await axoios.get(`${ENDPOINTS.USERS}${query}`);
  return response.data;
}

export const createUserApi = async (userData: any) => {
  const response = await axoios.post(ENDPOINTS.USERS, userData);
  return response.data;
}

export const updateUserApi = async (id: string, userData: any) => {
  const response = await axoios.put(`${ENDPOINTS.USERS}/${id}`, userData);
  return response.data;
}

export const deleteUserApi = async (id: string) => {
  const response = await axoios.delete(`${ENDPOINTS.USERS}/${id}`);
  return response.data;
}

export const assignRoleApi = async (id: string, roleId: string) => {
  const response = await axoios.post(`${ENDPOINTS.USERS}/${id}/assign-role`, { roleId });
  return response.data;
}

// upload service   
export const uploadImageApi = async (formData: FormData) => {
  const response = await axoios.post(ENDPOINTS.UPLOAD, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

// product service
export const fetchProductsApi = async (query: string) => {
  const response = await axoios.get(`${ENDPOINTS.PRODUCTS}${query}`);
  return response.data;
}

// Variant service
export const fetchVariantsApi = async (productId: string) => {
  const response = await axoios.get(`${ENDPOINTS.PRODUCTS}/${productId}/variants`);
  return response.data;
}

export const fetchVariantByIdApi = async (variantId: string) => {
  const response = await axoios.get(`${ENDPOINTS.PRODUCTS}/variant/${variantId}`);
  return response.data;
}

export const createVariantApi = async (productId: string, variantData: any) => {
  const response = await axoios.post(`${ENDPOINTS.PRODUCTS}/${productId}/variant`, variantData);
  return response.data;
}

export const updateVariantApi = async (variantId: string, variantData: any) => {
  const response = await axoios.put(`${ENDPOINTS.PRODUCTS}/variant/${variantId}`, variantData);
  return response.data;
}

export const deleteVariantApi = async (variantId: string, productId?: string) => {
  const url = productId
    ? `${ENDPOINTS.PRODUCTS}/variant/${variantId}/${productId}`
    : `${ENDPOINTS.PRODUCTS}/variant/${variantId}`;
  const response = await axoios.delete(url);
  return response.data;
}

export const deleteProductApi = async (id: string) => {
  const response = await axoios.delete(`${ENDPOINTS.PRODUCTS}/${id}`);
  return response.data;
}

export const createProductApi = async (productData: any) => {
  const response = await axoios.post(ENDPOINTS.PRODUCTS, productData);
  return response.data;
}

export const updateProductApi = async (id: string, productData: any) => {
  const response = await axoios.put(`${ENDPOINTS.PRODUCTS}/${id}`, productData);
  return response.data;
}

export const fetchProductByIdApi = async (id: string) => {
  const response = await axoios.get(`${ENDPOINTS.PRODUCTS}/${id}`);
  return response.data;
}