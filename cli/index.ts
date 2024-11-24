import { setup } from "xstate";
import { context } from "./types/context.ts";
import { actors } from "./actors/index.ts";
import { actions } from "./actions/index.ts";

export const machine = setup({
  actors,
  types: {
    context,
    events: {} as
      | { type: "I want to generate starter template" }
      | { type: "I want to extend this generator" }
      | { type: "I want to make file from my custom blueprint" }
      | { type: "simply ctrl+v" }
      | { type: "specify path to it" },
  },
  actions,
}).createMachine({
  context: ({ spawn }) => {
    const prompt_choose = spawn("prompt_choose");
    const prompt_input = spawn("prompt_input");
    return {
      prompt_choose,
      prompt_input,
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
        "I want to make file from my custom blueprint": {
          target: "Generate file based on custom blueprint",
        },
      },
      entry: {
        type: "What do you want to do?",
      },
    },
    "Generate starter template": {
      type: "final",
      entry: {
        type: "Choose runtime please",
      },
    },
    "Extend generator": {
      type: "final",
      entry: {
        type: "How do you want to extend generator?",
      },
    },
    "Generate file based on custom blueprint": {
      initial: "Uploading file content",
      states: {
        "Uploading file content": {
          on: {
            "simply ctrl+v": {
              target: "Read content from prompt",
            },
            "specify path to it": {
              target: "Read file by path",
            },
          },
          entry: {
            type: "How you want to load file's content?",
          },
        },
        "Read content from prompt": {
          entry: {
            type: "Paste your file's content",
          },
        },
        "Read file by path": {},
      },
    },
  },
});
