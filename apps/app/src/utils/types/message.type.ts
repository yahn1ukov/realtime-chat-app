import type { MESSAGE_TYPE } from "../constants/message.constant";

export type MessageType = (typeof MESSAGE_TYPE)[keyof typeof MESSAGE_TYPE];
