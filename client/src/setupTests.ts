import '@testing-library/jest-dom';
import 'cross-fetch/polyfill';

// Global fetch mock
global.fetch = jest.fn();
