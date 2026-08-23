module.exports = function (api) {
  const isProduction = api.env("production");

  return {
    presets: [
      [
        "@babel/preset-env",
        {
          targets: "defaults",
        },
      ],
      [
        "@babel/preset-react",
        {
          runtime: "automatic",
          development: !isProduction,
        },
      ],
      "@babel/preset-typescript",
    ],
  };
};