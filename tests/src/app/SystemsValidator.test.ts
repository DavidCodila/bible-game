import { validateSystems } from '@src/app/SystemsValidator';
import { ALL_KEYS } from '@src/app/AppConfig';

describe('SystemsValidator', () => {
    const createValidSystems = () => {
        const systems: Record<string, any> = {};
        ALL_KEYS.forEach(key => { systems[key] = {}; });
        return systems;
    };

    test('should pass if all required keys are present', () => {
        const systems = createValidSystems();
        expect(() => validateSystems(systems)).not.toThrow();
    });

    test('should throw for every individual missing system', () => {
        ALL_KEYS.forEach((missingKey) => {
            const systems = createValidSystems();
            delete systems[missingKey];

            expect(
                () => validateSystems(systems),
                `Validator failed to detect missing system: ${missingKey}`
            ).toThrow(new RegExp(`Missing: "${missingKey}"`));
        });
    });

    test('should throw if an unauthorized system is included', () => {
        const systems = createValidSystems();
        systems['unauthorizedSystem'] = {};

        expect(() => validateSystems(systems))
            .toThrow(/Unknown: "unauthorizedSystem"/);
    });
});