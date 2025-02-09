"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRadikoStream = getRadikoStream;
const crypto_1 = __importDefault(require("crypto"));
async function getRadikoAuthToken() {
    const auth1Response = await fetch('https://radiko.jp/v2/api/auth1', {
        headers: {
            'X-Radiko-App': 'pc_html5',
            'X-Radiko-App-Version': '0.0.1',
            'X-Radiko-User': 'dummy_user',
            'X-Radiko-Device': 'pc',
        },
    });
    const authToken = auth1Response.headers.get('x-radiko-authtoken') || '';
    const keyLength = parseInt(auth1Response.headers.get('x-radiko-keylength') || '0');
    const keyOffset = parseInt(auth1Response.headers.get('x-radiko-keyoffset') || '0');
    const key = 'bcd151073c03b352e1ef2fd66c32209da9ca0afa';
    const authKey = Buffer.from(key.slice(keyOffset, keyOffset + keyLength)).toString('base64');
    await fetch('https://radiko.jp/v2/api/auth2', {
        headers: {
            'X-Radiko-AuthToken': authToken,
            'X-Radiko-PartialKey': authKey,
            'X-Radiko-User': 'dummy_user',
            'X-Radiko-Device': 'pc',
        },
    });
    return authToken;
}
function getRadikoStreamUrl(stationId) {
    const lsid = crypto_1.default.createHash('md5').update(Math.random().toString()).digest('hex');
    const params = new URLSearchParams({
        station_id: stationId,
        l: '15',
        lsid: lsid,
        type: 'b',
    });
    const streamUrl = `https://f-radiko.smartstream.ne.jp/${stationId}/_definst_/simul-stream.stream/playlist.m3u8`;
    return `${streamUrl}?${params.toString()}`;
}
async function getRadikoStream(stationId) {
    const authToken = await getRadikoAuthToken();
    const streamUrl = getRadikoStreamUrl(stationId);
    const response = await fetch(streamUrl, {
        headers: {
            'X-Radiko-Authtoken': authToken,
            'X-Radiko-Device': 'pc',
            'X-Radiko-User': 'guest',
            'User-Agent': 'python-requests/2.28.2',
        },
    });
    if (!response.ok || !response.body) {
        throw new Error('Failed to get stream');
    }
    return response.body;
}
