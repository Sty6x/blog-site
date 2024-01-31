"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkExistingData = void 0;
async function checkExistingData(queryObject, exists, not) {
    queryObject ? exists(queryObject) : not();
}
exports.checkExistingData = checkExistingData;
