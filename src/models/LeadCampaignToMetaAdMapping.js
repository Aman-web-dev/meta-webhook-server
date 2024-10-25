const mongoose = require('mongoose');

// Create the mapping schema
const CampaignAdMappingSchema = new mongoose.Schema({
  campaignId: {
    type: String,
    required: true,
  },
  adId: {
    type: String,
    required: true,
  },
  clientId: {
    type: String,
    required: true,
  },
  adAccountId: {
    type: String,
    required: true,
  },
  assistantId: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the model
const CampaignAdMapping = mongoose.model('CampaignAdMapping', CampaignAdMappingSchema);

module.exports = CampaignAdMapping;
