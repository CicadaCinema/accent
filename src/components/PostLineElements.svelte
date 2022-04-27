<script lang="ts">
    import {createEventDispatcher} from 'svelte';

    import {Button, InlineLoading} from "carbon-components-svelte";
    import Reply16 from "carbon-icons-svelte/lib/Reply16";
    import ThumbsUp16 from "carbon-icons-svelte/lib/ThumbsUp16";
    import ThumbsUpFilled16 from "carbon-icons-svelte/lib/ThumbsUpFilled16";
    import ThumbsDown16 from "carbon-icons-svelte/lib/ThumbsDown16";
    import ThumbsDownFilled16 from "carbon-icons-svelte/lib/ThumbsDownFilled16";

    import {voteAction, voteId, voteStatus, selectedId} from '../stores.ts';

    export let content: string;
    export let id: number;

    function dispatchVote(action: boolean, targetId: number) {
        dispatch("voteEvent", {
            action: action,
            targetId: targetId,
        });
    }

    const dispatch = createEventDispatcher();
</script>

<div>
    <p>{content}</p>
    {#if $voteStatus === 1 && $voteId === id && $voteAction}
        <InlineLoading style="padding-right: 0.5rem; padding-left: 1rem; width:auto; margin-left: auto;"/>
    {:else}
        <Button
                style="margin-left: auto;"
                disabled={$voteStatus === 2}
                kind="ghost"
                iconDescription="Like"
                icon={$voteStatus === 2 &&
							$voteId === id &&
							$voteAction
								? ThumbsUpFilled16
								: ThumbsUp16}
                on:click={() => dispatchVote(true, id)}
        />
    {/if}
    {#if $voteStatus === 1 && $voteId === id && !$voteAction}
        <InlineLoading style="padding-right: 0.5rem; padding-left: 1rem; width:auto;"/>
    {:else}
        <Button
                disabled={$voteStatus === 2}
                kind="ghost"
                iconDescription="Dislike"
                icon={
                $voteStatus === 2 &&
                $voteId === id &&
                !$voteAction
                ? ThumbsDownFilled16
                : ThumbsDown16
                }
                on:click={() => dispatchVote(false, id)}
        />
    {/if}
    <Button
            kind="ghost"
            isSelected={$selectedId === id}
            iconDescription="Reply"
            icon={Reply16}
            on:click={() => {
                if ($selectedId === id) {
                    selectedId.set(0);
                } else {
                    selectedId.set(id);
                }
            }}
    />
</div>
<style>
    p {
        margin: 0.7rem 0 0 0.5rem;
    }

    div {
        display: flex;
    }
</style>