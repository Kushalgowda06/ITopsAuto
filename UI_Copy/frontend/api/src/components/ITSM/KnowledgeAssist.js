import React, { useState, useEffect } from "react";
import HeaderBar from "../utils/TitleHeader";
import serviceNowAxios from "../utils/serviceNowAxios";

const KnowledgeAssist = ({ content, loading, selectedTicket }) => {
  const [alerts, setAlerts] = useState([]);
  const [alertsLoading, setAlertsLoading] = useState(false);
  const [alertsError, setAlertsError] = useState(null);

  // Function to fetch alerts for the selected ticket
  const fetchAlerts = async (incidentNumber) => {
    if (!incidentNumber) return;

    setAlertsLoading(true);
    setAlertsError(null);
    
    try {
      // Step 1: Get sys_id using incident number
      const sysIdResponse = await serviceNowAxios.get(
        `/api/now/table/incident?sysparm_query=number=${incidentNumber}&sysparm_fields=sys_id`
      );

      if (sysIdResponse.data?.result && sysIdResponse.data.result.length > 0) {
        const sysId = sysIdResponse.data.result[0].sys_id;
        
        // Step 2: Get alerts using sys_id
        const alertsResponse = await serviceNowAxios.get(
          `/api/now/table/em_alert?sysparm_query=incident%3D${sysId}&sysparm_fields=number,short_description,state,severity,opened_at,source&sysparm_limit=3`
        );

        if (alertsResponse.data?.result) {
          setAlerts(alertsResponse.data.result);
        } else {
          setAlerts([]);
        }
      } else {
        setAlerts([]);
        setAlertsError("No sys_id found for this incident");
      }
    } catch (error) {
      console.error("Error fetching alerts:", error);
      setAlertsError("Failed to fetch alerts. Please try again.");
      setAlerts([]);
    } finally {
      setAlertsLoading(false);
    }
  };

  // Fetch alerts when selectedTicket changes
  useEffect(() => {
    if (selectedTicket && selectedTicket.number) {
      fetchAlerts(selectedTicket.number);
    }
  }, [selectedTicket]);

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
      case '1':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'high':
      case '2':
        return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'medium':
      case '3':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low':
      case '4':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getStateColor = (state) => {
    switch (state?.toLowerCase()) {
      case 'open':
      case 'new':
      case '1':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'in progress':
      case 'acknowledged':
      case '2':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'resolved':
      case 'closed':
      case '6':
      case '7':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Function to properly render knowledge content
  const renderKnowledgeContent = (content) => {
    // Handle string content
    if (typeof content === 'string') {
      return (
        <div className="text-gray-300 leading-relaxed text-base">
          <div className="whitespace-pre-wrap">{content}</div>
        </div>
      );
    }

    // Handle null or undefined content
    if (!content) {
      return (
        <div className="text-gray-400 text-center py-4">
          No knowledge assistance available for this ticket.
        </div>
      );
    }

    // Extract content from common API response structures
    let actualContent = null;
    
    // Try different possible content paths
    if (content.output && content.output.data) {
      if (typeof content.output.data === 'string') {
        actualContent = content.output.data;
      } else if (content.output.data.content) {
        actualContent = content.output.data.content;
      } else if (content.output.data.response) {
        actualContent = content.output.data.response;
      } else if (content.output.data.answer) {
        actualContent = content.output.data.answer;
      }
    } else if (content.data) {
      if (typeof content.data === 'string') {
        actualContent = content.data;
      } else if (content.data.content) {
        actualContent = content.data.content;
      }
    } else if (content.content) {
      actualContent = content.content;
    } else if (content.response) {
      actualContent = content.response;
    } else if (content.answer) {
      actualContent = content.answer;
    } else if (content.solution) {
      actualContent = content.solution;
    }

    // If we found actual content, display it properly formatted
    if (actualContent && typeof actualContent === 'string') {
      return (
        <div className="text-gray-300 leading-relaxed text-base">
          <div className="whitespace-pre-wrap bg-dark-800/30 p-4 rounded-lg border border-white/10">
            {actualContent}
          </div>
        </div>
      );
    }

    // If actualContent is an object, try to format it nicely
    if (actualContent && typeof actualContent === 'object') {
      return (
        <div className="space-y-3">
          {Object.entries(actualContent).map(([key, value]) => (
            <div key={key} className="bg-dark-800/30 p-4 rounded-lg border border-white/10">
              <div className="font-semibold text-white capitalize mb-2">
                {key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()}:
              </div>
              <div className="text-gray-300 leading-relaxed">
                {typeof value === 'string' ? (
                  <div className="whitespace-pre-wrap">{value}</div>
                ) : (
                  <pre className="whitespace-pre-wrap text-sm bg-dark-700/50 p-3 rounded border border-white/5 overflow-x-auto">
                    {JSON.stringify(value, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Fallback: display the entire content structure in a formatted way
    return (
      <div className="space-y-3">
        <div className="bg-dark-800/30 p-4 rounded-lg border border-white/10">
          <div className="font-semibold text-white mb-2">Raw API Response:</div>
          <div className="text-gray-300">
            {Object.entries(content).map(([key, value]) => (
              <div key={key} className="mb-3 last:mb-0">
                <div className="font-medium text-neon-blue text-sm mb-1">
                  {key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()}:
                </div>
                <div className="pl-3 border-l border-white/20">
                  {typeof value === 'string' ? (
                    <div className="whitespace-pre-wrap text-gray-300">{value}</div>
                  ) : typeof value === 'object' && value !== null ? (
                    <pre className="whitespace-pre-wrap text-xs bg-dark-700/50 p-2 rounded border border-white/5 overflow-x-auto">
                      {JSON.stringify(value, null, 2)}
                    </pre>
                  ) : (
                    <div className="text-gray-400">{String(value)}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-dark-900/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl text-white mr-2 overflow-hidden h-full flex flex-col" >
      <HeaderBar content="  Knowledge Assist" position="start" padding="px-3" />

      <div className="mt-1 rounded-b-lg p-6 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-700 hover:scrollbar-thumb-gray-300">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue"></div>
              <p className="text-gray-300 text-base">Loading knowledge assistance...</p>
            </div>
          </div>
        ) : content ? (
          <div>
            {selectedTicket && (
              <div className="mb-6 p-4 bg-dark-800/50 rounded-lg border border-white/20">
                <h3 className="font-semibold text-white mb-2">Ticket: {selectedTicket.number}</h3>
                <p className="text-gray-300 text-sm">{selectedTicket.short_description}</p>
              </div>
            )}

            {/* Alerts Section - Only show for incidents */}
            {selectedTicket && selectedTicket.type === 'incident' && (
              <div className="mb-6 p-4 bg-dark-800/30 rounded-lg border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <span className="mr-2">🚨</span>
                  Related Alerts
                </h3>
                
                {alertsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-orange"></div>
                      <p className="text-gray-300 text-sm">Loading alerts...</p>
                    </div>
                  </div>
                ) : alertsError ? (
                  <div className="text-center py-4">
                    <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <p className="text-red-400 text-sm">{alertsError}</p>
                  </div>
                ) : alerts && alerts.length > 0 ? (
                  <div className="space-y-3 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-700">
                    {alerts.map((alert, index) => (
                      <div key={alert.number || index} className="bg-dark-700/50 border border-white/10 rounded-lg p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-white text-sm">{alert.number || 'N/A'}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                                {alert.severity || 'Unknown'}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStateColor(alert.state)}`}>
                                {alert.state || 'Unknown'}
                              </span>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed mb-2">
                              {alert.short_description || 'No description available'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center space-x-1">
                            <span className="text-gray-400">Source:</span>
                            <span className="text-gray-300">{alert.source || 'N/A'}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-gray-400">Opened:</span>
                            <span className="text-gray-300">{formatDate(alert.opened_at)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="w-12 h-12 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {selectedTicket 
                        ? `No alerts found for ticket ${selectedTicket.number}`
                        : 'No alerts available'
                      }
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {content.error ? (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="text-red-400 font-medium">Error</span>
                </div>
                <p className="text-red-300 mt-2">{content.error}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="font-bold text-white mb-4 text-lg">📋 Knowledge Assistance</div>
                {renderKnowledgeContent(content)}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <svg className="w-16 h-16 mx-auto text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <div>
                <h3 className="text-white font-medium mb-2">Select a Ticket</h3>
                <p className="text-gray-400 text-sm">Choose a ticket from the ITSM panel to get relevant knowledge assistance</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeAssist; 