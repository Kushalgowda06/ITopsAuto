import React, { useEffect, useState } from "react";
import { capitalizeFirstLetter } from "../utils/capitalise";
import { 
  MagnifyingGlassIcon, 
  UserIcon, 
  UserGroupIcon, 
  UserMinusIcon 
} from '@heroicons/react/24/outline';

const ITSMPanel = ({ tickets, selectedTicket, setSelectedTicket, onFilterChange, currentFilter }) => {
  const [active, setactive] = useState(0);
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

  const handleFilterChange = (filterType) => {
    setactive(0); // Reset active selection when filter changes
    if (onFilterChange) {
      onFilterChange(filterType);
    }
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

  return (
    <div className="bg-dark-900/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl text-white mr-2 overflow-hidden h-full flex flex-col" >
      <div className="flex items-center justify-between px-3 py-3 bg-gradient-to-r from-neon-blue to-royal-500 text-white rounded-t-lg shadow-md" style={{ padding: '0.4rem'}}>
        <div className="m-0 text-sm md:text-base lg:text-lg xl:text-xl font-bold">
          Tickets
        </div>
        <div className="mt-1 flex-1 max-w-xs mx-4"  >
          <div className="relative">
            <input
              type="text"
              className="w-full px-3 py-2 pl-10 text-sm text-white bg-dark-800/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-neon-blue focus:border-neon-blue outline-none placeholder-gray-400"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <UserIcon className="w-5 h-5 text-white hover:text-gray-200 cursor-pointer transition-colors" />
          <UserGroupIcon className="w-5 h-5 text-white hover:text-gray-200 cursor-pointer transition-colors" />
          <UserMinusIcon className="w-5 h-5 text-white hover:text-gray-200 cursor-pointer transition-colors" />
        </div>
      </div>
      
      {/* Filter Menu */}
      <div className="px-3 py-2 bg-dark-800/80 border-b border-white/10">
        <div className="flex space-x-1">
          <button
            onClick={() => handleFilterChange("incident")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
              currentFilter === "incident"
                ? "bg-neon-blue text-white shadow-md"
                : "bg-dark-700/50 text-white hover:bg-dark-700 hover:text-white"
            }`}
          >
            Incident
          </button>
          <button
            onClick={() => handleFilterChange("problem_task")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
              currentFilter === "problem_task"
                ? "bg-neon-blue text-white shadow-md"
                : "bg-dark-700/50 text-white hover:bg-dark-700 hover:text-white"
            }`}
          >
            P-Tasks
          </button>
        </div>
      </div>
      
      {/* Ticket List */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        <div className="flex-1 overflow-y-auto mt-2 p-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-700 hover:scrollbar-thumb-gray-300">
          {filteredTickets.length > 0 ? (
            filteredTickets.map((ticket, index) => (
              <div
                key={ticket.sys_id || index}
                className={`cursor-pointer mb-3 p-4 mx-1 rounded-lg border transition-all duration-300 hover:shadow-md ${
                  active === index 
                    ? "border-neon-blue bg-neon-blue/10 shadow-lg text-white" 
                    : "border-white/20 bg-dark-800/50 hover:bg-dark-800/70 text-white"
                }`}
                onClick={() => handleClick(ticket, index)}
              >
                <div className="flex justify-between items-center mb-2">
                  <span>
                    <strong className="text-sm font-semibold text-white">{ticket.number}</strong>
                  </span>
                  <span className="text-sm">
                    <strong className="font-semibold text-white">State</strong> - <span className="text-gray-400">{ticket.state}</span>
                  </span>
                </div>
                <p className="mb-2 text-sm">
                  <span>
                    <strong className="font-semibold text-white">Short Description:</strong>
                  </span>
                  <span 
                    className="cursor-pointer text-gray-400 pl-1 hover:text-gray-200 transition-colors"
                    title={capitalizeFirstLetter(ticket.short_description)}
                  >
                    {ticket.short_description.substring(0, 60)}
                    {ticket.short_description.length > 40 ? "..." : ""}
                  </span>
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span>
                    <strong className="font-semibold text-white">Priority</strong> - <span className="text-gray-400">{ticket.priority}</span>
                  </span>
                  <span>
                    <strong className="font-semibold text-white">Assigned to</strong> - <span className="text-gray-400">{ticket.assigned_to}</span>
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-400 text-center py-8">No tickets found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ITSMPanel; 