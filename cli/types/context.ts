import { ActorRefFrom } from "xstate";
import { actors } from "../actors/index.ts";

export const context = {} as {
  prompt_choose: ActorRefFrom<typeof actors["prompt_choose"]>;
  prompt_input: ActorRefFrom<typeof actors["prompt_input"]>;
};
