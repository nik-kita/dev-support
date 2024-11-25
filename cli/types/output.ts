export const output = {} as OutputCliMachine;

export type OutputCliMachine = {
  content?: string;
  dictionary?: Record<string, string>;
  type: "custom blueprint";
};
