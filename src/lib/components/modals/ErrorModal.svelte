<script lang="ts">
    import {Modal} from "carbon-components-svelte";

    import {errorModal} from '../../stores';
</script>

<Modal
        passiveModal
        bind:open={$errorModal.visible}
        modalHeading={$errorModal.title}
>
    <p>{$errorModal.body}</p>
</Modal>
