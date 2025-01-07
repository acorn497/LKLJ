const log = require('../services/log');
const { getFestList, getSearchFestList } = require('../models/festivalSearcher');
const { postComment } = require('../models/commentService');

exports.getFestList = (req, res) => {
    /*
    {
        "areaCd": "11",
        "signguCd": "11110",
        "baseYm": "202408",
        "pageNo": "1",
    }
    */
    const { areaCd, signguCd, baseYm, pageNo } = req.body;
    log(`GET Req: ${areaCd}, ${signguCd}, ${baseYm}, ${pageNo}`);
    getFestList(areaCd, signguCd, baseYm, pageNo)
        .then(message => res.status(201).json({ message }))
        .catch(error => res.status(400).json({ error }));
}

exports.getSearchFestList = async (req, res) => {
    /*
        {
            "keyword": "경복궁",
        }
    */
    const { keyword } = req.body;

    log(`GET Req: ${keyword}`);

    if (!keyword) {
        return res.status(400).json({ error: 'Keyword is required' });
    }

    const params = {
        keyword,
        numOfRows: 10,
        pageNo: 1,
        _type: 'json'
    };

    try {
        const data = await getSearchFestList(params);
        res.status(200).json(data);
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