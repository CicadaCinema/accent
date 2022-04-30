<script lang="ts">
    import {fly} from 'svelte/transition';
    import {expoIn} from "svelte/easing";

    import PostLine from "./PostLine.svelte";

    export let fetchedPostTree;

    let isShaking = false;
</script>

{#if Object.entries(fetchedPostTree).length !== 0}
    <div
            class:shaking="{isShaking}"
            in:fly="{{ y: -500, duration: 1200, easing:expoIn }}"
            on:introend="{() => {
                isShaking = true;
            }}"
    >
        <div class="parent-container">
            <PostLine
                    on:voteEvent
                    content={fetchedPostTree.content}
                    id={fetchedPostTree.id}
                    children={fetchedPostTree.children}
            />
        </div>
    </div>
{/if}

<style>
    .parent-container {
        margin-bottom: 2rem;
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
