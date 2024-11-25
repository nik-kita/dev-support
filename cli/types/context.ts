import { ActorRefFrom } from "xstate";
import { actors } from "../actors/index.ts";
import { OutputCliMachine } from "./output.ts";

export const context = {} as {
  dictionary?: string;
  content?: string;
  // deno-lint-ignore no-explicit-any
  output?: OutputCliMachine;
  prompt_choose: ActorRefFrom<typeof actors["prompt_choose"]>;
  prompt_input: ActorRefFrom<typeof actors["prompt_input"]>;
};
