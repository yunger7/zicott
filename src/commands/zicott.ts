import type { GluegunCommand } from "gluegun";
import type { ZicottToolbox } from "../types";

const command: GluegunCommand = {
	run: async (toolbox: ZicottToolbox) => {
		const { print, prompt, parameters, youtube } = toolbox;

		const options = parameters.options;

		let ffmpegPath: string;
		let outputPath: string;

		if (typeof options.ffmpeg === "string") {
			ffmpegPath = options.ffmpeg;
		}

		if (typeof options.o === "string") {
			outputPath = options.o;
		} else if (typeof options.output === "string") {
			outputPath = options.output;
		}

		let url = parameters.first;

		if (!url) {
			const result = await prompt.ask({
				name: "url",
				type: "input",
				message: "Enter a YouTube URL",
			});

			if (!result || !result.url) {
				print.error("[ERROR]: No URL specified");
				return;
			}

			url = result.url;
		}

		const videoID = youtube.getVideoID(url);

		if (!videoID) return;

		await youtube.download(videoID, ffmpegPath, outputPath);
	},
};

export default command;
