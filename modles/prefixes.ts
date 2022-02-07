import mongoose from 'mongoose';

const reqString = {
    type: String ,
    required: true
}

const prefixSchema = new mongoose.Schema({
    // For Guild ID
    _id: reqString ,
    prefix: reqString
})

export = mongoose.model('reliablecmds-prefixes' , prefixSchema);