import { build } from "gluegun";
import help from "./commands/help";

async function run(argv) {
	const cli = build()
		.brand("zicott")
		.src(__dirname)
		.help(help)
		.version()
		.exclude([
			"config",
			"semver",
			"http",
			"strings",
			"system",
			"template",
			"patching",
			"package-manager",
		])
		.checkForUpdates(15)
		.create();

	const toolbox = await cli.run(argv);

	return toolbox;
}

module.exports = { run };
