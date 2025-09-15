import React from "react";
import { Typography, Box } from "@mui/material";
import HeaderBar from "../../Utilities/TitleHeader";

const KnowledgeAssist = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg text-dark-800 overflow-hidden">
      <HeaderBar content="  Knowledge Assist" position="start" padding="px-3" />
      {/* <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-neon-purple to-royal-600 text-white rounded-t-lg shadow-md">
        <div className="m-0 text-sm md:text-base lg:text-lg xl:text-xl font-bold">
          Knowledge Assist
        </div>
      </div> */}

      <div className="mt-1 rounded-b-lg p-3 bg-white">
        <div className="font-bold text-gray-800 mb-3"> #### Step 1: Log in to CrowdStrike Console</div>
        <div className="text-gray-700 mb-4 leading-relaxed">
          1. Open your web browser. <br />
          2. Navigate to the{" "}
          <a
            href="https://falcon.crowdstrike.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neon-blue hover:text-blue-700 underline"
          >
            CrowdStrike Falcon console
          </a>
          .<br />
          3. Enter your username and password.
          <br />
          4. Click on the <span className="font-semibold text-gray-800">Login</span> button.
        </div>
        
        <div className="font-bold text-gray-800 mb-3">
          ####Step 2: Navigate to the Indicators Section
        </div>
        <div className="text-gray-700 mb-4 leading-relaxed">
          1. Once logged in, find the left-hand navigation menu.
          <br />
          2. Click on <span className="font-semibold text-gray-800">Investigate</span>.<br />
          3. From the dropdown, select <span className="font-semibold text-gray-800">Indicators</span>.
        </div>
        
        <div className="font-bold text-gray-800 mb-3">####Step 3: Add a New Indicator</div>
        <div className="text-gray-700 leading-relaxed">
          1. In the Indicators section, click on <span className="font-semibold text-gray-800">Add New Indicator</span>.
        </div>
      </div>
    </div>
  );
};

export default KnowledgeAssist;
