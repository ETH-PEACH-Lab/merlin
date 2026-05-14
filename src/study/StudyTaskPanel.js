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

import { STUDY_TASKS } from "./studyConfig";
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
    const SURVEY_URL = `https://docs.google.com/forms/d/e/1FAIpQLScSm0UJXN686vLg72b9o7ggB0qHJNwSxMMeCHzotAzLbOaHzQ/viewform?usp=pp_url&entry.1365092958=${meta.participantId}`;
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
        top: 5,
        right: 5,
        width: 220,
        height: submitted ? 235 : 185,
        transition: "height 180ms ease",
        zIndex: 9999,
        borderRadius: "10px",
        overflow: "hidden",
        backgroundColor: "#ffffff",
        border: "1px solid rgba(0,0,0,0.1)",
        boxShadow: "0 8px 22px rgba(0,0,0,0.2)",
      }}
    >
      <Box
        sx={{
          px: 1,
          py: 0.55,
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
              variant="caption"
              sx={{
                fontWeight: 800,
                lineHeight: 1,
                fontSize: 11,
              }}
            >
              NN-LIVE Study
            </Typography>

            <Typography
              sx={{
                display: "block",
                opacity: 0.85,
                maxWidth: 140,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontSize: 9,
                lineHeight: 1,
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
                height: 17,
                fontSize: 9,
                color: "white",
                fontWeight: 800,
                backgroundColor: "rgba(255,255,255,0.22)",
                "& .MuiChip-label": {
                  px: 0.75,
                },
              }}
            />
          )}
        </Stack>
      </Box>

      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 3,
          backgroundColor: "rgba(156,39,176,0.12)",
          "& .MuiLinearProgress-bar": {
            backgroundColor: "#9c27b0",
          },
        }}
      />

      <Box sx={{ p: 0.85 }}>
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
                  sx={{
                    fontWeight: 900,
                    lineHeight: 1.05,
                    color: "#1f1f1f",
                    fontSize: 12,
                  }}
                >
                  {currentTask?.title}
                </Typography>

                <Typography
                  sx={{
                    display: "block",
                    mt: 0.25,
                    color: "#555",
                    lineHeight: 1.15,
                    fontSize: 9.5,
                  }}
                >
                  {currentTask?.description}
                </Typography>
              </Box>

              <Chip
                size="small"
                label={running ? "Live" : "Ready"}
                sx={{
                  height: 17,
                  flexShrink: 0,
                  fontWeight: 800,
                  fontSize: 9,
                  color: running ? "#2e7d32" : "#666",
                  backgroundColor: running ? "#eaf6ec" : "#f2f2f2",
                  "& .MuiChip-label": {
                    px: 0.75,
                  },
                }}
              />
            </Stack>

            <Box
              sx={{
                mt: 0.65,
                mb: 0.65,
                p: 0.6,
                borderRadius: "8px",
                backgroundColor: "#fafafa",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <Typography
                sx={{
                  fontSize: 21,
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
                spacing={0.4}
                sx={{
                  mt: 0.45,
                  flexWrap: "wrap",
                  gap: 0.4,
                }}
              >
                <Chip
                  size="small"
                  label={`${stats.lineCount} lines`}
                  sx={{
                    height: 17,
                    fontWeight: 700,
                    fontSize: 9,
                    "& .MuiChip-label": {
                      px: 0.75,
                    },
                  }}
                />

                <Chip
                  size="small"
                  label={`${stats.pageCount} pages`}
                  sx={{
                    height: 17,
                    fontWeight: 700,
                    fontSize: 9,
                    "& .MuiChip-label": {
                      px: 0.75,
                    },
                  }}
                />
              </Stack>
            </Box>
            <Stack direction="row" spacing={0.5}>
              <Button
                fullWidth
                size="small"
                variant="contained"
                onClick={startTask}
                disabled={running || isSubmitting}
                sx={{
                  minHeight: 26,
                  py: 0,
                  textTransform: "none",
                  fontWeight: 900,
                  fontSize: 11,
                  borderRadius: "7px",
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
                    minHeight: 26,
                    py: 0,
                    textTransform: "none",
                    fontWeight: 900,
                    fontSize: 11,
                    borderRadius: "7px",
                    borderColor: "#9c27b0",
                    color: "#9c27b0",
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
                    minHeight: 26,
                    py: 0,
                    textTransform: "none",
                    fontWeight: 900,
                    fontSize: 11,
                    borderRadius: "7px",
                    backgroundColor: "#2e7d32",
                    boxShadow: "none",
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
                  width: 30,
                  height: 30,
                  mx: "auto",
                  mb: 0.5,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(156,39,176,0.1)",
                  color: "#9c27b0",
                  fontSize: 18,
                  fontWeight: 900,
                }}
              >
                ✓
              </Box>

              <Typography
                sx={{
                  fontWeight: 900,
                  color: "#1f1f1f",
                  mb: 0.2,
                  fontSize: 12,
                }}
              >
                Study submitted
              </Typography>

              <Typography
                sx={{
                  display: "block",
                  color: "#555",
                  lineHeight: 1.2,
                  mb: 0.75,
                  fontSize: 9.5,
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
                  minHeight: 27,
                  py: 0,
                  textTransform: "none",
                  fontWeight: 900,
                  fontSize: 11,
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #9c27b0, #673ab7)",
                  boxShadow: "none",
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
