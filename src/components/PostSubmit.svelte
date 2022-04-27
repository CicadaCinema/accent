<script lang="ts">
    import {Button, TextInput} from "carbon-components-svelte";

    import {submissionValue, selectedId} from '../stores.ts';

    export let isCaptchaOpen: boolean;
    export let isLearnMoreOpen: boolean;
    export let isDisabled: boolean;

    let submissionInvalid = false;
    let submissionInvalidText = "";

    function submitButtonCallback() {
        if (!submissionInvalid) {
            isCaptchaOpen = true
        }
    }
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
        disabled={isDisabled || submissionInvalid}
        on:click={submitButtonCallback}
>
    {$selectedId !== 0 ? "Reply" : "Submit"}
</Button>

<Button kind="tertiary" on:click={() => {isLearnMoreOpen = true}}>
    Learn more
</Button>