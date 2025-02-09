import fsPromises from 'fs/promises';
import { XMLParser } from 'fast-xml-parser';

async function createPlaylist() {
  const response = await fetch('https://radiko.jp/v3/station/region/full.xml');
  const data = await response.text();
  const { region } = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
    parseAttributeValue: true,
  }).parse(data);

  const lines = [`#EXTM3U`];
  for (const { region_name, station } of region.stations) {
    lines.push(`#EXTGRP:${region_name}`);
    for (const { id, name } of station) {
      lines.push(`#EXTINF:-1,${name}`);
      lines.push(`http://localhost:3000/streams/${id}`);
    }
  }
  await fsPromises.writeFile('radiko.m3u', lines.join('\n'));
}

createPlaylist();
