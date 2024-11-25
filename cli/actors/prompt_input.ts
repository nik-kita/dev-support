import { editor } from "@inquirer/prompts";
import { fromCallback } from "xstate";
import { EvCliMachine, EvPromptInput } from "../types/events.ts";

export const prompt_input = fromCallback<EvCliMachine>(
  ({ sendBack, receive }) => {
    receive(async (ev) => {
      const prompt = EvPromptInput.parse(ev);
      const answer = await editor({
        message: prompt.message,
      });
      const cbEv = {
        type: prompt.cb_ev_type,
        value: answer,
      };
      sendBack(cbEv);
    });
  },
);
