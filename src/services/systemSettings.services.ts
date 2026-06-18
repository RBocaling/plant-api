import prisma from "../config/prisma";

const SETTINGS_ID = "global";

export const getSystemSettings = async () => {
  return prisma.systemSettings.upsert({
    where: { id: SETTINGS_ID },
    update: {},
    create: {
      id: SETTINGS_ID,
      reportsEnabled: true,
      feedbackEnabled: true,
    },
  });
};

export const updateSystemSettings = async (data: {
  reportsEnabled?: boolean;
  feedbackEnabled?: boolean;
}) => {
  await getSystemSettings();

  return prisma.systemSettings.update({
    where: { id: SETTINGS_ID },
    data,
  });
};

export const isFeedbackEnabled = async () => {
  const settings = await getSystemSettings();
  return settings.feedbackEnabled;
};

export const isReportsEnabled = async () => {
  const settings = await getSystemSettings();
  return settings.reportsEnabled;
};
