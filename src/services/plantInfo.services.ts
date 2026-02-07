import prisma from '../config/prisma';

export const getAllPlantInfo = async () => {
  try {
    return await prisma.plantInfo.findMany({
       where: {
        archived: false,
      },
       include: {
        category: true,
        galleryImages: true,
      },
    });
  } catch (error) {
    throw new Error('Failed to fetch plant info.');
  }
};

export const getPlantInfoById = async (id: number) => {
  try {
    return await prisma.plantInfo.findUnique({
      where: { id },
      include: {
        category: true,
        galleryImages: true,
      },
    });
  } catch (error) {
    throw new Error('Failed to fetch plant info.');
  }
};

export const createPlantInfo = async (data: {
  name: string;
  scientificName: string;
  genus: string;
  imageUrl: string;
  description: string;
  price: string;
  watering: string;
  fertilizing: string;
  note: string;
  galleryImages: {
    url: string;
  }[];
    harvesting: string;

  categoryId: number;
}) => {
  try {
    console.log('Creating PlantInfo with data:', data);

    const category = await prisma.plantCategory.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      throw new Error(`Category with ID ${data.categoryId} does not exist.`);
    }

  return await prisma.plantInfo.create({
  data: {
    name: data.name,
    scientificName: data.scientificName,
    genus: data.genus,
    imageUrl: data.imageUrl,
    description: data.description,
    price: data.price,
    watering: data.watering,
    fertilizing: data.fertilizing,
    note: data.note,
    harvesting: data.harvesting,
    category: {
      connect: { id: data.categoryId },
    },
    galleryImages: {
      create: data.galleryImages.map((img) => ({
        imageUrl: img.url,
      })),
    },
  },
  include: {
    category: true,
    galleryImages: true,
  },
});
   
  } catch (error) {
    throw new Error('Failed to create plant info.');
  }
};

export const updatePlantInfo = async (
  id: number,
  data: Partial<{
    name: string;
    scientificName: string;
    genus: string;
    imageUrl: string;
    description: string;
    categoryId: number;
  }>
) => {
  try {
    return await prisma.plantInfo.update({
      where: { id },
      data,
    });
  } catch (error) {
    throw new Error('Failed to update plant info.');
  }
};

export const deletePlantInfo = async (id: number) => {
  try {
    return await prisma.plantInfo.update({
      where: { id },
      data: { archived: true },
    });
  } catch (error) {
    throw new Error('Failed to archive plant info.');
  }
};


export const deleteGalleryImage = async (id: number) => {
    try {
      return await prisma.plantGallery.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error('Failed to delete gallery image.');
    }
  };
  