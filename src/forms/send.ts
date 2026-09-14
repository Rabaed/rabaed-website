import type { SubmissionOutcome } from './definition';

/**
 * Sends a form to the site (`src/app/(forms)/api/forms/`), reporting how much
 * of it has gone as it goes — for a form with documents, most of the request —
 * and resolving with what the server said. A request that never reaches the
 * server resolves as a failure, in `failed`'s words.
 *
 * `XMLHttpRequest` rather than `fetch`: only it reports an upload's progress.
 */
export function sendForm(
  formId: string,
  data: FormData,
  onProgress: (fraction: number) => void,
  failed: string,
): Promise<SubmissionOutcome> {
  return new Promise((resolve) => {
    const request = new XMLHttpRequest();
    request.open('POST', `/api/forms/${formId}`);
    request.responseType = 'json';
    request.upload.onprogress = (event) => {
      if (event.lengthComputable && event.total > 0) onProgress(event.loaded / event.total);
    };
    const failure = () => resolve({ outcome: 'failed', message: failed });
    request.onload = () => {
      const answer = request.response as SubmissionOutcome | null;
      if (answer && typeof answer === 'object' && 'outcome' in answer) resolve(answer);
      else failure();
    };
    request.onerror = failure;
    request.onabort = failure;
    request.ontimeout = failure;
    request.send(data);
  });
}
