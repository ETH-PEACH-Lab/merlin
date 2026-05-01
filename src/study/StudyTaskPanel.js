import React, { useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

import { STUDY_TASKS, SURVEY_URL } from "./studyConfig";
import { getCodeStats, getStudyMeta, submitStudyPayload } from "./studyStore";

export function StudyTaskPanel({ unparsedCode, pages, onTask1Start }) {
  const meta = useMemo(() => getStudyMeta(), []);

  const [taskIndex, setTaskIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [taskResults, setTaskResults] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const taskStartRef = useRef(null);
  const timerRef = useRef(null);

  const currentTask = STUDY_TASKS[taskIndex];
  const isLastTask = taskIndex === STUDY_TASKS.length - 1;
  const stats = getCodeStats(unparsedCode, pages);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");

    return `${minutes}:${seconds}`;
  };

  const startTask = () => {
    if (taskIndex === 0) {
      onTask1Start?.();
    }

    taskStartRef.current = Date.now();
    setElapsedMs(0);
    setRunning(true);

    timerRef.current = setInterval(() => {
      setElapsedMs(Date.now() - taskStartRef.current);
    }, 500);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setRunning(false);
  };

  const finishCurrentTask = () => {
    const durationMs = taskStartRef.current
      ? Date.now() - taskStartRef.current
      : elapsedMs;

    stopTimer();

    const result = {
      taskId: currentTask.id,
      taskTitle: currentTask.title,
      taskIndex: taskIndex + 1,
      finishedAt: new Date().toISOString(),
      durationMs,
      durationSeconds: Math.round(durationMs / 1000),
      finalCode: unparsedCode,
      ...getCodeStats(unparsedCode, pages),
    };

    setTaskResults((previous) => [...previous, result]);
    setElapsedMs(0);
    taskStartRef.current = null;

    return result;
  };

  const finishAndGoNext = () => {
    finishCurrentTask();
    setTaskIndex((previous) => previous + 1);
  };

  const submitStudy = async () => {
    setSubmitError(null);
    setIsSubmitting(true);

    const finalTaskResult = finishCurrentTask();
    const allTaskResults = [...taskResults, finalTaskResult];

    const payload = {
      ...meta,
      submittedAt: new Date().toISOString(),
      tasks: allTaskResults,
    };

    try {
      await submitStudyPayload(payload);
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      setSubmitError(
        "Could not submit online. A JSON backup file was downloaded instead.",
      );
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openSurvey = () => {
    const surveyUrl = new URL(SURVEY_URL);

    surveyUrl.searchParams.set("participant", meta.participantId);
    surveyUrl.searchParams.set("study", meta.studyId);
    surveyUrl.searchParams.set("session", meta.sessionId);

    window.location.href = surveyUrl.toString();
  };

  const progress = submitted
    ? 100
    : ((taskIndex + 1) / STUDY_TASKS.length) * 100;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 88,
        right: 14,
        width: 280,
        zIndex: 9999,
        borderRadius: "14px",
        overflow: "hidden",
        backgroundColor: "#ffffff",
        border: "1px solid rgba(0,0,0,0.1)",
        boxShadow: "0 12px 34px rgba(0,0,0,0.24)",
      }}
    >
      <Box
        sx={{
          px: 1.5,
          py: 1,
          background:
            "linear-gradient(135deg, rgba(156,39,176,1), rgba(103,58,183,1))",
          color: "white",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 800,
                lineHeight: 1.2,
              }}
            >
              NN-LIVE Study
            </Typography>

            <Typography
              variant="caption"
              sx={{
                display: "block",
                opacity: 0.85,
                maxWidth: 180,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {meta.participantId}
            </Typography>
          </Box>

          {!submitted && (
            <Chip
              size="small"
              label={`${taskIndex + 1}/${STUDY_TASKS.length}`}
              sx={{
                height: 22,
                color: "white",
                fontWeight: 800,
                backgroundColor: "rgba(255,255,255,0.22)",
              }}
            />
          )}
        </Stack>
      </Box>

      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 4,
          backgroundColor: "rgba(156,39,176,0.12)",
          "& .MuiLinearProgress-bar": {
            backgroundColor: "#9c27b0",
          },
        }}
      />

      <Box sx={{ p: 1.5 }}>
        {!submitted ? (
          <>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              spacing={1}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 900,
                    lineHeight: 1.15,
                    color: "#1f1f1f",
                  }}
                >
                  {currentTask?.title}
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    mt: 0.5,
                    color: "#555",
                    lineHeight: 1.35,
                  }}
                >
                  {currentTask?.description}
                </Typography>
              </Box>

              <Chip
                size="small"
                label={running ? "Live" : "Ready"}
                sx={{
                  height: 22,
                  flexShrink: 0,
                  fontWeight: 800,
                  color: running ? "#2e7d32" : "#666",
                  backgroundColor: running ? "#eaf6ec" : "#f2f2f2",
                }}
              />
            </Stack>

            <Box
              sx={{
                mt: 1.25,
                mb: 1,
                p: 1,
                borderRadius: "12px",
                backgroundColor: "#fafafa",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <Typography
                sx={{
                  fontSize: 29,
                  fontWeight: 900,
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                  color: "#222",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {formatTime(elapsedMs)}
              </Typography>

              <Stack
                direction="row"
                spacing={0.5}
                sx={{
                  mt: 0.75,
                  flexWrap: "wrap",
                  gap: 0.5,
                }}
              >
                <Chip
                  size="small"
                  label={`${stats.lineCount} lines`}
                  sx={{
                    height: 22,
                    fontWeight: 700,
                    fontSize: 11,
                  }}
                />

                <Chip
                  size="small"
                  label={`${stats.pageCount} pages`}
                  sx={{
                    height: 22,
                    fontWeight: 700,
                    fontSize: 11,
                  }}
                />
              </Stack>
            </Box>

            <Stack direction="row" spacing={0.75}>
              <Button
                fullWidth
                size="small"
                variant="contained"
                onClick={startTask}
                disabled={running || isSubmitting}
                sx={{
                  minHeight: 34,
                  textTransform: "none",
                  fontWeight: 900,
                  borderRadius: "10px",
                  backgroundColor: "#9c27b0",
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: "#7b1fa2",
                    boxShadow: "none",
                  },
                }}
              >
                Start
              </Button>

              {!isLastTask ? (
                <Button
                  fullWidth
                  size="small"
                  variant="outlined"
                  onClick={finishAndGoNext}
                  disabled={!running || isSubmitting}
                  sx={{
                    minHeight: 34,
                    textTransform: "none",
                    fontWeight: 900,
                    borderRadius: "10px",
                    borderColor: "#9c27b0",
                    color: "#9c27b0",
                    "&:hover": {
                      borderColor: "#7b1fa2",
                      backgroundColor: "rgba(156,39,176,0.06)",
                    },
                  }}
                >
                  Finish
                </Button>
              ) : (
                <Button
                  fullWidth
                  size="small"
                  variant="contained"
                  onClick={submitStudy}
                  disabled={!running || isSubmitting}
                  sx={{
                    minHeight: 34,
                    textTransform: "none",
                    fontWeight: 900,
                    borderRadius: "10px",
                    backgroundColor: "#2e7d32",
                    boxShadow: "none",
                    "&:hover": {
                      backgroundColor: "#1b5e20",
                      boxShadow: "none",
                    },
                  }}
                >
                  {isSubmitting ? "Saving..." : "Submit"}
                </Button>
              )}
            </Stack>
          </>
        ) : (
          <>
            {submitError && (
              <Alert
                severity="warning"
                sx={{
                  mb: 1,
                  fontSize: 12,
                  "& .MuiAlert-message": {
                    py: 0.25,
                  },
                }}
              >
                {submitError}
              </Alert>
            )}

            <Box sx={{ textAlign: "center" }}>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  mx: "auto",
                  mb: 1,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(156,39,176,0.1)",
                  color: "#9c27b0",
                  fontSize: 24,
                  fontWeight: 900,
                }}
              >
                ✓
              </Box>

              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 900,
                  color: "#1f1f1f",
                  mb: 0.25,
                }}
              >
                Study submitted
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  color: "#555",
                  lineHeight: 1.35,
                  mb: 1.25,
                }}
              >
                Thank you. Please complete the short survey.
              </Typography>

              <Button
                variant="contained"
                fullWidth
                size="small"
                onClick={openSurvey}
                sx={{
                  minHeight: 36,
                  textTransform: "none",
                  fontWeight: 900,
                  borderRadius: "11px",
                  background: "linear-gradient(135deg, #9c27b0, #673ab7)",
                  boxShadow: "0 8px 18px rgba(156,39,176,0.28)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #8e24aa, #5e35b1)",
                    boxShadow: "0 10px 22px rgba(156,39,176,0.34)",
                  },
                }}
              >
                Go to Survey
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
