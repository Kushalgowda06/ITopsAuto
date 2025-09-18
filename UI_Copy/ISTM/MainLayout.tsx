import React, { useEffect, useState } from "react";
import ITSMPanel from '../ISTM/ITSMPanel';
import KnowledgeAssist from '../ISTM/KnowledgeAssist';
import TechAssist from '../ISTM/TechAssist';
import ITSMDetailsPanel from './ITSMDetailsPanel';
import { Api } from "../../Utilities/api";

const MainLayout = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const customData = () => {
    const username = "ServicenowAPI";
    const password = "Qwerty@123";
    const options = {
      auth: {
        username: username,
        password: password,
      },
    };

    try {
      // Api.getCallOptions(`https://cisicmpengineering1.service-now.com/api/now/table/incident?sysparm_fields=number%2Cstate%2Csys_created_on%2Csys_created_by%2Ccmdb_ci%2Cshort_description%2Cdescription&sysparm_limit=10`, options).then((response: any) => {
      Api.getCallOptions(`https://cisicmpengineering1.service-now.com/api/now/table/incident?sysparm_fields=number%2Copened_by%2Cstate%2Cpriority%2CassignedTo%2Cassigned_to%2Curgency%2CassignmentGroup%2Cassignment_group%2Cimpact%2Cshort_description%2Cdescription%2Ccomments_and_work_notes%2Ccomments&sysparm_limit=10`, options).then((response: any) => {
        //  Api.getCallOptions(`https://cisicmpengineering1.service-now.com/api/now/table/incident?sysparm_fields=number%2Copened_by%2Cstate%2Cpriority%2CassignedTo%2Cassigned_to%2Curgency%2CassignmentGroup%2Cassignment_group%2Cimpact%2Cshort_description%2Cdescription%2Ccomments_and_work_notes%2Ccomments&sysparm_query=numberININC0030687`, options).then((response: any) => {
        setTickets(response?.data?.result);
        setSelectedTicket(response?.data?.result[0]);
      });
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  useEffect(() => {
    customData()
  }, [])

  // const Items = tickets.map((item) => {
  //   let newstate;
  //   if (item.state === "1") {
  //     newstate = "Open";
  //   } else if (item.state === "2") {
  //     newstate = "Work in Progress";
  //   } else if (item.state === "3") {
  //     newstate = "Close Complete";
  //   } else if (item.state === "4") {
  //     newstate = "Close Incomplete";
  //   } else if (item.state === "7") {
  //     newstate = "Closed Skipped";
  //   } else if (item.state === "-5") {
  //     newstate = "Pending";
  //   } else if (item.state === "0") {
  //     newstate = "0";
  //   } else {
  //     newstate = "";
  //   }

  //   return { ...item, state: newstate };
  // });

  console.log("Items", tickets)



  return (
    <div className="w-full p-0 pr-2 bg-white mt-1 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-4">

        {/* Left Column */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4 text-white">
          <div className="">
            <ITSMPanel
              tickets={tickets}
              selectedTicket={selectedTicket}
              setSelectedTicket={setSelectedTicket} /></div>
          <div className=""><ITSMDetailsPanel selectedTicket={selectedTicket} /></div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-2/3 flex flex-col gap-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm">  <KnowledgeAssist /></div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm"><TechAssist /></div>
        </div>
      </div>
    </div>

  );
};

export default MainLayout;
