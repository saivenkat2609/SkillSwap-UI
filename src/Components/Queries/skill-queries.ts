import api from "../../lib/api";

export interface SkillQueryParams {
  searchTerm?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  page?: number;
  pageSize?: number;
}

export const getSkills = (params?: SkillQueryParams) => api.get(`/api/skills`, { params });

export const getSkillById = (id: string) => api.get(`/api/skills/${id}`);

export const getCategories = () => api.get(`/api/categories`);

export const createSkill = (data: FormData) =>
  api.post(`/api/skills`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getReviewsBySkillId = (skillId: number) =>
  api.get<Review[]>(`/api/reviews?skillId=${skillId}`);

export const getTeacherStats = () => api.get(`/api/teachers/stats`);

export interface Review {
  reviewId: number;
  rating: number;
  content: string;
  reviewerId: string;
  createdAt: string;
}
