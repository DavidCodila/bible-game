import { ALL_KEYS } from "../kernel/Config";

export const validateSystems = (systems: Record<string, any>): void => {
    const systemKeys = Object.keys(systems);

    for (const key of ALL_KEYS) {
        if (!systems[key]) {
            throw new Error(`[SystemsValidator] Missing: "${key}" is required by AppConfig.`);
        }
    }

    if (systemKeys.length > ALL_KEYS.length) {
        const extraKeys = systemKeys.filter(key => !ALL_KEYS.includes(key as any));
        throw new Error(`[SystemsValidator] Unknown: "${extraKeys.join(', ')}" is not defined in AppConfig.`);
    }
};