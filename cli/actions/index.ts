import { assertEvent, assign } from "xstate";
import { context } from "../types/context.ts";
import { EvCliMachine } from "../types/events.ts";

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
      choices: [{ value: "directly ctrl+c ctrl+v" }, {
        value: "specify path to it",
      }],
    });
  },
  "Paste your file's content": ({ context }: _Params) => {
    context.prompt_input.send({
      type: "input",
      message: "Paste your file's content",
      cb_ev_type: "input:answer content" satisfies EvCliMachine["type"],
    });
  },
  "Paste object that is represent variables dictionary for this content": (
    { context }: _Params,
  ) => {
    context.prompt_input.send({
      type: "input",
      message:
        "Paste object that is represent variables dictionary for this content",
      cb_ev_type: "input:answer dictionary" satisfies EvCliMachine["type"],
    });
  },
  "assign_content": assign<_Params["context"], _Params["event"], any, any, any>(
    ({
      event,
      context,
    }) => {
      assertEvent(event, "input:answer content");
      return {
        ...context,
        content: event.value as string,
      };
    },
  ),
  "assign_dictionary": assign<
    _Params["context"],
    _Params["event"],
    any,
    any,
    any
  >(
    ({ context, event }) => {
      assertEvent(event, "input:answer dictionary");

      return {
        ...context,
        dictionary: event.value as string,
      };
    },
  ),
  "assign_output": assign<_Params["context"], _Params["event"], any, any, any>(
    ({ context }) => {
      return {
        ...context,
        output: {
          content: context.content,
          dictionary: context.dictionary,
        },
      };
    },
  ),
};

type _Params = {
  context: typeof context;
  event: EvCliMachine;
};
