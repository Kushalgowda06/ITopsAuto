import React, { useEffect, useState } from "react";
import { Api } from "../utils/api";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import serviceNowAxios from "../utils/serviceNowAxios";
import HeaderBar from "../utils/TitleHeader";
import { useAuth } from "../../contexts/AuthContext";

export default function ITSMAssist({ selectedTicket, accumulatedWorkNotes , currentFilter }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [isGeneratingConclusiveNotes, setIsGeneratingConclusiveNotes] = useState(false);
  const [conclusiveNotesGenerated, setConclusiveNotesGenerated] = useState(new Set());
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
   const { user, logout } = useAuth();

  const urgencyOptions = ["1 - High", "2 - Medium", "3 - Low"];
  const impactOptions = ["1 - High", "2 - Medium", "3 - Low"];

  const [assignmentGroups, setAssignmentGroups] = useState([]);
  const [assignTo, setAssignTo] = useState([]);
  const [state, setState] = useState([]);


  const mapStateNumberToLabel = (value) => {
    switch (value) {
      case 1:
        return "Open";
      case 2:
        return "Work in Progress";
      case 3:
        return "Close Complete";
      case 4:
        return "Close Incomplete";
      case 6:
        return "Resolved";
      case 7:
        return "Closed Skipped";
      case -5:
        return "Pending";
      default:
        return "";
    }
  };

  const mapStateLabelToNumber = (label) => {
    switch (label) {
      case "Open":
        return "1";
      case "Work in Progress":
        return "2";
      case "Close Complete":
        return "3";
      case "Close Incomplete":
        return "4";
      case "Closed Skipped":
        return "7";
      case "Pending":
        return "-5";
      case "Resolved":
        return "6";
      default:
        return "1"; // Default to "Open" instead of 0
    }
  };

  const mapUrgencyNumberToLabel = (num) =>
    urgencyOptions[parseInt(num) - 1] || "";
  const mapUrgencyLabelToNumber = (label) => label.split(" ")[0];

  const mapImpactNumberToLabel = (num) =>
    impactOptions[parseInt(num) - 1] || "";
  const mapImpactLabelToNumber = (label) => label.split(" ")[0];

  const mapPriorityLabelToNumber = (priority) => {
    // Priority is typically already a number in ServiceNow, or extract number from string
    if (typeof priority === 'string' && priority.includes(' ')) {
      return priority.split(" ")[0];
    }
    return priority || "";
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isDirty, errors },
    watch,
    setValue
  } = useForm({
    mode: "onChange",
    defaultValues: {
      number: selectedTicket?.number || "",
      openedBy: selectedTicket?.opened_at || "",
      state: selectedTicket?.state || "1", // Store as string
      priority: selectedTicket?.priority || "",
      assignTo: selectedTicket?.assignTo || "",
      urgency: mapUrgencyNumberToLabel(selectedTicket?.urgency) || "",
      assignmentGroup: selectedTicket?.assignment_group?.name || selectedTicket?.["assignment_group.name"] || "",
      impact: mapImpactNumberToLabel(selectedTicket?.impact) || "",
      short_description: selectedTicket?.short_description || "",
      description: selectedTicket?.description || "",
      comments_and_work_notes: accumulatedWorkNotes || selectedTicket?.comments_and_work_notes || "",
      comments: selectedTicket?.comments || "",
      resolution_notes: selectedTicket?.resolution_notes || "",
    },
  });

  useEffect(() => {
    if (selectedTicket) {
      reset({
        number: selectedTicket.number || "",
        openedBy: selectedTicket.opened_at || "",
        state: selectedTicket.state || "1",
        priority: selectedTicket.priority || "",
        assignTo: selectedTicket.assignTo || "",
        urgency: mapUrgencyNumberToLabel(selectedTicket.urgency) || "",
        assignmentGroup: selectedTicket.assignment_group?.name || selectedTicket["assignment_group.name"] || "",
        impact: mapImpactNumberToLabel(selectedTicket.impact) || "",
        short_description: selectedTicket.short_description || "",
        description: selectedTicket.description || "",
        comments_and_work_notes: accumulatedWorkNotes || selectedTicket.comments_and_work_notes || "",
        comments: selectedTicket.comments || "",
        resolution_notes: selectedTicket.resolution_notes || "",
      });
      
      // Reset conclusive notes generation tracking for new ticket
      setConclusiveNotesGenerated(new Set());
    }
  }, [selectedTicket, reset, accumulatedWorkNotes]);

  // Update the comments_and_work_notes field when accumulatedWorkNotes changes
  useEffect(() => {
    if (accumulatedWorkNotes) {
      setValue("comments_and_work_notes", accumulatedWorkNotes);
    }
  }, [accumulatedWorkNotes, setValue]);

  // Function to generate conclusive notes when state changes to "Resolved"
  const generateConclusiveNotes = async (shortDescription, description, workNotes) => {
    if (!shortDescription || !description) {
      return;
    }

    setIsGeneratingConclusiveNotes(true);
    try {
      const requestBody = {
        query: `Below is the description of the issue - 

${shortDescription}
${description}

Below are the work notes relevant to this issue - 

${workNotes || 'No work notes available'}

Prepare conclusive notes those include short summary of issue, cause and resolution steps taken.`
      };

      const response = await Api.postCall(
        "http://172.31.6.97:6500/llm/api/v1/ask_llm_in_isolation/",
        requestBody
      );

      if (response.data) {
        let conclusiveNotes = '';
        if (response.data.output && response.data.output.data) {
          conclusiveNotes = response.data.output.data;
        } else if (response.data.data) {
          conclusiveNotes = response.data.data;
        } else if (response.data.response) {
          conclusiveNotes = response.data.response;
        } else if (typeof response.data === 'string') {
          conclusiveNotes = response.data;
        } else {
          conclusiveNotes = 'Conclusive notes generated successfully.';
        }

        // Update the resolution_notes field with the conclusive notes
        setValue("resolution_notes", conclusiveNotes);
      }
    } catch (error) {
      console.error("Error generating conclusive notes:", error);
      // Optionally show an error message to the user
      setSubmitMessage("Failed to generate conclusive notes. Please try again.");
      setMessageType("error");
      setShowSnackbar(true);
      setTimeout(() => setShowSnackbar(false), 5000);
    } finally {
      setIsGeneratingConclusiveNotes(false);
    }
  };

  // Watch for state changes and trigger conclusive notes generation
  const currentState = watch("state");
  useEffect(() => {
    if (currentState && mapStateNumberToLabel(parseInt(currentState)) === "Resolved" && selectedTicket) {
      // Create a unique key for this ticket and state combination
      const ticketStateKey = `${selectedTicket.number || selectedTicket.sys_id}_resolved`;
      
      // Only generate if not already generated for this ticket
      if (!conclusiveNotesGenerated.has(ticketStateKey) && !isGeneratingConclusiveNotes) {
        const shortDescription = watch("short_description") || selectedTicket.short_description;
        const description = watch("description") || selectedTicket.description;
        const workNotes = watch("comments_and_work_notes");
        
        if (shortDescription && description) {
          // Mark ticket as processed
          setConclusiveNotesGenerated(prev => new Set([...prev, ticketStateKey]));
          generateConclusiveNotes(shortDescription, description, workNotes);
        }
      }
    }
  }, [currentState, selectedTicket]); // Removed isGeneratingConclusiveNotes from dependencies

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [groups, assigns, states] = await Promise.all([
          serviceNowAxios.get(
            `/api/now/table/sys_user_group?sysparm_fields=name`
          ),
          serviceNowAxios.get(
            `/api/now/table/sys_user?sysparm_fields=user_name`
          ),
          serviceNowAxios.get(
            `/api/now/table/incident?sysparm_query=stateNOT IN6,7,8^assignment_groupSTARTSWITHDWP Operations Center^ORassignment_groupSTARTSWITHZenossGroup&sysparm_fields=number,short_description,state,priority,opened_at,caller_id,assignment_group.name`
          ),
        ]);
        setAssignmentGroups(groups?.data?.result);
        setAssignTo(assigns?.data?.result);
        setState(states?.data?.result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);





  const onSubmit = async (data) => {
    if (!isDirty) {
      setSubmitMessage("No changes detected.");
      setMessageType("info");
      setShowSnackbar(true);
      return;
    }

    if (!selectedTicket?.sys_id) {
      setSubmitMessage("Error: Ticket ID not found. Please refresh and try again.");
      setMessageType("error");
      setShowSnackbar(true);
      return;
    }

    // Create the payload structure as requested
    const payload = {
      comments: data.comments || "",
      work_notes: data.comments_and_work_notes || "",
      assigned_to: data.assignTo || "",
      assignment_group: data.assignmentGroup || "",
      priority: mapPriorityLabelToNumber(data.priority),
      urgency: mapUrgencyLabelToNumber(data.urgency),
      impact: mapImpactLabelToNumber(data.impact),
      close_notes: data.resolution_notes || "",
      state: data.state, // Use string state value directly
      close_code: data.state === "6" ? "Solved (Permanently)" : "" // Compare with string "6" for "Resolved"
    };

    try {
      setIsSubmitting(true);
      const apiUrl = currentFilter === 'incident' ? `/api/now/table/incident/${selectedTicket?.sys_id}` : `/api/now/table/problem_task/${selectedTicket?.sys_id}`
      const res = await serviceNowAxios.patch(
        `${apiUrl}`,
        payload
      );
      if (res.status === 200) {
        setShowSuccessPopup(true);
        
        // Auto-hide popup after 3 seconds
        setTimeout(() => {
          setShowSuccessPopup(false);
        }, 3000);
        
        reset({
          ...data,
          urgency: mapUrgencyNumberToLabel(
            mapUrgencyLabelToNumber(data.urgency)
          ),
          impact: mapImpactNumberToLabel(mapImpactLabelToNumber(data.impact)),
          state: data.state, // Keep state as string
        });
      } else {
        throw new Error("Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
      setSubmitMessage("Failed to update ticket.");
      setMessageType("error");
      setShowSnackbar(true);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setShowSnackbar(false);
        setSubmitMessage("");
        setMessageType("");
      }, 4000);
    }
  };

  // Custom Select Component
  const CustomSelect = ({ options, value, onChange, placeholder, error, disabled = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          className={`w-full px-3 py-2 text-left bg-dark-800/50 border rounded-lg focus:ring-2 focus:ring-neon-blue focus:border-neon-blue outline-none ${
            disabled ? 'bg-dark-800/30 cursor-not-allowed' : 'cursor-pointer hover:border-white/40'
          } ${error ? 'border-red-500' : 'border-white/20'}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <span className={value ? 'text-white' : 'text-gray-400'}>
            {value || placeholder}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>
        
        {isOpen && !disabled && (
          <div className="absolute z-10 w-full mt-1 bg-dark-800/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg max-h-60 overflow-auto">
            {options.map((option, index) => (
              <button
                key={index}
                type="button"
                className="w-full px-3 py-2 text-left text-white hover:bg-dark-700/50 focus:bg-dark-700/50 focus:outline-none"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
              >
                {typeof option === 'string' ? option : option.name || option.user_name}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Searchable Select Component
  const SearchableSelect = ({ options, value, onChange, placeholder, error, disabled = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOptions, setFilteredOptions] = useState(options);
    
    useEffect(() => {
      if (searchTerm) {
        const filtered = options.filter(option => {
          const optionText = typeof option === 'string' ? option : (option.name || option.user_name || '');
          return optionText.toLowerCase().includes(searchTerm.toLowerCase());
        });
        setFilteredOptions(filtered);
      } else {
        setFilteredOptions(options);
      }
    }, [searchTerm, options]);

    const handleInputChange = (e) => {
      setSearchTerm(e.target.value);
      if (!isOpen) setIsOpen(true);
    };

    const handleOptionSelect = (option) => {
      const optionValue = typeof option === 'string' ? option : (option.name || option.user_name);
      setSearchTerm(optionValue);
      onChange(option);
      setIsOpen(false);
    };

    const handleFocus = () => {
      setIsOpen(true);
      // Set search term to current value for editing
      if (value) {
        setSearchTerm(value);
      }
    };

    const handleBlur = () => {
      // Delay closing to allow for option selection
      setTimeout(() => {
        setIsOpen(false);
        // Reset search term to current value if no selection was made
        if (value && !searchTerm) {
          setSearchTerm(value);
        } else if (!value) {
          setSearchTerm('');
        }
      }, 200);
    };

    return (
      <div className="relative">
        <input
          type="text"
          disabled={disabled}
          value={isOpen ? searchTerm : (value || '')}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`w-full px-3 py-2 bg-dark-800/50 border rounded-lg focus:ring-2 focus:ring-neon-blue focus:border-neon-blue outline-none text-white placeholder-gray-400 ${
            disabled ? 'bg-dark-800/30 cursor-not-allowed' : 'hover:border-white/40'
          } ${error ? 'border-red-500' : 'border-white/20'}`}
        />
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
        
        {isOpen && !disabled && filteredOptions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-dark-800/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg max-h-60 overflow-auto">
            {filteredOptions.map((option, index) => {
              const optionText = typeof option === 'string' ? option : (option.name || option.user_name);
              return (
                <button
                  key={index}
                  type="button"
                  className="w-full px-3 py-2 text-left text-white hover:bg-dark-700/50 focus:bg-dark-700/50 focus:outline-none"
                  onMouseDown={(e) => e.preventDefault()} // Prevent blur when clicking
                  onClick={() => handleOptionSelect(option)}
                >
                  {optionText}
                </button>
              );
            })}
          </div>
        )}
        
        {isOpen && !disabled && searchTerm && filteredOptions.length === 0 && (
          <div className="absolute z-10 w-full mt-1 bg-dark-800/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg">
            <div className="px-3 py-2 text-gray-400 text-sm">
              No matches found
            </div>
          </div>
        )}
      </div>
    );
  };

  // Custom Snackbar Component
  const Snackbar = ({ show, message, type, onClose }) => {
    if (!show) return null;

    const bgColor = type === 'success' ? 'bg-green-500' : type === 'info' ? 'bg-blue-500' : 'bg-red-500';

    return (
      <div className="fixed top-4 right-4 z-50">
        <div className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3`}>
          <span>{message}</span>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 focus:outline-none"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  if (!selectedTicket) {
    return (
      <div className="bg-dark-900/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl p-6 text-center text-gray-400">
        Please select a ticket.
      </div>
    );
  }

  return (
    <>
      <Snackbar 
        show={showSnackbar}
        message={submitMessage}
        type={messageType}
        onClose={() => setShowSnackbar(false)}
      />

      <div className="text-sm mr-2 bg-dark-900/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl text-white overflow-hidden h-full flex flex-col">
        <HeaderBar content=" Ticket Details" position="start" padding="px-3" />

        <div className="mt-1 p-6 leading-relaxed flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-700 hover:scrollbar-thumb-gray-300">
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="col-span-1">
                <p className="text-sm text-white">
                  <span className="font-semibold">Number:</span>{" "}
                  <span className="font-normal">{selectedTicket?.number}</span>
                </p>
              </div>
              <div className="col-span-1">
                <p className="text-sm text-white">
                  <span className="font-semibold">Opened by:</span>{" "}
                  <span className="font-normal">{selectedTicket?.openedBy}</span>
                </p>
              </div>
              
              <div className="col-span-1 md:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-white mb-1">State</label>
                    <Controller
                      name="state"
                      control={control}
                      render={({ field }) => (
                        <CustomSelect
                          options={[
                            "Open",
                            "Work in Progress",
                            "Pending",
                            "Resolved",
                          ]}
                          value={mapStateNumberToLabel(parseInt(field.value))}
                          onChange={(value) => {
                            const stateNumber = mapStateLabelToNumber(value);
                            field.onChange(stateNumber.toString()); // Store as string
                          }}
                          placeholder="Select state"
                          error={!!errors.state}
                        />
                      )}
                    />
                  </div>

                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-white mb-1">Priority</label>
                    <input
                      type="text"
                      disabled
                      className="w-full px-3 py-2 bg-dark-800/50 border border-white/20 rounded-lg cursor-not-allowed text-gray-400"
                      {...register("priority", {
                        required: "priority is required",
                      })}
                    />
                    {errors.priority && (
                      <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
                    )}
                  </div>

                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-white mb-1">Assigned to</label>
                    <Controller
                      name="assignTo"
                      control={control}
                      // rules={{ required: "Assigned To is required" }}
                      render={({ field }) => (
                        <SearchableSelect
                          options={assignTo}
                          value={selectedTicket?.assigned_to?.name || selectedTicket?.assignTo || field.value|| ""}
                          onChange={(option) => field.onChange(typeof option === 'string' ? option : option.user_name)}
                          placeholder="Type to search or select assignee"
                          error={!!errors.assignTo}
                        />
                      )}
                    />
                    {errors.assignTo && (
                      <p className="mt-1 text-sm text-red-600">{errors.assignTo.message}</p>
                    )}
                  </div>

                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-white mb-1">Urgency</label>
                    <Controller
                      name="urgency"
                      control={control}
                      rules={{ required: "Urgency is required" }}
                      render={({ field }) => (
                        <CustomSelect
                          options={urgencyOptions}
                          value={field.value}
                          onChange={(option) => field.onChange(option)}
                          placeholder="Select urgency"
                          error={!!errors.urgency}
                        />
                      )}
                    />
                    {errors.urgency && (
                      <p className="mt-1 text-sm text-red-600">{errors.urgency.message}</p>
                    )}
                  </div>

                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-white mb-1">Assignment Group</label>
                    <Controller
                      name="assignmentGroup"
                      control={control}
                      rules={{ required: "Assignment Group is required" }}
                      render={({ field }) => (
                        <CustomSelect
                          options={assignmentGroups}
                          value={assignmentGroups.find(item => item.name === field.value)?.name || field.value}
                          onChange={(option) => field.onChange(typeof option === 'string' ? option : option.name)}
                          placeholder="Select assignment group"
                          error={!!errors.assignmentGroup}
                        />
                      )}
                    />
                    {errors.assignmentGroup && (
                      <p className="mt-1 text-sm text-red-600">{errors.assignmentGroup.message}</p>
                    )}
                  </div>

                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-white mb-1">Impact</label>
                    <Controller
                      name="impact"
                      control={control}
                      rules={{ required: "Impact is required" }}
                      render={({ field }) => (
                        <CustomSelect
                          options={impactOptions}
                          value={field.value}
                          onChange={(option) => field.onChange(option)}
                          placeholder="Select impact"
                          error={!!errors.impact}
                        />
                      )}
                    />
                    {errors.impact && (
                      <p className="mt-1 text-sm text-red-600">{errors.impact.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-white mb-2">Short Description</label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 bg-dark-800/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-neon-blue focus:border-neon-blue outline-none text-white placeholder-gray-400"
                {...register("short_description", {
                  required: "Short Description is required",
                })}
              />
              {errors.short_description && (
                <p className="mt-1 text-sm text-red-600">{errors.short_description.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-white mb-2">Description</label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 bg-dark-800/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-neon-blue focus:border-neon-blue outline-none text-white placeholder-gray-400"
                {...register("description", {
                  required: "Description is required",
                })}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-white mb-2">
                Comments / Work Notes
                {accumulatedWorkNotes && (
                  <span className="ml-2 text-xs text-neon-green">
                    ● Auto-updated from Tech Assist
                  </span>
                )}

              </label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 bg-dark-800/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-neon-blue focus:border-neon-blue outline-none text-white placeholder-gray-400"
                {...register("comments_and_work_notes")}
                placeholder="Work notes will be automatically populated from Tech Assist responses..."
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-white mb-2">
                Resolution Notes
                {isGeneratingConclusiveNotes && (
                  <span className="ml-2 text-xs text-neon-blue flex items-center">
                    <div className="animate-spin rounded-full h-3 w-3 border-b border-neon-blue mr-1"></div>
                    Generating resolution notes...
                  </span>
                )}
              </label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 bg-dark-800/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-neon-blue focus:border-neon-blue outline-none text-white placeholder-gray-400"
                {...register("resolution_notes")}
                placeholder="Resolution notes will be automatically generated when ticket state is changed to 'Resolved'..."
                readOnly
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-white mb-2">Additional Comment</label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 bg-dark-800/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-neon-blue focus:border-neon-blue outline-none text-white placeholder-gray-400"
                {...register("comments")}
              />
            </div>



            <div className="mt-4 text-center">
              <button
                type="submit"
                className="bg-gradient-to-r from-neon-blue to-royal-500 hover:from-neon-blue/90 hover:to-royal-500/90 text-white px-6 py-2 rounded-lg shadow-sm transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                // disabled={isSubmitting || !isDirty}
                disabled={user?.name == "Demouser" || isSubmitting || !isDirty}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin inline-block w-4 h-4 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Updating...
                  </div>
                ) : (
                  "Update Ticket"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
              onClick={() => setShowSuccessPopup(false)}
            />

            {/* Modal panel */}
            <div className="relative inline-block align-middle bg-dark-900/95 backdrop-blur-xl border border-white/20 rounded-lg text-left overflow-hidden shadow-2xl transform transition-all max-w-sm w-full mx-4">
              {/* Success Icon */}
              <div className="text-center pt-6 pb-4">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-500/20 border border-green-500/30">
                  <svg className="h-8 w-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 pb-6 text-center">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Success!
                </h3>
                <p className="text-white mb-6">
                  Ticket has been updated successfully.
                </p>
                
                {/* Ticket Number Display */}
                {selectedTicket?.number && (
                  <div className="mb-6 p-3 bg-dark-800/50 border border-white/10 rounded-lg">
                    <p className="text-sm text-gray-400">Ticket Number</p>
                    <p className="text-white font-mono font-medium">{selectedTicket.number}</p>
                  </div>
                )}

                {/* Close Button */}
                <button
                  onClick={() => setShowSuccessPopup(false)}
                  className="w-full bg-gradient-to-r from-neon-green to-emerald-600 hover:from-neon-green/90 hover:to-emerald-600/90 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 hover:shadow-lg"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 