"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("fs/promises"));
const fast_xml_parser_1 = require("fast-xml-parser");
async function createPlaylist() {
    const response = await fetch('https://radiko.jp/v3/station/region/full.xml');
    const data = await response.text();
    const { region } = new fast_xml_parser_1.XMLParser({
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
    await promises_1.default.writeFile('radiko.m3u', lines.join('\n'));
}
createPlaylist();
