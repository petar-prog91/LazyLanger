const subtitleFilter = function (req, file, cb) {
    // accept image only
    if (!file.originalname.match(/\.(srt)$/)) {
        return cb(new Error('Only subtitle srt files are allowed!'), false);
    }
    cb(null, true);
};

export { subtitleFilter }