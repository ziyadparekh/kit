'use strict';

let root = typeof window === 'undefined' ? global : window;
let SV = {};

root.__SERVER_VARS__ = root.__SERVER_VARS__ || {};

if (root) {
  SV.attributes = root.__SERVER_VARS__.attributes || {};
} else {
  SV.attributes = {};
}

SV.get = function (key) {
  return SV.attributes[key] || root.__SERVER_VARS__[key];
};

SV.set = function (data) {
  SV.attributes = data;
};

export default SV;