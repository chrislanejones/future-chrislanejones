// eslint-config-next 16 ships flat config arrays, so there is no FlatCompat
// shim here — import the configs and spread them.
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    // eslint-plugin-react's auto-detection crashes on ESLint 10 (it calls
    // context.getFilename(), removed in v10). Pinning the version skips it.
    settings: { react: { version: "19.2" } },
  },
  {
    // `_name` marks a value kept on purpose (a dropped tuple slot, a prop
    // pulled out of a spread); rest siblings strip props before forwarding.
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        destructuredArrayIgnorePattern: "^_",
        ignoreRestSiblings: true,
      }],
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "convex/_generated/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
