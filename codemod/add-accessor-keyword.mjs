// File name: add-accessor-keyword.mjs
// Run with `jscodeshift -t=add-accessor-keyword.mjs button/internal/button.ts`

/**
 * Note this transform is not idempotent and will explode if you
 * run it a second time. Sorry :(
 */
export default function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  root.find(j.ClassProperty).forEach((path) => {
    if (path.node.decorators && path.node.decorators.length > 0) {
      path.node.key.name = "accessor " + path.node.key.name;

      if (path.node.readonly) {
        path.node.readonly = false;
      }
    }
  });

  return root.toSource();
}

export const parser = "ts";
