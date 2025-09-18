import React, { useEffect, useState } from "react";
import serviceNowAxios from '../utils/serviceNowAxios';
import ITSMPanel from './ITSMPanel';
import KnowledgeAssist from './KnowledgeAssist';
import TechAssist from './TechAssist';
import ITSMDetailsPanel from './ITSMDetailsPanel';
import { Api } from '../utils/api';

const MainLayout = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [knowledgeAssistContent, setKnowledgeAssistContent] = useState(null);
  const [knowledgeAssistLoading, setKnowledgeAssistLoading] = useState(false);
  const [accumulatedWorkNotes, setAccumulatedWorkNotes] = useState("");
  const [currentFilter, setCurrentFilter] = useState("incident");

  const fetchIncidents = async () => {
    try {
      // Use ServiceNow axios instance to avoid authentication conflicts
      const response = await serviceNowAxios.get(`/api/now/table/incident?sysparm_query=stateNOT%20IN6%2C7%2C8%5Eassignment_group.name%3DDWP%20Operations%20Center%5Ecaller.name%3DEvent%20Management%5EORcaller.name%3D599350&sysparm_fields=sys_id,number,short_description,description,urgency,impact,state,priority,opened_at,caller_id,assignment_group.name,assigned_to.name`);
      
      const incidents = response?.data?.result || [];
      // Normalize incident data structure
      return incidents.map(incident => ({
        ...incident,
        assigned_to: incident.assigned_to?.name || incident.assigned_to?.value || incident.assigned_to || '',
        assignment_group: incident.assignment_group?.name || incident.assignment_group?.value || incident.assignment_group || '',
        priority: incident.priority?.value || incident.priority || '',
        state: incident.state?.value || incident.state || '',
        urgency: incident.urgency?.value || incident.urgency || '',
        impact: incident.impact?.value || incident.impact || '',
        caller_id: incident.caller_id?.value || incident.caller_id || '',
        type: 'incident'
      }));
    } catch (error) {
      console.error("Error fetching incidents: ", error);
      return [];
    }
  };

  const fetchProblemTasks = async () => {
    try {
      const response = await serviceNowAxios.get(`/api/now/table/problem_task?sysparm_query=stateNOT%20IN6%2C7&sysparm_fields=sys_id,number,caller_id,location,sys_created_by,opened_by,sys_created_on,state,hold_reason,cmdb_ci,priority,category,subcategory,assignment_group,assigned_to,short_description,description,comments_and_work_notes`);
      
      const problemTasks = response?.data?.result || [];
      // Normalize problem task data structure
      return problemTasks.map(task => ({
        ...task,
        assigned_to: task.assigned_to?.name || task.assigned_to?.value || task.assigned_to || '',
        assignment_group: task.assignment_group?.name || task.assignment_group?.value || task.assignment_group || '',
        priority: task.priority?.value || task.priority || '',
        state: task.state?.value || task.state || '',
        category: task.category?.value || task.category || '',
        subcategory: task.subcategory?.value || task.subcategory || '',
        caller_id: task.caller_id?.value || task.caller_id || '',
        location: task.location?.value || task.location || '',
        sys_created_by: task.sys_created_by?.value || task.sys_created_by || '',
        opened_by: task.opened_by?.value || task.opened_by || '',
        cmdb_ci: task.cmdb_ci?.value || task.cmdb_ci || '',
        hold_reason: task.hold_reason?.value || task.hold_reason || '',
        type: 'problem_task'
      }));
    } catch (error) {
      console.error("Error fetching problem tasks: ", error);
      return [];
    }
  };

  const loadTickets = async (filterType = "incident") => {
    let ticketData = [];
    
    if (filterType === "incident") {
      ticketData = await fetchIncidents();
    } else if (filterType === "problem_task") {
      ticketData = await fetchProblemTasks();
    }
    
    setTickets(ticketData);
    const firstTicket = ticketData[0];
    if (firstTicket) {
      setSelectedTicket(firstTicket);
      // Automatically fetch knowledge assist content for the first ticket
      if (firstTicket.short_description && firstTicket.description) {
        fetchKnowledgeAssistContent(firstTicket.short_description, firstTicket.description);
      }
    } else {
      setSelectedTicket(null);
      setKnowledgeAssistContent(null);
    }
  };

  const handleFilterChange = (filterType) => {
    setCurrentFilter(filterType);
    loadTickets(filterType);
  };

  const customData = async () => {
    await loadTickets("incident"); // Load incidents by default
  };

  useEffect(() => {
    customData()
  }, [])

  // Function to fetch contextual response from KB API
  const fetchKnowledgeAssistContent = async (shortDescription, description) => {
    if (!shortDescription || !description) return;

    setKnowledgeAssistLoading(true);
    try {
      const response = await Api.postCall(
        "http://172.31.6.97:6500/kb_management/api/v1/get_contextual_response/",
        { query: shortDescription + description }
      );

      if (response.data) {
        setKnowledgeAssistContent(response.data);
      }
    } catch (error) {
      console.error("Error fetching knowledge assist content:", error);
      setKnowledgeAssistContent({
        error: "Failed to fetch knowledge assist content. Please try again."
      });
    } finally {
      setKnowledgeAssistLoading(false);
    }
  };



  // Function to handle work notes updates from TechAssist API responses
  const handleWorkNotesUpdate = (newWorkNotes) => {
    if (newWorkNotes && typeof newWorkNotes === 'string') {
      setAccumulatedWorkNotes(prev => {
        const updated = prev ? `${prev}\n\n${newWorkNotes}` : newWorkNotes;
        console.log('Updated work notes:', updated);
        return updated;
      });
    }
  };

  // Helper function to check if Knowledge Assist has successful data
  const hasKnowledgeAssistSuccess = () => {
    return !knowledgeAssistLoading && 
           knowledgeAssistContent && 
           !knowledgeAssistContent.error;
  };

  // Handle ticket selection and fetch knowledge assist content
  const handleTicketSelection = (ticket) => {
    setSelectedTicket(ticket);
    // Reset work notes when ticket changes
    setAccumulatedWorkNotes("");
    // Clear previous knowledge assist content to ensure clean state
    setKnowledgeAssistContent(null);
    if (ticket && ticket.short_description) {
      fetchKnowledgeAssistContent(ticket.short_description, ticket.description);
    }
  };

  return (
    <div className="w-full p-4 min-h-screen bg-transparent">
      <div className="flex gap-6 h-[calc(100vh-140px)]" style={{ gap: '0rem' }}>

        {/* Left Column - 40% Width */}
        <div className="w-2/5 flex flex-col gap-6 text-white h-full">
          {/* ITSM Panel - 50% Height */}
          <div className="h-1/2 min-h-[400px]">
            <ITSMPanel
              tickets={tickets}
              selectedTicket={selectedTicket}
              setSelectedTicket={handleTicketSelection}
              onFilterChange={handleFilterChange}
              currentFilter={currentFilter} />
          </div>
          {/* ITSM Details Panel - 50% Height */}
          <div className="h-1/2 min-h-[400px]">
            <ITSMDetailsPanel 
              selectedTicket={selectedTicket} 
              accumulatedWorkNotes={accumulatedWorkNotes}
            />
          </div>
        </div>

        {/* Right Column - 60% Width */}
        <div className="w-3/5 flex flex-col gap-6 text-white h-full">
          {/* Knowledge Assist - 50% Height */}
          <div className="h-1/2 min-h-[400px]">
            <KnowledgeAssist 
              content={knowledgeAssistContent}
              loading={knowledgeAssistLoading}
              selectedTicket={selectedTicket}
            />
          </div>
          {/* Tech Assist - 50% Height */}
          <div className="h-1/2 min-h-[400px]">
            <TechAssist 
              selectedTicket={selectedTicket}
              knowledgeAssistContent={knowledgeAssistContent}
              knowledgeAssistSuccess={hasKnowledgeAssistSuccess()}
              knowledgeAssistLoading={knowledgeAssistLoading}
              onWorkNotesUpdate={handleWorkNotesUpdate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout; 