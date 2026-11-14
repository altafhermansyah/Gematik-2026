import { existsSync } from "node:fs";
import { registerHooks } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SRC_ROOT = path.resolve(process.cwd(), "src");

function resolveTsFile(basePath) {
  if (existsSync(`${basePath}.ts`)) return `${basePath}.ts`;
  if (existsSync(`${basePath}.tsx`)) return `${basePath}.tsx`;
  if (existsSync(path.join(basePath, "index.ts"))) {
    return path.join(basePath, "index.ts");
  }
  return null;
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
      const candidate = resolveTsFile(path.join(SRC_ROOT, specifier.slice(2)));
      if (candidate) {
        return {
          shortCircuit: true,
          url: pathToFileURL(candidate).href,
        };
      }
    }

    if (
      (specifier.startsWith("./") || specifier.startsWith("../")) &&
      !path.extname(specifier) &&
      context.parentURL?.startsWith("file:")
    ) {
      const parentDir = path.dirname(fileURLToPath(context.parentURL));
      const candidate = resolveTsFile(path.resolve(parentDir, specifier));
      if (candidate) {
        return {
          shortCircuit: true,
          url: pathToFileURL(candidate).href,
        };
      }
    }

    return nextResolve(specifier, context);
  },
});
