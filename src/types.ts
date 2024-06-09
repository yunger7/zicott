import type { GluegunToolbox } from "gluegun";

export interface ZicottToolbox extends GluegunToolbox {
	config: null;
	semver: null;
	http: null;
	strings: null;
	system: null;
	template: null;
	patching: null;
	packageManager: null;
	youtube: {
		getVideoID: (url: string) => string | undefined;
		download: (id: string, ffmpeg?: string, output?: string) => Promise<void>;
	};
	utils: {
		isValidPath: (path: string) => boolean;
        isValidFilename: (text: string) => boolean;
        stringToFilename: (text: string) => string | undefined;
	};
}
