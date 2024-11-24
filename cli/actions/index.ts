import { context } from "../types/context.ts";

export const actions = {
  "What do you want to do?": ({ context }: _Params) => {
    context.prompt_choose.send({
      type: "list",
      message: "What do you want to do?",
      choices: [
        { value: "I want to generate starter template" },
        { value: "I want to extend this generator" },
        { value: "I want to make file from my custom blueprint" },
      ],
    });
  },
  "Choose runtime please": ({ context }: _Params) => {
    context.prompt_choose.send({
      type: "list",
      message: "Choose runtime please",
      choices: [{ value: "Deno" }, { value: "nodejs" }],
    });
  },
  "How do you want to extend generator?": ({ context }: _Params) => {
    context.prompt_choose.send({
      type: "list",
      message: "How do you want to extend generator?",
      choices: [{ value: "Add new template" }, { value: "Other" }],
    });
  },
  "How you want to load file's content?": ({ context }: _Params) => {
    context.prompt_choose.send({
      type: "list",
      message: "How you want to load file's content?",
      choices: [{ value: "simply ctrl+v" }, { value: "specify path to it" }],
    });
  },
  "Paste your file's content": ({ context }: _Params) => {
    context.prompt_input.send({
      type: "input",
      message: "Paste your file's content",
    });
  },
};

type _Params = {
  context: typeof context;
};
