import {writable} from 'svelte/store';

// vote buttons
export const voteAction = writable(false); // false - dislike, true - like
export const voteId = writable(0);
export const voteStatus = writable(0); // 0 - no vote, 1 - vote loading, 2 - vote processed

// reply button
export const selectedId = writable(0);

// submission text box
export const submissionValue = writable("");

// error modal
// this is a custom store - see the following for background
// https://svelte.dev/tutorial/custom-stores
// https://www.koderhq.com/tutorial/svelte/store-state-management/#custom-store
function createErrorModalStore() {
    const {subscribe, set} = writable({
        visible: false,
        title: "",
        body: "",
    });

    return {
        subscribe,
        /**
         * Displays a passive modal to indicate that an error has taken place.
         * @param errorTitle the title of the modal
         * @param errorBody  the body text to be displayed in the modal
         */
        displayError: (errorTitle: string, errorBody: string) => set({
            visible: true,
            title: errorTitle,
            body: errorBody,
        }),
    };
}
export const errorModal = createErrorModalStore();
