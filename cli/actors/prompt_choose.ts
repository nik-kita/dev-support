import inquirer from "inquirer";
import { fromCallback } from "xstate";
import { z } from "zod";

const EvPromptChoose = z.object({
  type: z.string(),
  message: z.string(),
  choices: z.array(z.object({
    name: z.string().optional(),
    value: z.string(),
  })),
});

type EvPromptChoose = z.infer<typeof EvPromptChoose>;

export const prompt_choose = fromCallback<EvPromptChoose>(
  ({ sendBack, receive }) => {
    receive(async (ev) => {
      const prompt = EvPromptChoose.parse(ev);
      const answer = await inquirer.prompt([{
        message: prompt.message,
        name: prompt.type,
        choices: prompt.choices,
        type: "list",
      }]);
      sendBack({
        type: answer[prompt.type],
      });
    });
  },
);
