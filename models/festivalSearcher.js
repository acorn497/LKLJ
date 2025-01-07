const axios = require('axios');
const log = require('../services/log');

exports.getSearchFestList = async (keyword, areaCd, baseYm, pageNo = 1) => {
    const url = 'http://apis.data.go.kr/B551011/TarRlteTarService/searchKeyword';
    
    if (!keyword) {
        throw new Error('Keyword is required');
    }

    log(areaCd);

    const params = {
        serviceKey: 'nPJlr9SJRom4KOGMmkpx/M0vrvaDp3TV/UvKzUXLxWBEg2W5j/j/VH2F/SewCGQkWL7vTPQEELfWGqJhk/m0OQ==',
        MobileOS: 'ETC',
        MobileApp: 'TestApp',
        _type: 'json',

        keyword: keyword,
        pageNo: pageNo,
        numOfRows: 5,
        areaCd: areaCd,
        signguCd: `${areaCd}110`,
        baseYm: baseYm,
    };

    try {
        const response = await axios.get(url, { params });
        log(response.data.response.body.items.item, 1);
        const items = response?.data?.response?.body?.items?.item || [];
        return items;
    } catch (error) {
        log(`Error: ${error.message}`, 3);
        throw new Error(error.message);
    }
};
