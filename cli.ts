import inquirer from "inquirer";
import { CallbackActorRef, fromCallback, setup } from "xstate";
import { z } from "zod";

export const machine = setup({
  actors: {
    prompt_choose: fromCallback(({ sendBack, receive }) => {
      const promptEventSchema = z.object({
        type: z.string(),
        message: z.string(),
        choices: z.array(z.object({
          name: z.string().optional(),
          value: z.string(),
        })),
      });

      receive(async (ev) => {
        const prompt = promptEventSchema.parse(ev);
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
    }),
  },
  types: {
    context: {} as {
      prompt_choose: CallbackActorRef<any>;
      purpose?: "use generator" | "extend generator";
    },
    events: {} as
      | { type: "i want to generate starter template" }
      | { type: "i want to extend this generator" },
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
      entry: ({ context }) => {
        context.prompt_choose.send({
          type: "prompt",
          message: "What do you want to do?",
          choices: [
            { value: "i want to generate starter template" },
            { value: "i want to extend this generator" },
          ],
        });
      },
      on: {
        "i want to generate starter template": {
          target: "Starter template generation",
        },
        "i want to extend this generator": {
          target: "Generator extending",
        },
      },
    },
    "Starter template generation": {
      entry: [
        () => console.log("Starter template generation"),
      ],
      type: "final",
    },
    "Generator extending": {
      entry: [
        () => console.log("Generator extending"),
      ],
      type: "final",
    },
  },
});
