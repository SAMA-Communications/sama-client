export const KEY_CODES = {
  ESCAPE: 27,
  ENTER: 13,
  ARROW_RIGHT: 39,
  ARROW_LEFT: 37,
};

export const CHAT_CONTENT_TABS = {
  MESSAGES: "messages",
  APPS: "apps",
};

export const TOAST_THEME = {
  default: {
    textColor: "#fff",
    bgColor: "#6c757d",
  },
  success: {
    textColor: "#fff",
    bgColor: "#198754",
  },
  danger: {
    textColor: "#fff",
    bgColor: "#dc3545",
  },
  warning: {
    textColor: "#000",
    bgColor: "#ffc107",
  },
};

export const TYPING_DURATION_MS = 6000;
export const MAX_TTOASTS = 3;
export const SWIPE_THRESHOLD = 90;

export const DAY_IN_MS = 86400000;
// export const MONTH_IN_MS = 2629743830;
export const YEAR_IN_MS = 31556926000;

export const MOBILE_VIEW_WIDTH = 767;
export const TABLET_VIEW_WIDTH = 1279;

export const LINKS_REGEXP = /https:\/\/\S+/g; // /(((https?:\/\/)|(www\.))[^\s]+)/g
export const URL_METADATA_EXPIRE = 3600000;
export const URL_MAX_PARALLEL_REQUESTS = 5;

export const ALLOWED_FILE_FORMATS = [
  ".heic",
  ".HEIC",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/bmp",
  "video/mp4",
  "video/webm",
  "video/quicktime",
];
export const ALLOWED_FORMATS_TO_COPY = [
  ".heic",
  ".HEIC",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/bmp",
];
export const ALLOWED_AVATAR_FORMATS = [
  ".heic",
  ".HEIC",
  "image/jpeg",
  "image/png",
];

export const SUPPORTED_DOCUMENT_PREVIEW_REGEX =
  /\.(pdf|docx?|xlsx?|pptx?|txt|rtf|odt|ods|odp)(\?.*)?$/i;
export const DEFAULT_BLUR_HASH = "U27nLE$*00_N^k,@s9xu#7$2$%xtVD-B-pkW";
export const WEEK_DAYS = {
  0: "Su",
  1: "Mo",
  2: "Tu",
  3: "We",
  4: "Th",
  5: "Fr",
  6: "Sa",
};

export const DEFAULT_EDITOR_CODE = `// vvv Don\`t remove or change the line below! vvv
const handler = async (message, user, accept, resolve, reject, fetch) => {
        const body = message.body;

        // Reject the message if it contains any prohibited words
        const prohibitedWords = ["asshole", "fuck", "bullshit"];
        if (prohibitedWords.some(word => body.includes(word))) {
                return reject("Message blocked by moderation.");
        }

        return accept();
};

// vvv Don\`t remove or change the line below! vvv
export default await handler(env.MESSAGE, env.USER, env.ACCEPT, env.RESOLVE, env.REJECT, env.FETCH);
`;
export const EDITOR_FETCH_ERROR_MESSAGE =
  "A CORS error occurred while trying to perform a network request. This is likely due to browser restrictions that prevent fetching data from external sites in this environment. Please save your code and try running this script directly within a chat conversation instead.";
