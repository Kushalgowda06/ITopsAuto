import React, { useEffect, useState } from "react";
import { Api } from "../../Utilities/api";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Typography,
  Snackbar,
  Alert,
  Autocomplete,
} from "@mui/material";
import axios from "axios";
import HeaderBar from "../../Utilities/TitleHeader";

export default function ITSMAssist({ selectedTicket }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const urgencyOptions = ["1 - High", "2 - Medium", "3 - Low"];
  const impactOptions = ["1 - High", "2 - Medium", "3 - Low"];

  const [assignmentGroups, setAssignmentGroups] = useState([]);
  const [assignTo, setAssignTo] = useState([]);
  const [state, setState] = useState([]);

  // const mapUrgencyNumberToLabel = (value: number): string => {
  //   switch (value) {
  //     case 1:
  //       return '1 - High';
  //     case 2:
  //       return '2 - Medium';
  //     case 3:
  //       return '3 - Low';
  //     default:
  //       return '';
  //   }
  // };

  // const mapUrgencyLabelToNumber = (label: string): number => {
  //   switch (label) {
  //     case '1 - High':
  //       return 1;
  //     case '2 - Medium':
  //       return 2;
  //     case '3 - Low':
  //     default:
  //       return 0;
  //   }
  // };
  const mapStateNumberToLabel = (value: number): string => {
    switch (value) {
      case 1:
        return "Open";
      case 2:
        return "Work in Progress";
      case 3:
        return "Close Complete";
      case 4:
        return "Close Incomplete";
      case 7:
        return "Closed Skipped";
      case -5:
        return "Pending";
      default:
        return "";
    }
  };

  const mapStateLabelToNumber = (label: string): number => {
    switch (label) {
      case "Open":
        return 1;
      case "Work in Progress":
        return 2;
      case "Close Complete":
        return 3;
      case "Close Incomplete":
        return 4;
      case "Closed Skipped":
        return 7;
      case "Pending":
        return -5;
      default:
        return 0;
    }
  };

  const mapUrgencyNumberToLabel = (num) =>
    urgencyOptions[parseInt(num) - 1] || "";
  const mapUrgencyLabelToNumber = (label) => label.split(" ")[0];

  const mapImpactNumberToLabel = (num) =>
    impactOptions[parseInt(num) - 1] || "";
  const mapImpactLabelToNumber = (label) => label.split(" ")[0];

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isDirty, errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      number: selectedTicket?.number || "",
      openedBy: selectedTicket?.openedBy || "",
      state: mapStateNumberToLabel(selectedTicket?.state || ""),
      priority: selectedTicket?.priority || "",
      assignTo: selectedTicket?.assignTo || "",
      urgency: mapUrgencyNumberToLabel(selectedTicket?.urgency),
      assignmentGroup: selectedTicket?.assignmentGroup || "",
      impact: mapImpactNumberToLabel(selectedTicket?.impact),
      short_description: selectedTicket?.short_description || "",
      description: selectedTicket?.description || "",
      comments_and_work_notes: selectedTicket?.comments_and_work_notes,
      comments: selectedTicket?.comments,
    },
  });

  useEffect(() => {
    if (selectedTicket) {
      reset({
        ...selectedTicket,
        urgency: mapUrgencyNumberToLabel(selectedTicket.urgency),
        impact: mapImpactNumberToLabel(selectedTicket.impact),
        // state: mapStateNumberToLabel(selectedTicket.state),
      });
    }
  }, [selectedTicket, reset]);

  useEffect(() => {
    const fetchData = async () => {
      const options = {
        auth: {
          username: "ServicenowAPI",
          password: "Qwerty@123",
        },
      };
      try {
        const [groups, assigns, states] = await Promise.all([
          Api.getCallOptions(
            `https://cisicmpengineering1.service-now.com/api/now/table/sys_user_group?sysparm_fields=name`,
            options
          ),
          Api.getCallOptions(
            `https://cisicmpengineering1.service-now.com/api/now/table/sys_user?sysparm_fields=user_name`,
            options
          ),
          Api.getCallOptions(
            `https://cisicmpengineering1.service-now.com/api/now/table/incident?sysparm_fields=%2Cstate&sysparm_limit=50`,
            options
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
      return;
    }

    const options = {
      auth: {
        username: "ServicenowAPI",
        password: "Qwerty@123",
      },
    };

    const dataToSend = {
      ...data,
      urgency: mapUrgencyLabelToNumber(data.urgency),
      impact: mapImpactLabelToNumber(data.impact),
      state: mapStateLabelToNumber(data.state),
    };

    try {
      setIsSubmitting(true);
      const res = await axios.patch(
        `https://cisicmpengineering1.service-now.com/api/now/table/incident/${selectedTicket?.sys_id}`,
        dataToSend,
        options
      );
      if (res.status === 200) {
        setSubmitMessage("Ticket updated successfully!");
        setMessageType("success");
        reset({
          ...data,
          urgency: mapUrgencyNumberToLabel(
            mapUrgencyLabelToNumber(data.urgency)
          ),
          impact: mapImpactNumberToLabel(mapImpactLabelToNumber(data.impact)),
          state: mapStateNumberToLabel(mapStateLabelToNumber(data.state)),
        });
      } else {
        throw new Error("Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
      setSubmitMessage("Failed to update ticket.");
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setSubmitMessage("");
        setMessageType("");
      }, 4000);
    }
  };

  if (!selectedTicket) {
    return <Typography className="p-3">Please select a ticket.</Typography>;
  }
  return (
    <>
      <Snackbar
        open={!!submitMessage}
        autoHideDuration={4000}
        onClose={() => {
          setSubmitMessage("");
          setMessageType("");
        }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => {
            setSubmitMessage("");
            setMessageType("");
          }}
          severity={
            messageType === "success"
              ? "success"
              : messageType === "info"
              ? "info"
              : "error"
          }
          variant="filled"
          sx={{ width: "100%" }}
        >
          {submitMessage}
        </Alert>
      </Snackbar>

      <div className="text-sm mr-2 bg-white rounded-lg shadow-lg text-dark-800 overflow-hidden">
        <HeaderBar content=" ITSM Assist" position="start" padding="px-3" />
        {/* <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-neon-orange to-royal-900 text-white rounded-t-lg shadow-md" >
          <div className="m-0 text-sm md:text-base lg:text-lg xl:text-xl font-bold">
            ITSM Assist
          </div>
        </div> */}

        <div className="mt-1 p-4 bg-white leading-normal">
          <p className="mb-4 text-gray-700">Employee 360 portal is not working as expected </p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="col-span-1">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Number:</span>{" "}
                  <span className="font-normal">{selectedTicket?.number}</span>
                </p>
              </div>
              <div className="col-span-1">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Opened by:</span>{" "}
                  <span className="font-normal">{selectedTicket?.openedBy}</span>
                </p>
              </div>
              
              <div className="col-span-1 md:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="col-span-1">
                    <Controller
                      name="state"
                      control={control}
                      render={({ field }) => (
                        <Autocomplete
                          options={[
                            "Open",
                            "Work in Progress",
                            "Close Complete",
                            "Close Incomplete",
                            "Closed Skipped",
                            "Pending",
                          ]}
                          value={mapStateNumberToLabel(Number(field.value))}
                          onChange={(event, newValue) => {
                            field.onChange(mapStateLabelToNumber(newValue));
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="State"
                              variant="outlined"
                              fullWidth
                              size="small"
                            />
                          )}
                        />
                      )}
                    />
                  </div>

                  <div className="col-span-1">
                    <TextField
                      id="priority"
                      label="priority"
                      variant="outlined"
                      disabled
                      fullWidth
                      size="small"
                      {...register("priority", {
                        required: "priority is required",
                      })}
                      error={!!errors.priority}
                    />
                  </div>

                  <div className="col-span-1">
                    <Controller
                      name="assignTo"
                      control={control}
                      rules={{ required: "Assigned To is required" }}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          value={
                            assignTo.find(
                              (item) => item.user_name === field.value
                            ) || null
                          }
                          options={assignTo}
                          getOptionLabel={(option) => option.user_name}
                          isOptionEqualToValue={(option, value) => {
                            if (typeof value === "object" && value !== null) {
                              return option.user_name === value.user_name;
                            }
                            return option.user_name === value;
                          }}
                          onChange={(_, value) =>
                            field.onChange(value ? value.user_name : "")
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Assigned to"
                              variant="outlined"
                              error={!!errors.assignTo}
                              helperText={errors.assignTo?.message as string}
                              fullWidth
                              size="small"
                            />
                          )}
                        />
                      )}
                    />
                  </div>

                  <div className="col-span-1">
                    <Controller
                      name="urgency"
                      control={control}
                      rules={{ required: "Urgency is required" }}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          value={field.value || null}
                          options={urgencyOptions}
                          getOptionLabel={(option) => option}
                          isOptionEqualToValue={(option, value) =>
                            option === value
                          }
                          onChange={(_, value) => field.onChange(value)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Urgency"
                              variant="outlined"
                              error={!!errors.urgency}
                              helperText={errors.urgency?.message as string}
                              fullWidth
                              size="small"
                            />
                          )}
                        />
                      )}
                    />
                  </div>

                  <div className="col-span-1">
                    <Controller
                      name="assignmentGroup"
                      control={control}
                      rules={{ required: "Assignment Group is required" }}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          value={
                            assignmentGroups.find(
                              (item) => item.name === field.value
                            ) || null
                          }
                          options={assignmentGroups}
                          getOptionLabel={(option) => option.name}
                          isOptionEqualToValue={(option, value) => {
                            if (typeof value === "object" && value !== null) {
                              return option.name === value.name;
                            }
                            return option.name === value;
                          }}
                          onChange={(_, value) =>
                            field.onChange(value ? value.name : "")
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Assignment Group"
                              variant="outlined"
                              error={!!errors.assignmentGroup}
                              helperText={
                                errors.assignmentGroup?.message as string
                              }
                              fullWidth
                              size="small"
                            />
                          )}
                        />
                      )}
                    />
                  </div>

                  <div className="col-span-1">
                    <Controller
                      name="impact"
                      control={control}
                      rules={{ required: "Impact is required" }}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          value={field.value || null}
                          options={impactOptions}
                          getOptionLabel={(option) => option}
                          isOptionEqualToValue={(option, value) =>
                            option === value
                          }
                          onChange={(_, value) => field.onChange(value)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Impact"
                              variant="outlined"
                              error={!!errors.impact}
                              helperText={errors.impact?.message as string}
                              fullWidth
                              size="small"
                            />
                          )}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <TextField
                id="short_description"
                label="Short Description"
                rows={2}
                multiline
                variant="outlined"
                fullWidth
                size="small"
                {...register("short_description", {
                  required: "Short Description is required",
                })}
                error={!!errors.short_description}
              />
            </div>
            <div className="mb-3">
              <TextField
                id="description"
                label="Description"
                variant="outlined"
                rows={3}
                multiline
                fullWidth
                size="small"
                {...register("description", {
                  required: "Description is required",
                })}
                error={!!errors.description}
              />
            </div>

            <div className="mb-4">
              <TextField
                id="comments_and_work_notes"
                label="Comments / Work Notes"
                variant="outlined"
                fullWidth
                multiline
                rows={2}
                size="small"
                {...register("comments_and_work_notes")}
              />
            </div>
            <div className="mb-4">
              <TextField
                id="comments"
                label="Additional Comment"
                variant="outlined"
                fullWidth
                multiline
                rows={2}
                size="small"
                {...register("comments")}
              />
            </div>

            <div className="mt-4 text-center">
              <button
                type="submit"
                className="bg-gradient-to-r from-neon-blue to-royal-500 hover:from-neon-blue/90 hover:to-royal-500/90 text-white px-6 py-2 rounded-lg shadow-sm transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting || !isDirty}
              >
                {isSubmitting ? (
                  <>
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
                  </>
                ) : (
                  "Update Ticket"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
