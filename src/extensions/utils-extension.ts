import type { ZicottToolbox } from "../types";

const extension = (toolbox: ZicottToolbox) => {
	const { filesystem } = toolbox;

	function isValidPath(path: string) {
		return typeof (filesystem.inspect(path)) !== "undefined";
	}

    function isValidFilename(text: string) {
        if (!text?.trim()) return false;

        const invalidChars = /[\/|\\:*?"<>]/g;

        if (invalidChars.test(text)) return false;

        if (text.length > 100) return false;

        return true;
    }

    function stringToFilename(text: string) {
        if (!text) return;

        return text
            .replace(/[\/|\\:*?"<>]/g, ' ')
            .replace(/\s+/g, ' ')
            .substring(0, 100);
    }

	toolbox.utils = {
		isValidPath,
        isValidFilename,
        stringToFilename,
	};
};

export default extension;
