const BaseModel = require('./BaseModel');

class FeeSetting extends BaseModel {
    constructor() {
        super('fee_settings');
    }
}

module.exports = new FeeSetting();
