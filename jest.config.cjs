module.exports = {
  clearMocks: true,
  collectCoverageFrom: [
    'src/app/stores/**/*.{ts,tsx}',
    'src/hooks/**/*.{ts,tsx}',
    'src/lib/**/*.{ts,tsx}',
    'src/components/catalog/filters/filterTypes.ts',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/lib/assets.ts',
    '!src/lib/telegramWebApp.ts',
  ],
  coverageDirectory: 'coverage/jest',
  coveragePathIgnorePatterns: ['/node_modules/', '/src/test/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '\\.(png|jpg|jpeg|gif|webp|svg|ttf|woff|woff2)$':
      '<rootDir>/src/test/fileMock.ts',
  },
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/src/test/setupTests.ts'],
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.(test|spec).(ts|tsx)'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.jest.json',
      },
    ],
  },
};
