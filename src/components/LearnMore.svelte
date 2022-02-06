<script lang="ts">
    import {Modal} from "carbon-components-svelte";

    export let isLearnMoreOpen: boolean;
</script>

<Modal
        passiveModal
        bind:open={isLearnMoreOpen}
        modalHeading="Learn more"
>
    <p>Accent is a fun website! Here's how to use it:</p>
    <p>1) Think of a profound message you want the world to know.</p>
    <p>2) Complete the captcha and let the world hear you!</p>
    <p>3) Receive back someone else's thought, and any replies to it.</p>
    <p>
        4) Vote on one of the messages you've received - if you feel
        strongly about it.
    </p>
    <p>
        5) Reply to one of the existing posts, or think of something brand
        new! Go back to step 2.
    </p>
    <br/>
    <p>
        The post you see is completely random - but Accent will never show
        you your own posts. There is a limit of one post every 15 seconds.
        If you have that many good thoughts and ideas, maybe you should
        write a book!
    </p>
    <p>Remember to have fun, and enjoy using Accent!</p>
</Modal>