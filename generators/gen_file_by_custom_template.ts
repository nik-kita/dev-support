import { ActionType, NodePlopAPI } from "plop";
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
    prompts: [
      ...Object.entries(options.dictionary).map(([k, v]) => {
        return {
          type: "input",
          name: v,
          message: `Enter value for ${k}`,
        };
      }),
      {
        type: "input",
        name: "__save__",
        message: "Name for this new template (skip to not save):",
      },
    ],
    actions(answers) {
      const { __save__, ...data } = answers || {};
      const actions: ActionType[] = [
        {
          type: "add",
          path: path.substring(0, path.length - ".hbs".length),
          templateFile: path,
          data,
        },
      ];

      if (__save__) {
        /**
         * @description Save this template for future use
         */
        const savePath = `templates/${__save__}.ts.hbs`;
        Deno.writeTextFileSync(savePath, options.content);
        /**
         * @description Generate generator for this template
         */
        actions.push(
          {
            type: "add",
            path: `generators/gen_${__save__}.ts`,
            templateFile: `templates/custom_generator.ts.hbs`,
            data: {
              name: __save__,
              description: `Generate ${__save__}`,
            },
            transform(content: string) {
              const transformedContent = content
                .replaceAll("// dd_options_bb", "{} // TODO options")
                .replaceAll("// dd_prompts_bb", "{} // TODO prompts")
                .split("\n").map((line) => {
                  if (line.includes("// dd_RM_LINE_bb")) {
                    return "";
                  }
                  if (line.includes("// dd_REPLACE_LINE_bb")) {
                    const REPLACE_MARKER = "// dd_REPLACE_LINE_bb";
                    const lastRmIndex = line.lastIndexOf(
                      REPLACE_MARKER,
                    );
                    return line.substring(lastRmIndex + REPLACE_MARKER.length);
                  }

                  return line;
                }).join("\n");

              return transformedContent;
            },
          },
        );
      }

      return actions;
    },
  });
}
