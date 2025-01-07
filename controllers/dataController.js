const log = require('../models/log');
const { getFestList, getSearchFestList } = require('../models/festSearcher');

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

