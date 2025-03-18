const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "pt-app.oss-us-west-1.aliyuncs.com",
        },
        {
          protocol: "https",
          hostname: "binance.com",
        },
        {
          protocol: "https",
          hostname: "tradingbase.oss-us-west-1.aliyuncs.com",
        },
      ],
    },
  };
  
  export default nextConfig;
  