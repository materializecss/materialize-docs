import { globSync } from "glob";
import path, { resolve } from "path";
import handlebars from "vite-plugin-handlebars";
import { fileURLToPath } from "node:url";

export default {
  base: "./",
  plugins: [
    handlebars({
      partialDirectory: resolve(__dirname, "partials"),
    }),
  ],
  build: {
    rollupOptions: {
      //this is needed for "vite publish" to include all html files, not only the index.
      input: Object.fromEntries(
        globSync("*.html").map((file) => [
          // // This remove the file extension from each
          // // file, so e.g. nested/foo.js becomes nested/foo
          file.slice(4, file.length - path.extname(file).length),
                    
          // // This expands the relative paths to absolute paths, so e.g.
          // // src/nested/foo becomes /project/src/nested/foo.js
          fileURLToPath(new URL(file, import.meta.url)),
        ])
      ),
    },
  },
};
