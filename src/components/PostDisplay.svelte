<script lang="ts">
    import ThumbsUp16 from "carbon-icons-svelte/lib/ThumbsUp16";
    import ThumbsUpFilled16 from "carbon-icons-svelte/lib/ThumbsUpFilled16";
    import ThumbsDown16 from "carbon-icons-svelte/lib/ThumbsDown16";
    import ThumbsDownFilled16 from "carbon-icons-svelte/lib/ThumbsDownFilled16";
    import Reply16 from "carbon-icons-svelte/lib/Reply16";

    import {Button, Column, Grid, InlineLoading, Row} from "carbon-components-svelte";

    export let fetchedPosts;
    export let uiStatus;
    export let BACKEND_BASE_URL;

    function voteButtonCallback(action: boolean, targetId: number) {
        uiStatus.voteAction = action;
        uiStatus.voteId = targetId;
        uiStatus.voteStatus = 1;

        fetch(`${BACKEND_BASE_URL}/api/vote`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({postId: targetId, voteAction: action}),
        })
            .then((response) => {
                uiStatus.voteStatus = 2;
            })
            .catch((error) => {
                // TODO: what should happen here?
                console.log(error);
                return;
            });
    }
</script>

<Grid style="padding:0;">
    {#each fetchedPosts as {postContent, id, path}}
        <Row style="flex-wrap: nowrap; margin: 0.5rem; outline: 1px solid var(--cds-interactive-04);">
            <!-- https://en.wikipedia.org/wiki/Block_Elements -->
            <!-- https://en.wikipedia.org/wiki/Arrow_(symbol) -->
            <Column>
                <p class="text-post">
                    {"⠀".repeat(Math.max(path.split("/").length - 3, 0)) +
                    (path.split("/").length > 2 ? "↳ " : " ") +
                    postContent}
                </p>

            </Column>
            {#if uiStatus.voteStatus === 1 && uiStatus.voteId === id && uiStatus.voteAction}
                <InlineLoading style="padding-right: 0.5rem; padding-left: 1rem; width:auto;"/>
            {:else}
                <Button
                        style="padding-left: 0.8rem; padding-right: 0.8rem;"
                        disabled={uiStatus.voteStatus === 2}
                        kind="ghost"
                        iconDescription="Like"
                        icon={uiStatus.voteStatus === 2 &&
							uiStatus.voteId === id &&
							uiStatus.voteAction
								? ThumbsUpFilled16
								: ThumbsUp16}
                        on:click={() => voteButtonCallback(true, id)}
                />
            {/if}
            {#if uiStatus.voteStatus === 1 && uiStatus.voteId === id && !uiStatus.voteAction}
                <InlineLoading style="padding-right: 0.5rem; padding-left: 1rem; width:auto;"/>
            {:else}
                <Button
                        style="padding-left: 0.8rem; padding-right: 0.8rem;"
                        disabled={uiStatus.voteStatus === 2}
                        kind="ghost"
                        iconDescription="Dislike"
                        icon={uiStatus.voteStatus === 2 &&
							uiStatus.voteId === id &&
							!uiStatus.voteAction
								? ThumbsDownFilled16
								: ThumbsDown16}
                        on:click={() => voteButtonCallback(false, id)}
                />
            {/if}
            <Button
                    style="padding-left: 0.8rem; padding-right: 0.8rem;"
                    kind="ghost"
                    isSelected={uiStatus.postSelected &&
							uiStatus.selectedId === id}
                    iconDescription="Reply"
                    icon={Reply16}
                    on:click={() => {
							if (
								uiStatus.postSelected &&
								uiStatus.selectedId === id
							) {
								uiStatus.postSelected = false;
								uiStatus.selectedId = 0;
							} else {
								uiStatus.postSelected = true;
								uiStatus.selectedId = id;
							}
						}}
            />
        </Row>
    {/each}
</Grid>

<style>
    .text-post {
        margin-top: 0.6rem;
        margin-bottom: 0.6rem;
    }
</style>