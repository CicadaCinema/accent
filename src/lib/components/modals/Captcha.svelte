<svelte:head>
    <script src="https://www.google.com/recaptcha/api.js" async defer></script>
</svelte:head>

<script lang="ts">
    import {createEventDispatcher, onDestroy, onMount} from "svelte";
    import {Modal} from "carbon-components-svelte";
    import {RECAPTCHA_SITE_KEY} from "../../config";
    import {selectedId} from "../../stores";

    // required so that the captcha can find the captchaComplete function
    // https://stackoverflow.com/questions/59546779/
    // made changes in src/hooks.ts to accommodate this
    onMount(() => {
        window.captchaComplete = captchaComplete;
    });
    onDestroy(() => {
        window.captchaComplete = null;
    });

    function captchaComplete() {
        if ($selectedId === 0) {
            dispatch("postEvent", {
                captchaIncluded: true,
                captchaResponse: grecaptcha.getResponse(),
            });
        } else {
            dispatch("replyEvent", {
                captchaIncluded: true,
                captchaResponse: grecaptcha.getResponse(),
            });
        }

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
            data-sitekey={RECAPTCHA_SITE_KEY}
            data-callback="captchaComplete"></div>
</Modal>

<style>
    .g-recaptcha {
        margin-top: 0.4rem;
        margin-bottom: 0.4rem;
    }
</style>
