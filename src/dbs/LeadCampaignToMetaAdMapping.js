const CampaignAdMapping = require("../models/leadCampaignToMetaAdMapping");

// 1. Create New Campaign Ad Mapping
const createNewCampaignAdMapping = async (queryObj) => {
  try {
    // Check if the mapping already exists
    const mappingAlreadyExist = await CampaignAdMapping.findOne(queryObj).lean();

    if (mappingAlreadyExist) {
      return { message: 'Mapping already exists' };
    }

    // Create new mapping if it doesn't exist
    const newMapping = new CampaignAdMapping(queryObj);
    const savedMapping = await newMapping.save();
    return { message: 'Mapping created successfully', data: savedMapping };
  } catch (error) {
    console.error('Error creating campaign ad mapping:', error);
    throw error;
  }
};

// 2. Update Mapping
const updateMapping = async (queryObj, updateObj) => {
  try {
    const updatedMapping = await CampaignAdMapping.findOneAndUpdate(queryObj, updateObj, {
      new: true, // returns the updated document
    });
    if (!updatedMapping) {
      return { message: 'Mapping not found' };
    }
    return { message: 'Mapping updated successfully', data: updatedMapping };
  } catch (error) {
    console.error('Error updating mapping:', error);
    throw error;
  }
};

// 3. Delete Mapping
const deleteMapping = async (queryObj) => {
  try {
    const deletedMapping = await CampaignAdMapping.findOneAndDelete(queryObj);
    if (!deletedMapping) {
      return { message: 'Mapping not found' };
    }
    return { message: 'Mapping deleted successfully', data: deletedMapping };
  } catch (error) {
    console.error('Error deleting mapping:', error);
    throw error;
  }
};

// 4. Archive Mapping (set `archived` field to `true`)
const archiveMapping = async (queryObj) => {
  try {
    const archivedMapping = await CampaignAdMapping.findOneAndUpdate(
      queryObj,
      { archived: true },
      { new: true }
    );
    if (!archivedMapping) {
      return { message: 'Mapping not found' };
    }
    return { message: 'Mapping archived successfully', data: archivedMapping };
  } catch (error) {
    console.error('Error archiving mapping:', error);
    throw error;
  }
};

// 5. Get a Single Mapping
const getMapping = async (queryObj) => {
  try {
    const mapping = await CampaignAdMapping.findOne(queryObj).lean();
    if (!mapping) {
      return { message: 'Mapping not found' };
    }
    return { message: 'Mapping found', data: mapping };
  } catch (error) {
    console.error('Error fetching mapping:', error);
    throw error;
  }
};

// 6. Get All Mappings
const getMappings = async (queryObj = {}) => {
  try {
    const mappings = await CampaignAdMapping.find(queryObj).lean();
    if (!mappings.length) {
      return { message: 'No mappings found' };
    }
    return { message: 'Mappings found', data: mappings };
  } catch (error) {
    console.error('Error fetching mappings:', error);
    throw error;
  }
};

// Export the functions
module.exports = {
  createNewCampaignAdMapping,
  updateMapping,
  deleteMapping,
  archiveMapping,
  getMapping,
  getMappings,
};
