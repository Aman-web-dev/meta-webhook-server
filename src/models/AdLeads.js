const mongoose = require("mongoose");

// Create the schema
const LeadSchema = new mongoose.Schema({
  leadgen_id: {
    type: String,
    required: true,
  },
  adgroup_id: {
    type: String,
    required: true,
  },
  page_id: {
    type: String,
    required: true,
  },
  clientId: {
    type: String,
    required: false,
  },
  adAccountId: {
    type: String,
    required: false,
  },
  assistantId: {
    type: String,
    required: false,
  },
  leadCampaignId: {
    type: String,
    required: false,
  },
  ad_id: {
    type: String,
    required: true,
  },
  form_id: {
    type: String,
    required: true,
  },
  created_time: {
    type: Date,
    required: true,
    default: Date.now,
  },
  field_data: [
    {
      name: {
        type: String,
        required: true,
      },
      values: [String],
    },
  ],
});

// Create the model
const Lead = mongoose.model("Lead", LeadSchema);

module.exports = Lead;
