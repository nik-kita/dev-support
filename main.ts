import type { NodePlopAPI } from "plop";
import { createActor } from "xstate";
import { machine } from "./cli/index.ts";

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
});

export default function (plop: NodePlopAPI) {
}
