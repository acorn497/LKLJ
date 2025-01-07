const axios = require('axios');
const log = require('../services/log');
const fs = require('fs').promises;
const csv = require('csv-parser');
const { createReadStream } = require('fs');

const CSV_FILE_PATH = process.env.FESTIVAL_CSV_PATH || './data.csv';

const readCSVFile = () => {
    return new Promise((resolve, reject) => {
        const results = [];
        let headersPrinted = false;

        createReadStream(CSV_FILE_PATH, { encoding: 'utf8' })
            .pipe(csv({
                separator: ',',
                mapHeaders: ({ header }) => header.trim(),
                mapValues: ({ value }) => value.trim()
            }))
            .on('headers', (headers) => {
                log('CSV Headers:', headers);
            })
            .on('data', (row) => {
                // 첫 번째 데이터 행의 구조를 로깅
                if (!headersPrinted) {
                    log('First row data structure:', Object.keys(row));
                    log('First row values:', Object.values(row));
                    headersPrinted = true;
                }

                // 빈 객체가 아닌 경우에만 결과에 추가
                if (Object.keys(row).length > 0 && row['축제명']) {
                    results.push(row);
                }
            })
            .on('end', () => {
                log(`Total valid rows read: ${results.length}`);
                if (results.length > 0) {
                    log('Sample festival data:', results[0]);
                }
                resolve(results);
            })
            .on('error', (error) => {
                log(`Error reading CSV: ${error.message}`);
                reject(error);
            });
    });
};

exports.getSearchFestList = async (keyword) => {
    try {
        log(`Searching for keyword: '${keyword}'`);
        const festivals = await readCSVFile();

        if (festivals.length === 0) {
            log('No festivals data loaded from CSV');
            return {
                status: 200,
                message: 'No data available',
                count: 0,
                items: []
            };
        }

        const items = festivals
            .filter(festival => {
                if (!festival['축제명']) {
                    return false;
                }
                const festivalName = festival['축제명'].toString();
                const isMatch = festivalName.toLowerCase().includes(keyword.toLowerCase());
                if (isMatch) {
                    log(`Found matching festival: ${festivalName}`);
                }
                return isMatch;
            })
            .slice(0, 5)
            .map(festival => {
                // null 체크를 포함한 안전한 값 추출 함수
                const getValue = (key) => festival[key] ? festival[key].toString() : '';

                return {
                    festivalName: getValue('축제명'),
                    location: getValue('개최장소'),
                    startDate: getValue('축제시작일자'),
                    endDate: getValue('축제종료일자'),
                    content: getValue('축제내용'),
                    organizer: getValue('주관기관명'),
                    host: getValue('주최기관명'),
                    supporter: getValue('후원기관명'),
                    tel: getValue('전화번호'),
                    homepage: getValue('홈페이지주소'),
                    relatedInfo: getValue('관련정보'),
                    roadAddress: getValue('소재지도로명주소'),
                    parcelAddress: getValue('소재지지번주소'),
                    latitude: getValue('위도'),
                    longitude: getValue('경도'),
                    dataStandardDate: getValue('데이터기준일자'),
                    providerCode: getValue('제공기관코드'),
                    providerName: getValue('제공기관명')
                };
            });

        log(`Found ${items.length} matching festivals for keyword '${keyword}'`);
        
        if (items.length > 0) {
            log('First matching item:', items[0]);
        }

        return {
            status: 200,
            message: items.length > 0 ? 'Success' : 'No matches found',
            count: items.length,
            items: items
        };

    } catch (error) {
        log(`Festival search error: ${error.message}`);
        return {
            status: 500,
            message: error.message,
            count: 0,
            items: []
        };
    }
};
// const url = 'http://api.data.go.kr/openapi/tn_pubr_public_cltur_fstvl_api';

// if (!keyword) {
//     throw new Error('Keyword is required');
// }

// const params = {
//     serviceKey: 'Fmw0OCqtVtbsXHpNXiSmTvnPUOZCGZ58pLfF9XgFca9Uvm8nO6WhfL05XSpSCQW3OZkO/oCiE24KENJxy/TYjA==',
    
//     fstvlNm: keyword,
//     _type: "JSON"
// };

// try {
//     const response = await axios.get(url, { params });
//     log(response.data, 1);

//     const items = response?.data?.response?.body?.items?.item || [];
//     return items;
// } catch (error) {
//     log(`Error: ${error.message}`, 3);
//     throw new Error(error.message);
// }
