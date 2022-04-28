<script lang="ts">
    import {createEventDispatcher} from 'svelte';

    import {Button, TextInput} from "carbon-components-svelte";

    import {submissionValue, selectedId} from '../stores.ts';

    export let isCaptchaRequired: boolean;
    export let isCaptchaOpen: boolean;
    export let isLearnMoreOpen: boolean;
    export let isDisabled: boolean;
    export let isVerified: boolean;

    let submissionInvalid = false;
    let submissionInvalidText = "";

    function dispatchPost() {
        if (submissionInvalid) {
            return;
        } else if (isCaptchaRequired) {
            // trigger the post by opening captcha modal and sending an event from Captcha
            isCaptchaOpen = true;
        } else {
            // trigger the post by sending an event directly
            dispatch("postEvent", {
                captchaIncluded: false,
            });
        }
    }

    const dispatch = createEventDispatcher();
</script>

<TextInput
        light
        labelText="Enter note"
        placeholder="Think of something interesting..."
        bind:value={$submissionValue}
        invalid={submissionInvalid}
        invalidText={submissionInvalidText}
        on:input={() => {
			if ($submissionValue.length > 140) {
				submissionInvalid = true;
				submissionInvalidText = `Character limit exceeded: ${$submissionValue.length}/140`;
			} else if (submissionInvalid) {
				submissionInvalid = false;
			}
		}}
/>
<Button
        skeleton={!isVerified}
        disabled={isDisabled || submissionInvalid}
        on:click={dispatchPost}
>
    {$selectedId !== 0 ? "Reply" : "Submit"}
</Button>


<Button kind="tertiary" on:click={() => {isLearnMoreOpen = true}}>
    Learn more
</Button>
