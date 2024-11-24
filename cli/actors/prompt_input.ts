import inquirer from "inquirer";
import { fromCallback } from "xstate";
import { z } from "zod";

const EvPromptInput = z.object({
  type: z.literal("input"),
  message: z.string(),
});

type EvPromptInput = z.infer<typeof EvPromptInput>;

export const prompt_input = fromCallback<EvPromptInput>(
  ({ sendBack, receive }) => {
    receive(async (ev) => {
      const prompt = EvPromptInput.parse(ev);
      const answer = await inquirer.prompt([{
        type: "input",
        name: prompt.type,
        message: prompt.message,
      }]);
      sendBack({
        type: answer[prompt.type],
      });
    });
  },
);
