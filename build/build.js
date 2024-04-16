import { build } from 'esbuild';

(async () => {
  await build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    outdir: 'lib',
    minify: true,
    sourcemap: true,
    target: 'es2020',
    platform: 'browser',
    format: 'esm',
    external: ['vue', '@azure/msal-browser'],
  });
})();
