import inquirer from "inquirer";
import { fromCallback } from "xstate";
import { EvCliMachine, EvPromptInput } from "../types/events.ts";

export const prompt_input = fromCallback<EvCliMachine>(
  ({ sendBack, receive }) => {
    receive(async (ev) => {
      const prompt = EvPromptInput.parse(ev);
      const answer = await inquirer.prompt([{
        type: "input",
        name: prompt.type,
        message: prompt.message,
      }]);
      const cbEv = {
        type: prompt.cb_ev_type,
        value: answer[prompt.type],
      };
      sendBack(cbEv);
    });
  },
);
