import { NodePlopAPI } from "plop";
import { OutputCliMachine } from "../cli/types/output.ts";

export async function gen_file_by_custom_template(
  plop: NodePlopAPI,
  options: Required<
    Extract<OutputCliMachine, {
      type: "custom blueprint";
    }>
  >,
) {
  await Deno.mkdir(".output", { recursive: true });
  for (const [k, v] of Object.entries(options.dictionary)) {
    options.content = options.content.replaceAll(k, `{{${v}}}`);
  }
  const path = `.output/custom-blueprint.${Date.now()}.ts.hbs`;
  await Deno.writeTextFile(path, options.content);
  plop.setGenerator("gen_file_by_custom_template", {
    description: "Generate file based on custom blueprint",
    prompts: Object.entries(options.dictionary).map(([k, v]) => {
      return {
        type: "input",
        name: v,
        message: `Enter value for ${k}`,
      };
    }),
    actions(answers) {
      return [
        {
          type: "add",
          path: path.substring(0, path.length - ".hbs".length),
          templateFile: path,
          data: answers,
        },
      ];
    },
  });
}
