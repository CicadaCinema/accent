<script lang="ts">
    import {createEventDispatcher, onDestroy, onMount} from "svelte";
    import {Modal} from "carbon-components-svelte";

    // required so that the captcha can find the captchaComplete function
    // https://stackoverflow.com/questions/59546779/
    onMount(() => {
        window.captchaComplete = captchaComplete;
    });
    onDestroy(() => {
        window.captchaComplete = null;
    });

    function captchaComplete() {
        dispatch("captchaComplete", {
            captchaResponse: grecaptcha.getResponse()
        });

        grecaptcha.reset();
    }

    export let isCaptchaOpen: boolean;

    const dispatch = createEventDispatcher();
</script>

<Modal
        passiveModal
        bind:open={isCaptchaOpen}
        modalHeading="Verification"
>
    <div
            class="g-recaptcha"
            data-sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
            data-callback="captchaComplete"></div>
</Modal>

<style>
    .g-recaptcha {
        margin-top: 0.4rem;
        margin-bottom: 0.4rem;
    }
</style>