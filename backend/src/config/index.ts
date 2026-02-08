export const getConfig = () => {
  const getEnvValue = (key: string) => {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Environment variable ${key} is not set. Perhaps the env file is not located in the project.`);
    }
    return value;
  };

  return { 
    botToken: getEnvValue('BOT_TOKEN'),
    db: {
      host: getEnvValue('POSTGRES_HOST'),
      port: getEnvValue('POSTGRES_PORT'),
      user: getEnvValue('POSTGRES_USER'),
      password: getEnvValue('POSTGRES_PASSWORD'),
      name: getEnvValue('POSTGRES_DB'),
      get url() {
        return `postgres://${this.user}:${this.password}@${this.host}:${this.port}/${this.name}`;
      }
    }
  } as const;
};

export const config = getConfig();
