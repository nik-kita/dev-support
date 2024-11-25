import type { NodePlopAPI } from "plop";
import { createActor } from "xstate";
import { machine } from "./cli/index.ts";
import { OutputCliMachine } from "./cli/types/output.ts";
import { gen_file_by_custom_template } from "./generators/gen_file_by_custom_template.ts";

const cli = createActor(machine);

const cli_output = await new Promise((resolve, reject) => {
  cli.start();
  cli.subscribe((snapshot) => {
    if (snapshot.status === "done") {
      resolve(snapshot.output);
    } else if (snapshot.status === "error") {
      reject(snapshot.error);
    }
  });
}) as OutputCliMachine;

export default async function (plop: NodePlopAPI) {
  if (cli_output.type === "custom blueprint") {
    await gen_file_by_custom_template(plop, {
      content: cli_output.content!,
      dictionary: cli_output.dictionary!,
      type: cli_output.type,
    });
  }
}
