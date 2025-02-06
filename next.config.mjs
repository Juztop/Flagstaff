export default {
    async redirects() {
      return [
        {
          source: "/",
          destination: "/trip",
          permanent: true, // This makes it a 301 redirect
        },
      ];
    },
  };
  