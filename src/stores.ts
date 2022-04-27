import {writable} from 'svelte/store';

export const voteAction = writable(false); // false - dislike, true - like
export const voteId = writable(0);
export const voteStatus = writable(0); // 0 - no vote, 1 - vote loading, 2 - vote processed
export const selectedId = writable(0);
export const submissionValue = writable("");