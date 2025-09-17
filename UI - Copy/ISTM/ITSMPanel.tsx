
import React, { useEffect, useState } from "react";
import { capitalizeFirstLetter } from "../../Utilities/capitalise";
import {
  TextField,
  Tooltip,
  InputAdornment,
  Card,
  Typography,
} from "@mui/material";
import {
  Search,
  Person,
  Group,
  PersonOff,
} from "@mui/icons-material";

const ITSMPanel = ({ tickets, selectedTicket, setSelectedTicket }) => {
  const [active, setactive] = useState<number | null>(0);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [filteredTickets, setFilteredTickets] = useState(tickets);  

  useEffect(() => {
    // Filter logic
    const lower = searchTerm.toLowerCase();
    const filtered = tickets.filter((ticket) =>
      ticket.number?.toLowerCase().includes(lower) ||
      ticket.short_description?.toLowerCase().includes(lower) ||
      ticket.state?.toLowerCase().includes(lower) ||
      ticket.assigned_to?.toLowerCase().includes(lower)
    );
    setFilteredTickets(filtered);
  }, [searchTerm, tickets]);

  const handleClick = (ticket, index) => {
    setSelectedTicket(ticket);
    setactive(index);
  };

  const Items = filteredTickets.map((item) => {
    let newstate;
    if (item.state === "1") {
      newstate = "Open";
    } else if (item.state === "2") {
      newstate = "Work in Progress";
    } else if (item.state === "3") {
      newstate = "Close Complete";
    } else if (item.state === "4") {
      newstate = "Close Incomplete";
    } else if (item.state === "7") {
      newstate = "Closed Skipped";
    } else if (item.state === "-5") {
      newstate = "Pending";
    } else if (item.state === "0") {
      newstate = "0";
    } else {
      newstate = "";
    }

    return { ...item, state: newstate };
  });

  // console.log("Items",Items)
  return (
    <div className="bg-white rounded-t-lg shadow-lg text-dark-800 mr-2 overflow-hidden" >
      <div className="flex items-center justify-between px-3 py-3 bg-gradient-to-r from-neon-blue to-royal-500 text-white rounded-t-lg shadow-md">
        <div className="m-0 text-sm md:text-base lg:text-lg xl:text-xl font-bold">
          ITSM
        </div>
        <div className="mt-1 flex-1 max-w-xs mx-4">
          <TextField
            fullWidth
            size="small"
            className="bg-white rounded"
            variant="outlined"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}  
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search className="text-gray-500 w-4 h-4" />
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Person className="w-5 h-5 text-white hover:text-gray-200 cursor-pointer" />
          <Group className="w-5 h-5 text-white hover:text-gray-200 cursor-pointer" />
          <PersonOff className="w-5 h-5 text-white hover:text-gray-200 cursor-pointer" />
        </div>
      </div>
      {/* Ticket List */}
      <div>
        <div className="flex-grow overflow-y-auto mt-1 max-h-96 scrollbar-thin scrollbar-thumb-gray-300">
          {filteredTickets.length > 0 ? (
            filteredTickets.map((ticket, index) => (
              <Card
                key={ticket.sys_id || index}
                className={`cursor-pointer text-dark-800 mb-1 p-3 mx-2 rounded-lg border transition-all duration-300 hover:shadow-md ${
                  active === index 
                    ? "border-neon-blue bg-blue-50 shadow-lg" 
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
                onClick={() => handleClick(ticket, index)}
              >
                <div className="flex justify-between items-center mb-2">
                  <span>
                    <strong className="text-sm font-semibold text-gray-800">{ticket.number}</strong>
                  </span>
                  <span className="text-sm">
                    <strong className="font-semibold text-gray-700">State</strong> - <span className="text-gray-600">{ticket.state}</span>
                  </span>
                </div>
                <p className="mb-2 text-sm">
                  <span>
                    <strong className="font-semibold text-gray-700">Short Description:</strong>
                  </span>
                  <Tooltip
                    title={capitalizeFirstLetter(ticket.short_description)}
                    placement="top"
                    arrow
                    followCursor
                    PopperProps={{
                      className: "z-50",
                    }}
                  >
                    <span className="cursor-pointer text-gray-600 pl-1">
                      {ticket.short_description.substring(0, 60)}
                      {ticket.short_description.length > 40 ? "..." : ""}
                    </span>
                  </Tooltip>
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span>
                    <strong className="font-semibold text-gray-700">Priority</strong> - <span className="text-gray-600">{ticket.priority}</span>
                  </span>
                  <span>
                    <strong className="font-semibold text-gray-700">Assigned to</strong> - <span className="text-gray-600">{ticket.assigned_to}</span>
                  </span>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-gray-500 text-center py-8">No tickets found.</div>
          )}
        </div>
      </div>
    </div>

  );
};

export default ITSMPanel;
