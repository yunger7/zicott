import type { GluegunToolbox } from "gluegun";

export type DownloadOptions = {
    ffmpegPath?: string;
    output?: string;
    skipProgressBar?: boolean;
};

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
        getVideoIdsFromPlaylist: (url: string) => Promise<Array<string>>;
		download: (id: string, downloadOptions: DownloadOptions) => Promise<void>;
	};
	utils: {
		isValidPath: (path: string) => boolean;
        isValidFilename: (text: string) => boolean;
        stringToFilename: (text: string) => string | undefined;
	};
}
