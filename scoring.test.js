export function levenshteinDistance(a, b) {
  const s1 = String(a || "").trim().toLowerCase();
  const s2 = String(b || "").trim().toLowerCase();
  const dp = Array.from({ length: s1.length + 1 }, () => Array(s2.length + 1).fill(0));

  for (let i = 0; i <= s1.length; i++) dp[i][0] = i;
  for (let j = 0; j <= s2.length; j++) dp[0][j] = j;

  for (let i = 1; i <= s1.length; i++) {
    for (let j = 1; j <= s2.length; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[s1.length][s2.length];
}

export function evaluatePronunciation(spoken, target) {
  const cleanSpoken = String(spoken || "").trim().toLowerCase();
  const cleanTarget = String(target || "").trim().toLowerCase();

  if (!cleanSpoken || !cleanTarget) {
    return { score: 0, distance: 99, passed: false, feedback: "No speech input detected." };
  }

  const distance = levenshteinDistance(cleanSpoken, cleanTarget);
  const maxLen = Math.max(cleanSpoken.length, cleanTarget.length);
  let score = Math.max(0, Math.round(((maxLen - distance) / maxLen) * 100));

  if (distance <= 2 && score < 95) {
    score = distance === 0 ? 100 : 95;
  }

  const passed = score >= 80 || distance <= 2;
  return {
    score,
    distance,
    passed,
    feedback: passed
      ? "Excellent! Pronunciation mastered."
      : `Close! Try emphasizing each syllable of "${target}".`,
  };
}
