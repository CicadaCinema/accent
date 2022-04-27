<script lang="ts">
    import {fly} from 'svelte/transition';
    import {expoIn} from "svelte/easing";

    import PostLine from "./PostLine.svelte";

    export let fetchedPostTree;
    export let BACKEND_BASE_URL: string;

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

{#if fetchedPostTree.length !== 0}
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
    </div>
{/if}

<style>
    .parent-container {
        margin: 0.2rem 0.5rem;
        border: 1px solid var(--cds-interactive-04);
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