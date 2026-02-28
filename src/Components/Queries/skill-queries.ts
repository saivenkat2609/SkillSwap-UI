import api from "../../lib/api";

export const getSkills = () => api.get(`/api/skills`);

export const getSkillById = (id: string) => api.get(`/api/skills/${id}`);

export const getCategories = () => api.get(`/api/categories`);

export const createSkill = (data: FormData) =>
  api.post(`/api/skills`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
