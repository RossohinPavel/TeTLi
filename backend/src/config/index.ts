export const getConfig = () => {
  if (!process.env.BOT_TOKEN) {
    throw new Error("Enviroment not setuped or .env file not found.");
  }
  return { botToken: process.env.BOT_TOKEN as string } as const;
};

export const config = getConfig();