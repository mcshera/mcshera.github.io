export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });
  eleventyConfig.addPassthroughCopy({ "src/_headers": "_headers" });
  eleventyConfig.addPassthroughCopy({ "src/og.jpg": "og.jpg" });
  eleventyConfig.addWatchTarget("src/assets/");

  eleventyConfig.addFilter("year", () => new Date().getFullYear());
  eleventyConfig.addFilter("pad", (n) => String(n).padStart(2, "0"));
  eleventyConfig.addFilter("isoDate", (d) => new Date(d || Date.now()).toISOString().slice(0, 10));
  eleventyConfig.addFilter("abs", (path, base) => new URL(path, base).href);

  // Case studies collection, ordered by front-matter `order`
  eleventyConfig.addCollection("work", (api) =>
    api.getFilteredByGlob("src/work/*.njk").sort((a, b) => a.data.order - b.data.order)
  );

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
