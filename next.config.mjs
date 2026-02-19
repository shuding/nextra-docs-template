import nextra from "nextra";

const withNextra = nextra({
  latex: true,
  search: { codeblocks: false },
  contentDirBasePath: "/docs",
});

export default withNextra({
  reactStrictMode: false,
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "storage.googleapis.com", pathname: "/**" },
    ],
  },
});