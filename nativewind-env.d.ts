/// <reference types="nativewind/types" />

// TypeScript 6.x (TS2882) requires an explicit module declaration for
// side-effect imports of non-JS files (e.g. `import './global.css'`).
// nativewind/types does not declare this, so it is added here.
declare module '*.css';
