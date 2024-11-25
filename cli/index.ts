import { actions } from "./actions/index.ts";
import { actors } from "./actors/index.ts";
import { types } from "./types/index.ts";

//-------------------------------------------
import { setup } from "xstate";

export const machine = setup({
  actions,
  actors,
  types,
}).createMachine({
  context: ({ spawn }) => {
    const prompt_choose = spawn("prompt_choose");
    const prompt_input = spawn("prompt_input");
    return {
      prompt_choose,
      prompt_input,
    };
  },
  output: ({ context }) => {
    return context.output!;
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
            "directly ctrl+c ctrl+v": {
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
          on: {
            "input:answer content": {
              target: "Read dictionary for content",
              actions: {
                type: "assign_content",
              },
            },
          },
          entry: {
            type: "Paste your file's content",
          },
        },
        "Read file by path": {},
        "Read dictionary for content": {
          on: {
            "input:answer dictionary": {
              target: "Complete",
              actions: {
                type: "assign_dictionary",
              },
            },
          },
          entry: {
            type:
              "Paste object that is represent variables dictionary for this content",
          },
        },
        Complete: {
          type: "final",
          entry: [
            {
              type: "assign_output",
            },
          ],
        },
      },
      onDone: {
        target: "Exit",
      },
    },
    "Exit": {
      type: "final",
    },
  },
});
