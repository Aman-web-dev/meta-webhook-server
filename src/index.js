const express = require('express');
const app = express();
const port = 3000; 
const mongoose = require('mongoose');

const {createNewLead} =require('./dbs/AdLeads')

const {
  checkMapping , getLeadValue , saveLeadValue
} = require('./helpers/helpers')


app.use(express.json())

const mongoURI= "mongodb+srv://AiSensyDev:DqU8x0lhu6IFVoqI@aisensyprestaging.y9zfsek.mongodb.net/AiSensy?retryWrites=true&w=majority&readPreference=secondary"

mongoose.connect(mongoURI);

// Get the default connection
const db = mongoose.connection;

// Event listener for errors
db.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});

// Event listener for successful connection
db.once('open', () => {
    console.log('Connected to MongoDB successfully');
});



app.post('/handle-facebook-leads', async (req, res) => {
  try {
    const { payload } = req.body;

    // Validate if payload exists
    if (!payload || !payload.entry || !payload.entry[0] || !payload.entry[0].changes) {
      return res.status(400).json({ error: "Invalid payload structure" });
    }

    const { entry } = payload;
    const { changes } = entry[0];

    // Parallel processing using Promise.all
    await Promise.all(changes.map(async (change) => {
      try {
        const { field } = change;

        if (field !== "leadgen") {
          console.error("Field is not leadgen");
          return; // Skip this change
        }

        const { value } = change;
        const { ad_id, leadgen_id } = value;

        if (!ad_id || !leadgen_id) {
          console.error("Missing ad_id or leadgen_id in change:", change);
          return; // Skip to the next change
        }

        // Save the lead data
        const [error, newLeadCreated] = await createNewLead(value);
        if (error) {
          console.error("Error creating new lead:", error);
          return; // Log error and proceed to next change
        }

        if (newLeadCreated) {
          const leadValue = getLeadValue(leadgen_id);
          if (leadValue) {
            saveLeadValue(leadValue);
          }

          // Check if there's an associated campaign with the given ad_id
          const mappingExist = await checkMapping(ad_id);
          if (mappingExist) {
            try {
              console.log(`Campaign run for ad_id: ${ad_id}`);
            } catch (campaignError) {
              console.error(`Error running campaign for ad_id ${ad_id}:`, campaignError);
            }
          } else {
            console.log(`No campaign mapping exists for ad_id: ${ad_id}, lead saved.`);
          }
        }
      } catch (innerError) {
        console.error("Error processing change:", innerError);
      }
    }));

    res.status(200).json({ message: "Leads processed successfully" });
  } catch (err) {
    console.error("Error in handling Facebook leads:", err);
    res.status(500).json({ error: "An error occurred while processing leads" });
  }
});



app.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}`);
});