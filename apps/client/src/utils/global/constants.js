const globalConstants = {
  maxTtoasts: 3,
  dayInMs: 86400000,
  //   monthInMs: 2629743830,
  yearInMs: 31556926000,
  mobileViewWidth: 767,
  tabletViewWidth: 1279,
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
  allowedAvatarFormats: [".heic", ".HEIC", "image/jpeg", "image/png"],
  defaultBlurHash: "U27nLE$*00_N^k,@s9xu#7$2$%xtVD-B-pkW",
  weekDays: {
    0: "Su",
    1: "Mo",
    2: "Tu",
    3: "We",
    4: "Th",
    5: "Fr",
    6: "Sa",
  },
  defaultEditorCode: `// vvv Don\`t remove or change the line below! vvv
const handler = async (message, user, accept, resolve, reject) => {
    const body = message.body;

    // Reject the message if it contains any prohibited words
    const prohibitedWords = ["asshole", "fuck", "bullshit"];
    if (prohibitedWords.some(word => body.includes(word))) {
        return reject("Message blocked by moderation.");
    }

    return accept();
};

// vvv Don\`t remove or change the line below! vvv
export default await handler(env.MESSAGE, env.USER, env.ACCEPT, env.RESOLVE, env.REJECT);
`,
};

export default globalConstants;
