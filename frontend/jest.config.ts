import type { Config } from "jest";
import { TS_EXT_TO_TREAT_AS_ESM, ESM_TS_TRANSFORM_PATTERN } from "ts-jest";

const config: Config = {
    testEnvironment: "jsdom",

    extensionsToTreatAsEsm: [...TS_EXT_TO_TREAT_AS_ESM],

    transform: {
        [ESM_TS_TRANSFORM_PATTERN]: [
            "ts-jest",
            {
                useESM: true,
                tsconfig: "<rootDir>/tsconfig.test.json",
            },
        ],
    },

    setupFilesAfterEnv: ["<rootDir>/src/test/setup.ts"],

    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
        "\\.(svg|png|jpg|jpeg|gif|webp)$": "<rootDir>/src/test/fileMock.ts",
        "\\.(css|scss|sass)$": "<rootDir>/src/test/styleMock.ts",
    },

    testMatch: [
        "<rootDir>/src/**/*.test.ts",
        "<rootDir>/src/**/*.test.tsx",
    ],

    clearMocks: true,
};

export default config;