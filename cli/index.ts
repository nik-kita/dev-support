import { setup } from "xstate";
import { context } from "./types/context.ts";
import { actors } from "./actors/index.ts";

export const machine = setup({
  actors,
  types: {
    context,
    events: {} as
      | { type: "I want to generate starter template" }
      | { type: "I want to extend this generator" },
  },
  actions: {
    "What do you want to do?": ({ context }) => {
      context.prompt_choose.send({
        type: "prompt",
        message: "What do you want to do?",
        choices: [
          { value: "I want to generate starter template" },
          { value: "I want to extend this generator" },
        ],
      });
    },
    "Choose runtime please": ({ context }) => {
      context.prompt_choose.send({
        type: "prompt",
        message: "Choose runtime please",
        choices: [{ value: "Deno" }, { value: "nodejs" }],
      });
    },
    "How do you want to extend generator?": ({ context }) => {
      context.prompt_choose.send({
        type: "prompt",
        message: "How do you want to extend generator?",
        choices: [{ value: "Add new template" }, { value: "Other" }],
      });
    },
  },
}).createMachine({
  context: ({ spawn }) => {
    const prompt_choose = spawn("prompt_choose");
    return {
      prompt_choose,
    };
  },
  id: "main",
  initial: "Hello",
  states: {
    Hello: {
      on: {
        "I want to generate starter template": {
          target: "Generate starter template",
        },
        "I want to extend this generator": {
          target: "Extend generator",
        },
      },
      entry: {
        type: "What do you want to do?",
      },
    },
    "Generate starter template": {
      entry: {
        type: "Choose runtime please",
      },
    },
    "Extend generator": {
      entry: {
        type: "How do you want to extend generator?",
      },
    },
  },
});
