<script lang="ts">
    import {Button, InlineLoading} from "carbon-components-svelte";
    import ThumbsUpFilled16 from "carbon-icons-svelte/lib/ThumbsUpFilled16";
    import ThumbsUp16 from "carbon-icons-svelte/lib/ThumbsUp16";
    import {BACKEND_BASE_URL} from "../Config.svelte";
    import Reply16 from "carbon-icons-svelte/lib/Reply16";
    import ThumbsDown16 from "carbon-icons-svelte/lib/ThumbsDown16";
    import ThumbsDownFilled16 from "carbon-icons-svelte/lib/ThumbsDownFilled16";

    export let content: string;
    export let id: number;

    export let voteAction;
    export let voteId;
    export let voteStatus;
    export let isPostSelected;
    export let selectedId;

    // TODO: maybe this can be an event that bubbles up and executes in PostDisplay?
    // not sure whether doing it this way is wasteful as this component is duplicated
    // for every displayed post
    function voteButtonCallback(action: boolean, targetId: number) {
        voteAction = action;
        voteId = targetId;
        voteStatus = 1;

        fetch(`${BACKEND_BASE_URL}/api/vote`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({postId: targetId, voteAction: action}),
        })
            .then((response) => {
                voteStatus = 2;
            })
            .catch((error) => {
                // TODO: what should happen here?
                console.log(error);
                return;
            });
    }
</script>

<div>
    <p>{content}</p>
    {#if voteStatus === 1 && voteId === id && voteAction}
        <InlineLoading style="padding-right: 0.5rem; padding-left: 1rem; width:auto;"/>
    {:else}
        <Button
                style="padding-left: 0.8rem; padding-right: 0.8rem;"
                disabled={voteStatus === 2}
                kind="ghost"
                iconDescription="Like"
                icon={voteStatus === 2 &&
							voteId === id &&
							voteAction
								? ThumbsUpFilled16
								: ThumbsUp16}
                on:click={() => voteButtonCallback(true, id)}
        />
    {/if}
    {#if voteStatus === 1 && voteId === id && !voteAction}
        <InlineLoading style="padding-right: 0.5rem; padding-left: 1rem; width:auto;"/>
    {:else}
        <Button
                style="padding-left: 0.8rem; padding-right: 0.8rem;"
                disabled={voteStatus === 2}
                kind="ghost"
                iconDescription="Dislike"
                icon={voteStatus === 2 &&
							voteId === id &&
							!voteAction
								? ThumbsDownFilled16
								: ThumbsDown16}
                on:click={() => voteButtonCallback(false, id)}
        />
    {/if}
    <Button
            style="padding-left: 0.8rem; padding-right: 0.8rem;"
            kind="ghost"
            isSelected={isPostSelected &&
							selectedId === id}
            iconDescription="Reply"
            icon={Reply16}
            on:click={() => {
							if (
								isPostSelected &&
								selectedId === id
							) {
								isPostSelected = false;
								selectedId = 0;
							} else {
								isPostSelected = true;
								selectedId = id;
							}
						}}
    />
</div>
<style>
    div {
        display: inline-block;
    }
</style>