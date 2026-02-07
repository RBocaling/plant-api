import prisma from '../config/prisma';

export const getAllCategories = async () => {
  try {
    return await prisma.plantCategory.findMany();
  } catch (error) {
    throw new Error('Failed to fetch categories');
  }
};

export const getCategoryById = async (id: number) => {
  try {
    return await prisma.plantCategory.findUnique({ where: { id } });
  } catch (error) {
    throw new Error('Failed to fetch category');
  }
};

export const createCategory = async (name: string, imageFileName: string) => {
  try {
    return await prisma.plantCategory.create({
      data: { name, imageUrl: imageFileName },
    });
  } catch (error) {
    throw new Error('Failed to create category');
  }
};

export const updateCategory = async (
  id: number,
  data: { name?: string; imageUrl?: string }
) => {
  try {
    return await prisma.plantCategory.update({
      where: { id },
      data,
    });
  } catch (error) {
    throw new Error('Failed to update category');
  }
};

export const deleteCategory = async (id: number) => {
  try {
    return await prisma.plantCategory.delete({ where: { id } });
  } catch (error) {
    throw new Error('Failed to delete category');
  }
};
