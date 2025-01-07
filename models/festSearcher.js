const axios = require('axios');
const log = require('./log');


exports.getFestList = async (areaCd, signguCd, baseYm, pageNo) => {
    const url = 'http://apis.data.go.kr/B551011/TarRlteTarService/areaBasedList';
    const params = {
        serviceKey: 'nPJlr9SJRom4KOGMmkpx/M0vrvaDp3TV/UvKzUXLxWBEg2W5j/j/VH2F/SewCGQkWL7vTPQEELfWGqJhk/m0OQ==',
        MobileOS: 'ETC',
        MobileApp: 'TestApp',
        _type: 'json',

        pageNo: pageNo,
        numOfRows: 10,
        areaCd: areaCd,
        signguCd: signguCd,
        baseYm: baseYm,
    };

    try {
        const response = await axios.get(url, { params });
        log(response.data.response.body.items.item, 1);
        return response.data.response.body.items.item;
    } catch (error) {
        log(`Error: ${error.message}`, 3);
        throw new Error(error.message);
    }
}

exports.getSearchFestList = async (keyword, pageNo = 1) => {
    const url = 'http://apis.data.go.kr/B551011/TarRlteTarService/searchKeyword';
    
    if (!keyword) {
        throw new Error('Keyword is required');
    }

    const params = {
        serviceKey: 'nPJlr9SJRom4KOGMmkpx/M0vrvaDp3TV/UvKzUXLxWBEg2W5j/j/VH2F/SewCGQkWL7vTPQEELfWGqJhk/m0OQ==',
        MobileOS: 'ETC',
        MobileApp: 'TestApp',
        _type: 'json',
        keyword: "경복궁",
        pageNo: pageNo,
        numOfRows: 10,
        areaCd: 11,
        signguCd: 11110,
        baseYm: 202412,
    };

    try {
        const response = await axios.get(url, { params });
        log(response.data, 1);
        const items = response?.data?.response?.body?.items?.item || [];

        log(items, 1);

        return items;
    } catch (error) {
        log(`Error: ${error.message}`, 3);
        throw new Error(error.message);
    }
};
