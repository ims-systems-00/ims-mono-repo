// Utility functions for managing guide acknowledgments

/**
 * Reset a specific guide acknowledgment
 * @param {string} guideId - The unique ID of the guide
 */
export const resetGuideAcknowledgment = (guideId) => {
  localStorage.removeItem(`guide_${guideId}_acknowledged`);
};

/**
 * Reset all guide acknowledgments
 */
export const resetAllGuideAcknowledgment = () => {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('guide_') && key.endsWith('_acknowledged')) {
      localStorage.removeItem(key);
    }
  });
};

/**
 * Check if a guide has been acknowledged
 * @param {string} guideId - The unique ID of the guide
 * @returns {boolean} - True if acknowledged, false otherwise
 */
export const isGuideAcknowledged = (guideId) => {
  return localStorage.getItem(`guide_${guideId}_acknowledged`) === 'true';
};

/**
 * Get all acknowledged guide IDs
 * @returns {string[]} - Array of acknowledged guide IDs
 */
export const getAcknowledgedGuides = () => {
  const keys = Object.keys(localStorage);
  return keys
    .filter(key => key.startsWith('guide_') && key.endsWith('_acknowledged'))
    .map(key => key.replace('guide_', '').replace('_acknowledged', ''));
};
