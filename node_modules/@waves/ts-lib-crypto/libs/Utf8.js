"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.strToUtf8Array = exports.utf8ArrayToStr = void 0;
var Utf8ArrayToStr = (function () {
    var charCache = new Array(128); // Preallocate the cache for the common single byte chars
    var charFromCodePt = String.fromCodePoint || String.fromCharCode;
    var result = [];
    return function (array) {
        var codePt, byte1;
        var buffLen = array.length;
        result.length = 0;
        for (var i = 0; i < buffLen;) {
            byte1 = array[i++];
            if (byte1 <= 0x7F) {
                codePt = byte1;
            }
            else if (byte1 <= 0xDF) {
                codePt = ((byte1 & 0x1F) << 6) | (array[i++] & 0x3F);
            }
            else if (byte1 <= 0xEF) {
                codePt = ((byte1 & 0x0F) << 12) | ((array[i++] & 0x3F) << 6) | (array[i++] & 0x3F);
            }
            else { // @ts-ignore
                if (String.fromCodePoint) {
                    codePt = ((byte1 & 0x07) << 18) | ((array[i++] & 0x3F) << 12) | ((array[i++] & 0x3F) << 6) | (array[i++] & 0x3F);
                }
                else {
                    codePt = 63; // Cannot convertLongFields four byte code points, so use "?" instead
                    i += 3;
                }
            }
            result.push(charCache[codePt] || (charCache[codePt] = charFromCodePt(codePt)));
        }
        return result.join('');
    };
});
exports.utf8ArrayToStr = Utf8ArrayToStr();
function strToUtf8Array(str) {
    var utf8 = [];
    for (var i = 0; i < str.length; i++) {
        var charcode = str.charCodeAt(i);
        if (charcode < 0x80)
            utf8.push(charcode);
        else if (charcode < 0x800) {
            utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
            utf8.push(0xe0 | (charcode >> 12), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
        }
        // surrogate pair
        else {
            i++;
            // UTF-16 encodes 0x10000-0x10FFFF by
            // subtracting 0x10000 and splitting the
            // 20 bits of 0x0-0xFFFFF into two halves
            charcode = 0x10000 + (((charcode & 0x3ff) << 10)
                | (str.charCodeAt(i) & 0x3ff));
            utf8.push(0xf0 | (charcode >> 18), 0x80 | ((charcode >> 12) & 0x3f), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
        }
    }
    return Uint8Array.from(utf8);
}
exports.strToUtf8Array = strToUtf8Array;
//# sourceMappingURL=Utf8.js.map