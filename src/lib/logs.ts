import { Logtail } from "@logtail/node"
export const logtail = new Logtail(process.env.VITE_LOGTAIL_SOURCE_TOKEN ?? "",{ignoreExceptions: true});
