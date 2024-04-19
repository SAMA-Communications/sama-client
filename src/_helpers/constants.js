const globalConstants = {
  dayInMs: 86400000,
  //   monthInMs: 2629743830,
  yearInMs: 31556926000,
  mobileViewWidth: 800,
  tabletViewWidth: 1400,
  linksRegExp: /https:\/\/\S+/g, ///(((https?:\/\/)|(www\.))[^\s]+)/g
  allowedFileFormats: [
    ".heic",
    ".HEIC",
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/bmp",
    "video/mp4",
    "video/webm",
    "video/quicktime",
  ],
  defaultBlurHash:
    "|KO2?U%2Tw=wR6cErDEhOD]~RBVZRip0W9ofwxM_};RPxuwH%3s89]t8$%tLOtxZ%gixtQt8IUS#I.ENa0NZIVt6xFM{M{%1j^M_bcRPX9nht7n+j[rrW;ni%Mt7V@W;t7t8%1bbxat7WBIUR*RjRjRjxuRjs.MxbbV@WY",
  weekDays: {
    0: "Su",
    1: "Mo",
    2: "Tu",
    3: "We",
    4: "Th",
    5: "Fr",
    6: "Sa",
  },
};

export default globalConstants;
