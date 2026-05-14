CREATE INDEX "speech_attempts_userId_targetId_accuracy_idx" ON "speech_attempts"("userId", "targetId", "accuracy");

CREATE INDEX "speech_attempts_userId_targetId_isPassed_idx" ON "speech_attempts"("userId", "targetId", "isPassed");
