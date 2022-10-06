import type { GluegunCommand } from "gluegun";
import type { ZicottToolbox } from "../types";

const command: GluegunCommand = {
	name: "help",
	description: "",
	alias: ["h"],
	dashed: true,
	hidden: true,
	run: async (toolbox: ZicottToolbox) => {
		const { filesystem, print, meta } = toolbox;

		if (meta.src) {
			print.info(
				print.colors.rainbow(
					await filesystem.readAsync(
						filesystem.path(meta.src, "assets", "logo.txt")
					)
				)
			);
			print.newline();
		}

		print.info("A CLI tool to easily download YouTube music.");
		print.newline();
		print.info(print.colors.bold("USAGE"));
		print.info("  zicott <link?> [flags]");
		print.newline();
		print.info(print.colors.bold("FLAGS"));
		print.table([
			["--help (h)", "Show help about a command"],
			["--version (v)", "Show installed version"],
			[
				"--output (o)",
				"Path to output mp3 file (defaults to current working directory)",
			],
			["--ffmpeg", "Path to FFmpeg binary"],
		]);
		print.newline();
		print.info(print.colors.bold("EXAMPLES"));
		print.info("  $ zicott");
		print.info("  $ zicott https://youtu.be/YNYXLWYcu-A");
		print.info(
			"  $ zicott https://youtu.be/d7V3M2DAq1E --output C:\\\\Users\\\\foo\\\\Downloads"
		);
		print.info(
			'  $ zicott "https://www.youtube.com/watch?v=TV0uYFPEkks&list=PLIpqsKgkQEvMUFbngp-GbW1JwDGXnxcm9&index=7"'
		);
		print.newline();
	},
};

export default command;
