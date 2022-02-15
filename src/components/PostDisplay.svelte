<script lang="ts">
    import {createEventDispatcher} from 'svelte';
    import {fly} from 'svelte/transition';
    import {expoIn} from "svelte/easing";

    import ThumbsUp16 from "carbon-icons-svelte/lib/ThumbsUp16";
    import ThumbsUpFilled16 from "carbon-icons-svelte/lib/ThumbsUpFilled16";
    import ThumbsDown16 from "carbon-icons-svelte/lib/ThumbsDown16";
    import ThumbsDownFilled16 from "carbon-icons-svelte/lib/ThumbsDownFilled16";
    import Reply16 from "carbon-icons-svelte/lib/Reply16";

    import {Button, InlineLoading} from "carbon-components-svelte";

    import PostLine from "./PostLine.svelte";

    export let fetchedPosts;
    export let fetchedPostTree;
    export let BACKEND_BASE_URL: string;

    const dispatch = createEventDispatcher();

    function replyClicked() {
        dispatch("updateReply", {
            isPostSelected,
            selectedId,
        });
    }

    let isShaking = false;
    let voteAction = false; // false - dislike, true - like
    let voteId = 0;
    let voteStatus = 0; // 0 - no vote, 1 - vote loading, 2 - vote processed
    let isPostSelected = false;
    let selectedId = 0;

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

{#if fetchedPosts.length !== 0}
    <div
            class:shaking="{isShaking}"
            in:fly="{{ y: -500, duration: 1200, easing:expoIn }}"
            on:introend="{() => {
                isShaking = true;
            }}"
    >
        <div class="parent-container">
            <PostLine
                    bind:voteAction={voteAction}
                    bind:voteId={voteId}
                    bind:voteStatus={voteStatus}
                    bind:isPostSelected={isPostSelected}
                    bind:selectedId={selectedId}

                    content={fetchedPostTree[0].content}
                    id={fetchedPostTree[0].id}
                    children={fetchedPostTree[0].children}
            />
        </div>
        {#if false}
            {#each fetchedPosts as {postContent, id, path}}
                <div class="parent-container">
                    <!-- https://en.wikipedia.org/wiki/Block_Elements -->
                    <!-- https://en.wikipedia.org/wiki/Arrow_(symbol) -->
                    <p class="text-post">
                        {"⠀".repeat(Math.max(path.split("/").length - 3, 0)) +
                        (path.split("/").length > 2 ? "↳ " : " ") +
                        postContent}
                    </p>
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
            {/each}
        {/if}
    </div>
{/if}

<style>
    .parent-container {
        margin: 0.2rem 0.5rem;
        border: 1px solid var(--cds-interactive-04);
    }

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