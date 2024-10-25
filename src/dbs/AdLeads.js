const Lead = require("../models/AdLeads");



const createNewLead = async (queryObj) => {
  try {
    const { leadgen_id } = queryObj;

    console.log('Leadgen ID:', leadgen_id); // Add logging

    // Check if the Lead already exists
    const leadAlreadyExist = await Lead.findOne({ leadgen_id: leadgen_id }).lean();

    if (leadAlreadyExist) {
      console.log('Lead already exists:', leadAlreadyExist); // Add logging
      return [null, null]; // Lead exists, return null
    }

    // Create new Lead if it doesn't exist
    const newLead = new Lead(queryObj);
    const savedLead = await newLead.save();
    console.log('New lead saved:', savedLead); // Add logging
    return [null, savedLead];
  } catch (error) {
    console.error('Error in createNewLead:', error); // Add logging for the error
    return [error, null];
  }
};





// 2. Update Lead
const updateLead = async (queryObj, updateObj) => {
  try {
    const updatedLead = await Lead.findOneAndUpdate(queryObj, updateObj, {
      new: true, // returns the updated document
    });

    if (!updatedLead) {
      return { message: "Lead not found" };
    }
    return { message: "Lead updated successfully", data: updatedLead };
  } catch (error) {
    console.error("Error updating Lead:", error);
    throw error;
  }
};



// 3. Delete Lead
const deleteLead = async (queryObj) => {
  try {
    const deletedLead = await Lead.findOneAndDelete(queryObj);
    if (!deletedLead) {
      return { message: "Lead not found" };
    }
    return { message: "Lead deleted successfully", data: deletedLead };
  } catch (error) {
    console.error("Error deleting Lead:", error);
    throw error;
  }
};



// 4. Archive Lead (set `archived` field to `true`)
const archiveLead = async (queryObj) => {
  try {
    const archivedLead = await Lead.findOneAndUpdate(
      queryObj,
      { archived: true },
      { new: true }
    );

    if (!archivedLead) {
      return { message: "Lead not found" };
    }
    return { message: "Lead archived successfully", data: archivedLead };
  } catch (error) {
    console.error("Error archiving Lead:", error);
    throw error;
  }
};




// 5. Get a Single Lead
const getLead = async (queryObj) => {
  try {
    const lead = await Lead.findOne(queryObj).lean();
    if (!lead) {
      return { message: "Lead not found" };
    }
    return { message: "Lead found", data: lead };
  } catch (error) {
    console.error("Error fetching Lead:", error);
    throw error;
  }
};




// 6. Get All Leads
const getLeads = async (queryObj = {}) => {
  try {
    const leads = await Lead.find(queryObj).lean();
    if (!leads.length) {
      return { message: "No leads found" };
    }
    return { message: "Leads found", data: leads };
  } catch (error) {
    console.error("Error fetching Leads:", error);
    throw error;
  }
};

// Export the functions
module.exports = {
  createNewLead,
  updateLead,
  deleteLead,
  archiveLead,
  getLead,
  getLeads,
};
