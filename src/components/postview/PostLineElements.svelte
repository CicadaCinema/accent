<script lang="ts">
    import {createEventDispatcher} from 'svelte';

    import {Button, InlineLoading} from "carbon-components-svelte";
    import Reply16 from "carbon-icons-svelte/lib/Reply16";
    import ThumbsUp16 from "carbon-icons-svelte/lib/ThumbsUp16";
    import ThumbsUpFilled16 from "carbon-icons-svelte/lib/ThumbsUpFilled16";
    import ThumbsDown16 from "carbon-icons-svelte/lib/ThumbsDown16";
    import ThumbsDownFilled16 from "carbon-icons-svelte/lib/ThumbsDownFilled16";

    import {selectedId, voteAction, voteId, voteMap, voteStatus} from '../../stores.ts';

    export let content: string;
    export let id: number;

    let displayVotes: boolean = false;
    let likeCount: number = 0;
    let dislikeCount: number = 0;

    // update the like and dislike counters for this post/reply
    voteMap.subscribe(value => {
        // I have NO idea why id is a string upon compilation, so I'll convert it manually
        let idNum: number = parseInt(id.toString());

        if (value.has(idNum)) {
            likeCount = value.get(idNum).likes;
            dislikeCount = value.get(idNum).dislikes;
            displayVotes = true;
        } else {
            displayVotes = false;
        }
    });

    function dispatchVote(action: boolean, targetId: number) {
        dispatch("voteEvent", {
            action: action,
            targetId: targetId,
        });
    }

    const dispatch = createEventDispatcher();
</script>

<div>
    <p style="margin-right: auto;">{content}</p>
    {#if displayVotes}
        <p title="likes | dislikes" style="margin-right: 0.5rem;">{likeCount} | {dislikeCount * -1}</p>
    {/if}
    {#if $voteStatus === 1 && $voteId === id && $voteAction}
        <InlineLoading style="padding-right: 0.5rem; padding-left: 1rem; width:auto;"/>
    {:else}
        <Button
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
                icon={$voteStatus === 2 &&
                            $voteId === id &&
                            !$voteAction
                                ? ThumbsDownFilled16
                                : ThumbsDown16}
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
