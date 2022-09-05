const Download = require("../models/downloads");

class DownloadService {
    getAllDownloads = async (userId) => {
        try {
            return await Download.findAll({ where : { userId : userId }});
        } catch (error) {
            throw error;
        }
    }

    addDownload = async (userId, filename, fileUrl) => {
        try {
            return await Download.create({ name : filename, fileUrl : fileUrl, userId : userId});
        } catch (error) {
            throw error;
        }
    }
}

module.exports = DownloadService;