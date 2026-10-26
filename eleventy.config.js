import { IdAttributePlugin, InputPathToUrlTransformPlugin } from "@11ty/eleventy";
import eleventyImage from "@11ty/eleventy-img";
import { minify } from "html-minifier-terser";
import { transform } from "lightningcss";
import path from "path";

export default function (eleventyConfig) {
  // Passthrough
  eleventyConfig.addPassthroughCopy("src/assets/fonts");
  eleventyConfig.addPassthroughCopy("src/assets/img");
  eleventyConfig.addPassthroughCopy("src/assets/js");

  // Collections
  eleventyConfig.addCollection("activityEN", (api) =>
    api.getFilteredByTag("activityEN").sort((a, b) => b.date - a.date)
  );

  // Plugins
  eleventyConfig.addPlugin(IdAttributePlugin);
  eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);

  // Date filters
  eleventyConfig.addFilter("dateISO", (date) => {
    return new Date(date).toISOString().split("T")[0];
  });
  eleventyConfig.addFilter("dateFR", (date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });
  eleventyConfig.addFilter("dateYear", (date) => (date === "now" ? new Date() : new Date(date)).getFullYear());

  // Image shortcode
  eleventyConfig.addAsyncShortcode(
    "image",
    async function (src, alt, sizes = "100vw", widths = [400, 800, 1200, 1600], loading = "lazy", fetchpriority = "auto") {
      if (!alt && alt !== "") throw new Error(`Missing alt text for image: ${src}`);
      const metadata = await eleventyImage(src, {
        widths,
        formats: ["avif", "webp", "jpeg"],
        outputDir: "./_site/assets/img/",
        urlPath: "/assets/img/",
        filenameFormat: (_id, src, width, format) => {
          const name = path.basename(src, path.extname(src));
          return `${name}-${width}w.${format}`;
        },
      });
      const imageAttributes = {
        alt,
        sizes,
        loading,
        decoding: "async",
        ...(fetchpriority !== "auto" && { fetchpriority }),
      };
      return eleventyImage.generateHTML(metadata, imageAttributes);
    }
  );

  // Sync image shortcode for cards (used inside for loops / includes where async fails)
  eleventyConfig.addShortcode(
    "imageCard",
    function (src, alt, sizes = "(min-width: 60em) 400px, (min-width: 40em) 50vw, 100vw") {
      if (!src) return "";
      try {
        const metadata = eleventyImage.statsSync(src, {
          widths: [400, 800],
          formats: ["avif", "webp", "jpeg"],
          outputDir: "./_site/assets/img/",
          urlPath: "/assets/img/",
          filenameFormat: (_id, src, width, format) => {
            const name = path.basename(src, path.extname(src));
            return `${name}-${width}w.${format}`;
          },
        });
        return eleventyImage.generateHTML(metadata, {
          alt: alt || "",
          sizes,
          loading: "lazy",
          decoding: "async",
        });
      } catch {
        return `<img src="${src}" alt="${alt || ""}" loading="lazy" decoding="async">`;
      }
    }
  );

  // CSS transform (Lightning CSS minify on build)
  eleventyConfig.addTemplateFormats("css");
  eleventyConfig.addExtension("css", {
    outputFileExtension: "css",
    compile: async (content, inputPath) => {
      if (!inputPath.includes("src/assets/css")) return () => content;
      return () => {
        const { code } = transform({
          filename: inputPath,
          code: Buffer.from(content),
          minify: process.env.ELEVENTY_RUN_MODE === "build",
        });
        return code.toString();
      };
    },
  });

  // HTML minify on build
  eleventyConfig.addTransform("htmlmin", async (content, outputPath) => {
    if (process.env.ELEVENTY_RUN_MODE !== "build") return content;
    if (!outputPath?.endsWith(".html")) return content;
    return minify(content, {
      removeComments: true,
      collapseWhitespace: true,
      minifyCSS: false,
      minifyJS: true,
    });
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md", "html", "css", "txt", "xml"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
