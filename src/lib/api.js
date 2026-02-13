/* ========================================================
   SBACEM Distribution Pro — API Client
   ========================================================
   Clean, minimal API abstraction layer.
   Single point of contact with the backend.
   ======================================================== */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://129.121.39.128:8080';

/**
 * Upload a ZIP file and return the job ID.
 * @param {File} file
 * @param {function} onProgress - optional XHR progress callback
 * @returns {Promise<{job_id: string}>}
 */
export async function uploadZip(file, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', file);

    xhr.open('POST', `${BASE_URL}/api/upload`);

    if (onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      });
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(`Upload failed: ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(formData);
  });
}

/**
 * Poll the processing status of a job.
 * @param {string} jobId
 * @returns {Promise<object>}
 */
export async function getJobStatus(jobId) {
  const res = await fetch(`${BASE_URL}/api/status/${jobId}`);
  if (!res.ok) throw new Error(`Status check failed: ${res.status}`);
  return res.json();
}

/**
 * Get the download URL for the consolidated spreadsheet.
 * @param {string} jobId
 * @returns {string}
 */
export function getConsolidatedUrl(jobId) {
  return `${BASE_URL}/api/download/consolidado/${jobId}`;
}

/**
 * Get the download URL for the PDFs ZIP.
 * @param {string} jobId
 * @returns {string}
 */
export function getPdfsUrl(jobId) {
  return `${BASE_URL}/api/download/pdfs/${jobId}`;
}

/**
 * Poll job status at intervals until completed or failed.
 * @param {string} jobId
 * @param {function} onUpdate - called with status object on each poll
 * @param {number} intervalMs - polling interval (default 2000ms)
 * @returns {function} cancel - call to stop polling
 */
export function pollJobStatus(jobId, onUpdate, intervalMs = 2000) {
  let active = true;

  const poll = async () => {
    while (active) {
      try {
        const status = await getJobStatus(jobId);
        onUpdate(status);
        if (status.status === 'completed' || status.status === 'failed') {
          break;
        }
      } catch (err) {
        onUpdate({ status: 'error', message: err.message });
        break;
      }
      await new Promise((r) => setTimeout(r, intervalMs));
    }
  };

  poll();

  return () => { active = false; };
}
