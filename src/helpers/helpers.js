const {
  createNewCampaignAdMapping,
  updateMapping,
  deleteMapping,
  archiveMapping,
  getMapping,
  getMappings,
} = require("../dbs/LeadCampaignToMetaAdMapping");

const axios = require("axios")

const {
  createNewLead,
  updateLead,
  deleteLead,
  archiveLead,
  getLead,
  getLeads,
} = require("../dbs/AdLeads");

const CampaignAdMapping = require("../models/leadCampaignToMetaAdMapping");

const checkMapping = async (leadObj) => {
  const { adId } = leadObj;
  const mappingExist = await CampaignAdMapping.findOne({ adId: adId }).lean();

  if (mappingExist) {
    return true;
  } else {
    return false;
  }
};



const getLeadValue = async (leadId, accessToken) => {
  try {
    // Make a GET request to Facebook API to fetch lead data
    const response = await axios.get(
      `https://graph.facebook.com/v21.0/${leadId}`,
      {
        params: {
          access_token: accessToken,
        },
      }
    );

    const leadData = response.data;

    if (!leadData) {
      console.log("No data found for the lead ID:", leadId);
      return null;
    }

    // Return the lead data to be saved later
    return leadData;
  } catch (error) {
    console.error("Error fetching lead value from Facebook:", error);
    throw error;
  }
};

const saveLeadValue = async (leadData) => {
  try {
    // Extract field data from the fetched leadData
    const { field_data, id: leadgen_id } = leadData;

    if (!field_data) {
      console.log("No field data found in lead data");
      return { message: "No field data to update" };
    }

    // Prepare the query object for updating the lead in DB
    const queryObj = { leadgen_id };

    // Update the lead in the database using updateLead function
    const updateResponse = await updateLead(queryObj, { field_data });

    console.log(updateResponse.message);

    return updateResponse;
  } catch (error) {
    console.error("Error saving lead value to the database:", error);
    throw error;
  }
};

module.exports ={ checkMapping , getLeadValue , saveLeadValue };
