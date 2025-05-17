# Money Calculators - Frontend

This project is a financial calculator application built with React, TypeScript, and Vite.

## Development
```bash
npm run dev
```
Starts the development server with hot reloading at http://localhost:5173



## Linting
```bash
npm run lint
```
Runs ESLint to check for code quality issues and style consistency.

```bash
npm run lint:fix
```
Attempts to automatically fix linting issues where possible.

## Checking for Unused Files
```bash
npx unimported
```
Scans your project for unused files and dependencies (requires installation first).

## Building
```bash
npm run build
```
Builds the app for production to the dist folder, optimized for best performance.

## Preview Production Build
```bash
npm run preview
```
Locally previews the production build (must run build first).

## Deployment
```bash
npm run predeploy
```
Prepares the build for deployment (runs build and any pre-deployment checks).

```bash
npm run deploy
```
Deploys the application to GitHub Pages (or your configured hosting).

## Additional Useful Commands
Type Checking
```bash
npm run type-check
```
Runs TypeScript compiler to check for type errors.

## Testing
```bash
npm run test
```
Runs unit tests with Vitest.


## Checking Dependency Health

```bash
npm update
```
Updates all dependencies

```bash
npm outdated
```
Checks for outdated dependencies.

```bash
npm audit
```
Checks for vulnerable dependencies.


```bash
npx depcheck
```
Alternative to unimported for finding unused dependencies.

```bash
npx ts-prune
```
Finds unused TypeScript exports (install with npm install ts-prune --save-dev).
