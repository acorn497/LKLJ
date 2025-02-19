const log = require('../services/log');
const { getSearchFestList } = require('../models/festivalSearcher');
const { postComment } = require('../models/commentService');

exports.getSearchFestList = async (req, res) => {
    /*
        {
            "keyword": "경복궁",
        }
    */
    const { keyword } = req.body;

    log(req.body);

    log(`POST Req: ${keyword}`);

    if (!keyword) {
        return res.status(400).json({ error: 'Keyword is required' });
    }

    try {
        const data = await getSearchFestList(keyword);
        log(data.items, 1);
        res.status(200).json(data.items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.postComment = async (req, res) => {
    const { content, userId, shopId } = req.body;

    try {
        const result = await postComment(content, userId, shopId);
        res.status(200).json({ message: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};