<script lang="ts">
    import {Modal} from "carbon-components-svelte";

    import {errorModal} from '../../stores';
</script>

<!-- TODO: cannot click out of error modal, get 'Uncaught TypeError: errorModal.set is not a function' -->
<Modal
        passiveModal
        bind:open={$errorModal.visible}
        modalHeading={$errorModal.title}
>
    <p>{$errorModal.body}</p>
</Modal>
