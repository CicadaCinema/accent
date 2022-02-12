<script lang="ts">
    import {Button, TextInput} from "carbon-components-svelte";

    export let isReply: boolean;
    export let isCaptchaOpen: boolean;
    export let submissionText: string;
    export let isLearnMoreOpen: boolean;

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
        bind:value={submissionText}
        invalid={submissionInvalid}
        invalidText={submissionInvalidText}
        on:input={() => {
			if (submissionText.length > 140) {
				submissionInvalid = true;
				submissionInvalidText = `Character limit exceeded: ${submissionText.length}/140`;
			} else if (submissionInvalid) {
				submissionInvalid = false;
			}
		}}
/>

<Button on:click={submitButtonCallback}>
    {isReply ? "Reply" : "Submit"}
</Button>

<Button kind="tertiary" on:click={() => {isLearnMoreOpen = true}}>
    Learn more
</Button>