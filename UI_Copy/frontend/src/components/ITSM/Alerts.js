import React from 'react';
import HeaderBar from '../utils/TitleHeader';

const Alerts = ({ alerts, loading, selectedTicket, error }) => {
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

  return (
    <div className="bg-dark-900/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl text-white overflow-hidden h-full flex flex-col">
      <HeaderBar content="🚨 Alerts" position="start" padding="px-3" />
      
      <div className="mt-1 p-6 flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-orange"></div>
              <p className="text-white text-base">Loading alerts...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Failed to Load Alerts</h3>
                <p className="text-gray-400 text-sm">{error}</p>
              </div>
            </div>
          </div>
        ) : alerts && alerts.length > 0 ? (
          <div className="space-y-4">
            {selectedTicket && (
              <div className="mb-6 p-4 bg-dark-800/50 rounded-lg border border-white/20">
                <h3 className="font-semibold text-white mb-2">Alerts for Ticket: {selectedTicket.number}</h3>
                <p className="text-white text-sm">{selectedTicket.short_description}</p>
              </div>
            )}
            
            {alerts.map((alert, index) => (
              <div key={alert.number || index} className="bg-dark-800/50 border border-white/20 rounded-lg p-4 hover:bg-dark-800/70 transition-colors duration-300">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-semibold text-white">{alert.number || 'N/A'}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                        {alert.severity || 'Unknown'}
                      </span>
                    </div>
                    <p className="text-white text-sm leading-relaxed mb-3">
                      {alert.short_description || 'No description available'}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">State:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStateColor(alert.state)}`}>
                      {alert.state || 'Unknown'}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">Source:</span>
                    <span className="text-white">{alert.source || 'N/A'}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 md:col-span-2">
                    <span className="text-gray-400">Opened:</span>
                    <span className="text-white">{formatDate(alert.opened_at)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">No Alerts Found</h3>
                <p className="text-gray-400 text-sm">
                  {selectedTicket 
                    ? `No alerts associated with ticket ${selectedTicket.number}`
                    : 'Select a ticket to view associated alerts'
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts; 