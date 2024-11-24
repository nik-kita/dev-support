import z from "zod";

export const events = {} as EvCliMachine;

export const EvPromptInput = z.object({
  type: z.literal("input"),
  cb_ev_type: z.string(),
  message: z.string(),
});

export type EvPromptInput = z.infer<typeof EvPromptInput>;

export type EvCliMachine =
  | { type: "I want to generate starter template" }
  | { type: "I want to extend this generator" }
  | { type: "I want to make file from my custom blueprint" }
  | { type: "simply ctrl+v" }
  | { type: "specify path to it" }
  | { type: "input" }
  | { type: "input:answer content"; value: unknown }
  | { type: "input:answer dictionary"; value: unknown }
  | EvPromptInput;
