import React from 'react';

/* Import constants */
import {lang} from '../constants/RenderConstants.js';
import {TAALAMS} from '../constants/AppConstants.js';

/* Import components */
import HeaderComponent from '../components/Header.jsx';
import {ParagraphComponent} from '../components/Paragraph.jsx';
import TextComponent from '../components/Text.jsx';

/* TEMPORARY VARIABLES */
let DEFAULT_TAALAM = TAALAMS.triputa;
let DEFAULT_JAATHI = 4;
let DEFAULT_KAALAM = 2;
let DEFAULT_NADAI  = 4;

var GLOBAL_TAALAM = JSON.stringify(DEFAULT_TAALAM);
var GLOBAL_JAATHI = DEFAULT_JAATHI;
var GLOBAL_KAALAM = JSON.stringify(DEFAULT_KAALAM);
var GLOBAL_NADAI  = JSON.stringify(DEFAULT_NADAI);

function cleanUpperText(str) {
	if (str.length == 0) {
		return str
	}
	else {
		var cleanStr = '';
		cleanStr += str[0];
		for (var i = 1; i < str.length; i++) {
			cleanStr += str[i].toLowerCase();
		}
		return cleanStr;
	}
}

/*
	TODO
	Cleaner way of passing data to these 'orphaned' paragraphs
*/
export function renderTree(obj, currlevel, content, taalam, kaalam) {
	console.log("Render Tree Kaalam: " + kaalam);
	if (Object.prototype.toString.call(obj) === '[object Object]') {
		Object.entries(obj).forEach(([key, value]) => {
			// Render header
			content.push(<HeaderComponent text={key.replace(/['"']+/g, '')} level={currlevel}/>);
			// Recurse
			content = renderTree(value, currlevel, content, taalam, kaalam);
		});
	} else {
		if (Object.prototype.toString.call(obj) === '[object Array]') {
			// Iterate over array
			var parContent = [];
			for (var o of obj) {
				if (Object.prototype.toString.call(o) === '[object Object]') {
					// Recurse
					if (parContent.length >  0) {
						content.push(<ParagraphComponent content={parContent} taalam={taalam} jaathi={GLOBAL_JAATHI} kaalam={kaalam} nadai={GLOBAL_NADAI} />);
						parContent = [];
					}
					content = renderTree(o, currlevel+1, content, taalam, kaalam);
				} else {
					// Decode
					o = Number(o);
					var speed = 0;
					if (o < -1) {
						o = o*-1 - 2;
						speed = 1;
					}
					// Render
					var oToText
					if (o == -1) {
						oToText = '!';
					} else {
						oToText = lang[o];
						oToText = cleanUpperText(oToText);
					}
					//content.push(<TextComponent text={oToText} />);
					parContent.push(<TextComponent text={oToText} />);
				}
			}
			if (parContent.length >  0) {
				content.push(<ParagraphComponent content={parContent} taalam={taalam} jaathi={GLOBAL_JAATHI} kaalam={kaalam} nadai={GLOBAL_NADAI} />);
				parContent = [];
			}
		}
	}
	return content;
}

export function renderTreeHeaders(obj, currlevel) {
	var data = {}
	console.log("Data: ");
	console.log(obj);

	if (Object.prototype.toString.call(obj) === '[object Object]') {
		Object.entries(obj).forEach(([key, value]) => {
			// Push key with value
			data[key] = renderTreeHeaders(value, currlevel+1);
		});
	} else {
		if (Object.prototype.toString.call(obj) === '[object Array]') {
			// Iterate over array
			for (var o of obj) {
				if (Object.prototype.toString.call(o) === '[object Object]') {
					// Recurse

					Object.entries(o).forEach(([key, value]) => {
						// Push key with value
						data[key] = renderTreeHeaders(value);
					});
				} else {
					// Do not need values
					continue;
				}
			}
		}
	}

	console.log("Final Data");
	console.log(data);

	return data;
}