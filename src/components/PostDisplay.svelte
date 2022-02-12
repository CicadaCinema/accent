<script lang="ts">
    import {fly} from 'svelte/transition';
    import {expoIn} from "svelte/easing";

    import ThumbsUp16 from "carbon-icons-svelte/lib/ThumbsUp16";
    import ThumbsUpFilled16 from "carbon-icons-svelte/lib/ThumbsUpFilled16";
    import ThumbsDown16 from "carbon-icons-svelte/lib/ThumbsDown16";
    import ThumbsDownFilled16 from "carbon-icons-svelte/lib/ThumbsDownFilled16";
    import Reply16 from "carbon-icons-svelte/lib/Reply16";

    import {Button, Column, Grid, InlineLoading, Row} from "carbon-components-svelte";

    export let fetchedPosts;
    export let uiStatus; // TODO: only export uiStatus.voteAction uiStatus.voteId and uiStatus.voteStatus
    export let BACKEND_BASE_URL: string;

    let isShaking = false;

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

{#if fetchedPosts.length !== 0}
    <div
            class:shaking="{isShaking}"
            in:fly="{{ y: -500, duration: 1200, easing:expoIn }}"
            on:introend="{() => {
                isShaking = true;
            }}"
    >
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
                            isSelected={uiStatus.isPostSelected &&
							uiStatus.selectedId === id}
                            iconDescription="Reply"
                            icon={Reply16}
                            on:click={() => {
							if (
								uiStatus.isPostSelected &&
								uiStatus.selectedId === id
							) {
								uiStatus.isPostSelected = false;
								uiStatus.selectedId = 0;
							} else {
								uiStatus.isPostSelected = true;
								uiStatus.selectedId = id;
							}
						}}
                    />
                </Row>
            {/each}
        </Grid>
    </div>
{/if}

<style>
    .text-post {
        margin-top: 0.6rem;
        margin-bottom: 0.6rem;
    }

    .shaking {
        animation: shake 0.15s;
        animation-iteration-count: 1;
    }

    @keyframes shake {
        0% {
            transform: translate(1px, 1px)
        }
        10% {
            transform: translate(-1px, -2px)
        }
        20% {
            transform: translate(-3px, 0px)
        }
        30% {
            transform: translate(3px, 2px)
        }
        40% {
            transform: translate(1px, -1px)
        }
        50% {
            transform: translate(-1px, 2px)
        }
        60% {
            transform: translate(-3px, 1px)
        }
        70% {
            transform: translate(3px, 1px)
        }
        80% {
            transform: translate(-1px, -1px)
        }
        90% {
            transform: translate(1px, 2px)
        }
        100% {
            transform: translate(1px, -2px)
        }
    }
</style>