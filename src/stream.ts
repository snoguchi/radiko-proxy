import crypto from 'crypto';

async function getRadikoAuthToken(): Promise<string> {
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

function getRadikoStreamUrl(stationId: string): string {
  const lsid = crypto.createHash('md5').update(Math.random().toString()).digest('hex');

  const params = new URLSearchParams({
    station_id: stationId,
    l: '15',
    lsid: lsid,
    type: 'b',
  });

  const streamUrl = `https://f-radiko.smartstream.ne.jp/${stationId}/_definst_/simul-stream.stream/playlist.m3u8`;

  return `${streamUrl}?${params.toString()}`;
}

export async function getRadikoStream(stationId: string): Promise<ReadableStream> {
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
