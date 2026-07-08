import dotenv from "dotenv";

dotenv.config();

const API_ENDPOINT = "http://4.224.186.213/evaluation-service/logs";

const STACK_OPTIONS = ["backend", "frontend"];
const LEVEL_OPTIONS = ["debug", "info", "warn", "error", "fatal"];

const MODULES = {
  backend: [
    "cache",
    "controller",
    "cron_job",
    "db",
    "domain",
    "handler",
    "repository",
    "route",
    "service",
  ],

  frontend: [
    "api",
    "component",
    "hook",
    "page",
    "state",
  ],

  common: [
    "auth",
    "config",
    "middleware",
    "utils",
  ],
};

const checkPackage = (stack, moduleName) => {
  if (MODULES.common.includes(moduleName)) return true;
  return MODULES[stack]?.includes(moduleName);
};

async function writeLog(stack, level, moduleName, message) {
  const logStack = stack.toLowerCase().trim();
  const logLevel = level.toLowerCase().trim();
  const logModule = moduleName.toLowerCase().trim();

  if (!STACK_OPTIONS.includes(logStack))
    throw new Error("Unsupported stack");

  if (!LEVEL_OPTIONS.includes(logLevel))
    throw new Error("Unsupported log level");

  if (!checkPackage(logStack, logModule))
    throw new Error("Invalid package name");

  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
      },
      body: JSON.stringify({
        stack: logStack,
        level: logLevel,
        package: logModule,
        message,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error(result);
      return null;
    }

    return result;
  } catch (err) {
    console.error("Logging service unavailable");
    return null;
  }
}

export { writeLog };