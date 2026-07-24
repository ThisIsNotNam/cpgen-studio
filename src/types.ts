export interface WorkspaceFile {
  path: string;
  name: string;
  language: string;
  value: string;
  isDirty: boolean;
}

export interface WorkspaceFilePayload {
  path: string;
  name: string;
  language: string;
  value: string;
}

export type WorkspaceSlot = "generator" | "solution";

export type LogLevel = "info" | "success" | "warn" | "error" | "cmd" | "dim";

export interface LogEntry {
  id: number;
  time: string;
  level: LogLevel;
  message: string;
}

export interface ConfigState {
  batches: number;
  indexDelivery: "argv[1]" | "stdin";
}

export type FieldKind = "int" | "string" | "array" | "loop";

export interface BaseNode {
  id: string;
  kind: FieldKind;
  varName?: string;
}

export interface IntNode extends BaseNode {
  kind: "int";
  min: string;
  max: string;
}

export interface StringNode extends BaseNode {
  kind: "string";
  length: string;
  charset: "lowercase" | "uppercase" | "alphanumeric" | "digits" | "custom";
  customCharset?: string;
}

export interface ArrayNode extends BaseNode {
  kind: "array";
  length: string;
  elementType: "int" | "string" | "float";
  min: string;
  max: string;
  separator: "space" | "newline" | "comma";
}

export interface LoopNode extends BaseNode {
  kind: "loop";
  children: SchemaNode[];
}

export type SchemaNode = IntNode | StringNode | ArrayNode | LoopNode;
