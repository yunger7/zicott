import type { GluegunCommand } from "gluegun";
import type { ZicottToolbox } from "../types";

const command: GluegunCommand = {
	run: async (toolbox: ZicottToolbox) => {
		const { print, prompt, parameters, youtube } = toolbox;

		const options = parameters.options;

		let ffmpegPath: string = options.ffmpeg || "";
		let outputPath: string = options.o || options.output || "";
        let downloadPlaylist: boolean = options.p || options.playlist || false;

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

        if (downloadPlaylist) {
            const videoIds = await youtube.getVideoIdsFromPlaylist(url);

            if (!videoIds?.length) return;

            for (let i = 0; i < videoIds.length; i++) {
                const videoId = videoIds[i];

                print.info(`[Playlist]: Downloading video ${i + 1} of ${videoIds.length}`);
                
                await youtube.download(videoId, {
                    ffmpegPath,
                    output: outputPath,
                });
            }

            return;
        }

        const videoId = youtube.getVideoID(url);

        if (!videoId) return;

		await youtube.download(videoId, {
            ffmpegPath,
            output: outputPath,
        });

        process.exit(0);
	},
};

export default command;
