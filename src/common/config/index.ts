

export class AppConfig {

    public jwtSecret() {

        return this.getConfig('JWT_SECRET');
    }

    public registerCode() {

        return this.getConfig('REGISTER_CODE');
    }

    public enableFastifyLogger() {

        return (this.getConfig('ENABLE_FASTIFY_LOG', false) ?? 'false').toLowerCase() === 'true';
    }

    public isDev() {

        return this.getConfig('NODE_ENV') === 'Development';
    }

    public isProd() {

        return this.getConfig('NODE_ENV') !== 'Development';
    }


    private getConfig(name: string, required: boolean = true) {

        const value = process.env[name];

        if (value === undefined && required)
            throw new Error('Config is not defined: ' + name);

        return value;
    }
}